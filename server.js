import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// WebAuthn Configuration Helper (Dynamic for localhost & production domains)
function getWebAuthnConfig(req) {
  const originHeader = req.get('origin') || (req.get('referer') ? new URL(req.get('referer')).origin : null);
  
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://network-security-portfolio.vercel.app',
  ];

  if (process.env.EXPECTED_ORIGIN && !allowedOrigins.includes(process.env.EXPECTED_ORIGIN)) {
    allowedOrigins.push(process.env.EXPECTED_ORIGIN);
  }

  let resolvedRpID = 'localhost';

  if (originHeader) {
    try {
      const parsed = new URL(originHeader);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        resolvedRpID = 'localhost';
      } else {
        resolvedRpID = parsed.hostname;
      }
      if (!allowedOrigins.includes(originHeader)) {
        allowedOrigins.push(originHeader);
      }
    } catch (e) {
      resolvedRpID = 'localhost';
    }
  } else if (process.env.RP_ID) {
    resolvedRpID = process.env.RP_ID;
  }

  return {
    rpID: resolvedRpID,
    expectedOrigin: allowedOrigins,
  };
}

// --- Supabase Client & In-Memory Fallback Store ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`[Database] Connected to Supabase: ${supabaseUrl}`);
} else {
  console.log('[Database] Running in In-Memory fallback mode. (Add SUPABASE_URL to .env to use Supabase)');
}

const memoryStore = {
  users: {},
  passkeys: {},
  sessions: {},
  challenges: {},
  vaultItems: {},
};

const activeSessionKeys = {};

// --- Database Access Helpers (Supabase with In-Memory fallback) ---
async function dbGetUser(username) {
  if (supabase) {
    const { data } = await supabase.from('users').select('*').eq('username', username).single();
    return data;
  }
  return memoryStore.users[username] || null;
}

async function dbCreateUser(username) {
  if (supabase) {
    const { data, error } = await supabase.from('users').upsert({ id: username, username }).select().single();
    if (error) console.error('[DB] Create user error:', error);
    return data || { id: username, username };
  }
  if (!memoryStore.users[username]) {
    memoryStore.users[username] = { id: username, username };
  }
  return memoryStore.users[username];
}

async function dbGetUserPasskeys(userHandle) {
  if (supabase) {
    const { data, error } = await supabase.from('passkeys').select('*').eq('user_handle', userHandle);
    if (error) console.error('[DB] Get passkeys error:', error);
    return (data || []).map(row => ({
      id: row.id,
      userHandle: row.user_handle,
      publicKey: Uint8Array.from(Buffer.from(row.public_key, 'base64')),
      counter: Number(row.counter),
      deviceType: row.device_type,
      backedUp: row.backed_up,
      transports: row.transports || [],
      name: row.name,
      createdAt: new Date(row.created_at),
    }));
  }
  return Object.values(memoryStore.passkeys).filter(pk => pk.userHandle === userHandle);
}

async function dbGetPasskeyById(credentialId) {
  if (supabase) {
    const { data, error } = await supabase.from('passkeys').select('*').eq('id', credentialId).single();
    if (error || !data) return null;
    return {
      id: data.id,
      userHandle: data.user_handle,
      publicKey: Uint8Array.from(Buffer.from(data.public_key, 'base64')),
      counter: Number(data.counter),
      deviceType: data.device_type,
      backedUp: data.backed_up,
      transports: data.transports || [],
      name: data.name,
      createdAt: new Date(data.created_at),
    };
  }
  return memoryStore.passkeys[credentialId] || null;
}

async function dbSavePasskey(pk) {
  if (supabase) {
    const pubKeyBase64 = Buffer.from(pk.publicKey).toString('base64');
    const { error } = await supabase.from('passkeys').upsert({
      id: pk.id,
      user_handle: pk.userHandle,
      public_key: pubKeyBase64,
      counter: pk.counter,
      device_type: pk.deviceType,
      backed_up: pk.backedUp,
      transports: pk.transports,
      name: pk.name,
    });
    if (error) console.error('[DB] Save passkey error:', error);
    return;
  }
  memoryStore.passkeys[pk.id] = pk;
}

async function dbUpdatePasskeyCounter(credentialId, newCounter) {
  if (supabase) {
    await supabase.from('passkeys').update({ counter: newCounter }).eq('id', credentialId);
    return;
  }
  if (memoryStore.passkeys[credentialId]) {
    memoryStore.passkeys[credentialId].counter = newCounter;
  }
}

async function dbDeletePasskey(credentialId) {
  if (supabase) {
    const { error } = await supabase.from('passkeys').delete().eq('id', credentialId);
    if (error) console.error('[DB] Delete passkey error:', error);
    return;
  }
  delete memoryStore.passkeys[credentialId];
}

async function dbSetChallenge(username, challenge) {
  if (supabase) {
    await supabase.from('challenges').upsert({ username, challenge });
    return;
  }
  memoryStore.challenges[username] = challenge;
}

async function dbGetChallenge(username) {
  if (supabase) {
    const { data } = await supabase.from('challenges').select('challenge').eq('username', username).single();
    return data?.challenge || null;
  }
  return memoryStore.challenges[username] || null;
}

async function dbDeleteChallenge(username) {
  if (supabase) {
    await supabase.from('challenges').delete().eq('username', username);
    return;
  }
  delete memoryStore.challenges[username];
}

async function dbCreateSession(sessionId, username) {
  if (supabase) {
    await supabase.from('sessions').upsert({ id: sessionId, username });
    return;
  }
  memoryStore.sessions[sessionId] = { username };
}

async function dbGetSession(sessionId) {
  if (supabase) {
    const { data } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
    return data ? { username: data.username } : null;
  }
  return memoryStore.sessions[sessionId] || null;
}

async function dbDeleteSession(sessionId) {
  if (supabase) {
    await supabase.from('sessions').delete().eq('id', sessionId);
    return;
  }
  delete memoryStore.sessions[sessionId];
}

async function dbGetUserVaultItems(username) {
  if (supabase) {
    const { data } = await supabase
      .from('vault_items')
      .select('id, username, title, content, created_at')
      .eq('username', username)
      .order('id');
    
    if (data && data.length > 0) {
      return data;
    }

    // Copy from DB master template ('default') so new accounts automatically get items
    const { data: defaults } = await supabase
      .from('vault_items')
      .select('title, content')
      .eq('username', 'default')
      .order('id');

    if (defaults && defaults.length > 0) {
      const newItems = defaults.map(item => ({
        username,
        title: item.title,
        content: item.content,
      }));
      const { data: inserted } = await supabase
        .from('vault_items')
        .insert(newItems)
        .select('id, username, title, content, created_at');
      return inserted || [];
    }

    return [];
  }

  return memoryStore.vaultItems[username] || [];
}

// --- Middleware: Session Authentication ---
const requireAuth = async (req, res, next) => {
  const token = req.cookies?.sessionId;
  if (!token) {
    console.warn(`[Unauthorized Access Blocked] Request to '${req.originalUrl}' blocked (No active session cookie).`);
    return res.status(401).json({ error: 'Unauthorized: Valid passkey authentication required' });
  }

  const session = await dbGetSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  const user = await dbGetUser(session.username);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  req.user = user;
  next();
};

// --- Routes ---

app.get('/api/auth/status', async (req, res) => {
  try {
    const token = req.cookies?.sessionId;
    if (token) {
      const session = await dbGetSession(token);
      if (session) {
        return res.json({ isAuthenticated: true, username: session.username });
      }
    }
    res.json({ isAuthenticated: false });
  } catch (error) {
    console.error('[Status] Error checking auth status:', error);
    res.json({ isAuthenticated: false });
  }
});

app.post('/api/auth/register/generate-options', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const user = await dbCreateUser(username);
    const userPasskeys = await dbGetUserPasskeys(user.id);
    const { rpID } = getWebAuthnConfig(req);

    const options = await generateRegistrationOptions({
      rpName: 'SEC Portfolio Vault',
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: user.username,
      attestationType: 'none',
      excludeCredentials: [],
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    await dbSetChallenge(username, options.challenge);
    console.log(`[Register] Challenge generated for '${username}': ${options.challenge}`);
    res.json(options);
  } catch (error) {
    console.error('[Register] Error generating options:', error);
    res.status(500).json({ error: error.message || 'Failed to generate registration options' });
  }
});

app.post('/api/auth/register/verify', async (req, res) => {
  try {
    const { username, name, response } = req.body;
    if (!username || !response) {
      return res.status(400).json({ error: 'Missing registration payload' });
    }

    const user = await dbGetUser(username);
    const expectedChallenge = await dbGetChallenge(username);
    
    if (!user || !expectedChallenge) {
      console.warn(`[Register] Registration session expired or challenge already used for '${username}'`);
      return res.status(400).json({ error: 'Registration session not found or expired' });
    }

    const { rpID, expectedOrigin } = getWebAuthnConfig(req);
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
      const credentialID = credential?.id || verification.registrationInfo.credentialID;
      const credentialPublicKey = credential?.publicKey || verification.registrationInfo.credentialPublicKey;
      const counter = credential?.counter ?? verification.registrationInfo.counter ?? 0;

      const existingKeys = await dbGetUserPasskeys(user.id);
      const deviceNum = existingKeys.length + 1;
      const deviceTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const finalDeviceName = `${username} - Device #${deviceNum} (${deviceTime})`;

      const newPasskey = {
        id: credentialID,
        publicKey: credentialPublicKey,
        userHandle: user.id,
        counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: credential?.transports || response.response?.transports || [],
        name: finalDeviceName,
        createdAt: new Date(),
      };

      await dbSavePasskey(newPasskey);
      await dbDeleteChallenge(username);

      const pubKeyHex = Buffer.from(credentialPublicKey).toString('hex').slice(0, 32);
      console.log(`[Register] Stored Public Key Credential in ${supabase ? 'Supabase DB' : 'Memory'} for '${username}':
  - Credential ID: ${credentialID}
  - Public Key (COSE Base64): [${pubKeyHex}...] (Length: ${credentialPublicKey.length} bytes)
  - Device Type: ${credentialDeviceType}
  - Counter: ${counter}
  - Stored Passwords: ZERO (Public-key asymmetric crypto)`);

      return res.json({ verified: true });
    }

    res.status(400).json({ error: 'Verification failed' });
  } catch (error) {
    console.error('[Register] Verification exception:', error);
    res.status(400).json({ error: error.message || 'Registration verification failed' });
  }
});

app.post('/api/auth/login/generate-options', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }
    
    const user = await dbGetUser(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPasskeys = await dbGetUserPasskeys(user.id);
    if (userPasskeys.length === 0) {
      console.warn(`[Login Rejected: Zero-Key State] User '${username}' has 0 registered passkeys.`);
      return res.status(400).json({ error: 'No passkeys registered for this account. Zero-key state reached.' });
    }

    const { rpID } = getWebAuthnConfig(req);
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 6000,
      allowCredentials: userPasskeys.map(pk => ({
        id: pk.id,
        type: 'public-key',
        transports: pk.transports,
      })),
      userVerification: 'preferred',
    });

    await dbSetChallenge(username, options.challenge);
    console.log(`[Login] Fresh challenge generated for '${username}': ${options.challenge}`);
    res.json(options);
  } catch (error) {
    console.error('[Login] Error generating login options:', error);
    res.status(500).json({ error: error.message || 'Failed to generate login options' });
  }
});

app.post('/api/auth/login/verify', async (req, res) => {
  try {
    const { username, response } = req.body;
    
    const user = await dbGetUser(username);
    const expectedChallenge = await dbGetChallenge(username);

    // Replay Attack & Nonce Check
    if (!user || !expectedChallenge) {
      console.warn(`[Login Rejected: Replay Attack / Expired Challenge] User '${username}' attempted verification with a consumed or non-existent challenge!`);
      return res.status(400).json({ error: 'Login challenge expired or already consumed (Replay attack detected)' });
    }

    const passkey = await dbGetPasskeyById(response.id);
    if (!passkey || passkey.userHandle !== user.id) {
      console.warn(`[Login Rejected: Revoked / Unknown Key] Credential ID '${response.id}' not found or does not belong to '${username}'.`);
      return res.status(400).json({ error: 'Credential not recognized or has been revoked' });
    }

    const { rpID, expectedOrigin } = getWebAuthnConfig(req);
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: passkey.publicKey,
        counter: passkey.counter,
        transports: passkey.transports,
      },
      requireUserVerification: false,
    });

    if (verification.verified) {
      await dbUpdatePasskeyCounter(response.id, verification.authenticationInfo.newCounter);
      await dbDeleteChallenge(username); // One-time challenge destruction

      const sessionId = crypto.randomUUID();
      await dbCreateSession(sessionId, username);
      activeSessionKeys[sessionId] = response.id;

      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.cookie('currentKeyId', response.id, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      console.log(`[Login Success] Valid signature verified for '${username}'. Session created: ${sessionId.slice(0, 8)}... (Active Key: ${response.id})`);
      return res.json({ verified: true });
    }

    console.warn(`[Login Rejected: Signature Mismatch] Public key signature verification failed for '${username}'.`);
    res.status(400).json({ error: 'Login verification failed' });
  } catch (error) {
    console.error('[Login] Verification exception:', error);
    res.status(400).json({ error: error.message || 'Login verification failed' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies?.sessionId;
  if (token) {
    delete activeSessionKeys[token];
    const session = await dbGetSession(token);
    if (session) {
      console.log(`[Logout] Session invalidated for user: ${session.username}`);
    }
    await dbDeleteSession(token);
  }
  res.clearCookie('sessionId');
  res.clearCookie('currentKeyId');
  res.json({ success: true });
});

app.get('/api/auth/passkeys', requireAuth, async (req, res) => {
  const currentKeyId = req.cookies?.currentKeyId || activeSessionKeys[req.cookies?.sessionId];
  const userPasskeys = await dbGetUserPasskeys(req.user.id);
  res.json(userPasskeys.map(pk => ({
    id: pk.id,
    name: pk.name,
    createdAt: pk.createdAt,
    isCurrent: pk.id === currentKeyId,
  })));
});

app.delete('/api/auth/passkeys/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const currentKeyId = req.cookies?.currentKeyId || activeSessionKeys[req.cookies?.sessionId];

  // Protect the passkey currently in use by this active session
  if (id === currentKeyId) {
    console.warn(`[Passkey Deletion Blocked] User '${req.user.username}' attempted to delete active passkey '${id}'!`);
    return res.status(400).json({
      error: '현재 로그인에 사용 중인 Passkey는 삭제할 수 없습니다.',
      code: 'ACTIVE_KEY_PROTECTED'
    });
  }

  const passkey = await dbGetPasskeyById(id);
  if (passkey && passkey.userHandle === req.user.id) {
    await dbDeletePasskey(id);
    const remaining = await dbGetUserPasskeys(req.user.id);
    console.log(`[Passkey Revoked] Key '${id}' deleted in ${supabase ? 'Supabase' : 'Memory'}. Remaining: ${remaining.length}`);
    if (remaining.length === 0) {
      console.warn(`[Zero-Key State] User '${req.user.username}' has removed all registered passkeys.`);
    }
    res.json({ success: true, remainingCount: remaining.length });
  } else {
    res.status(404).json({ error: 'Passkey not found or unauthorized' });
  }
});

// Protected Confidential Data Route (with BOLA/IDOR Protection)
app.get('/api/vault/data', requireAuth, async (req, res) => {
  const requestedUser = req.query.userId || req.query.username || req.user.username;

  // BOLA / IDOR Verification
  if (requestedUser !== req.user.username) {
    console.warn(`[Security Alert: BOLA/IDOR Prevented] Authenticated user '${req.user.username}' attempted unauthorized access to '${requestedUser}' resources!`);
    return res.status(403).json({
      error: 'Forbidden: Cross-account access denied (BOLA/IDOR protection enforced)',
      authenticatedUser: req.user.username,
      attemptedUser: requestedUser,
    });
  }

  const items = await dbGetUserVaultItems(req.user.username);
  console.log(`[Vault Data] Returned ${items.length} confidential items for '${req.user.username}'.`);
  res.json({ items });
});

app.use((err, req, res, next) => {
  console.error('[Server Unhandled Error]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WebAuthn Server] Running on http://127.0.0.1:${PORT}`);
});
