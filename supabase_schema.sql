-- Supabase WebAuthn Passkeys & Vault Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Passkeys Table (Stores public keys - NO PASSWORDS)
CREATE TABLE IF NOT EXISTS public.passkeys (
  id TEXT PRIMARY KEY,                       -- credentialID (base64url)
  user_handle TEXT NOT NULL,                  -- username / userID
  public_key TEXT NOT NULL,                   -- COSE public key (base64 encoded)
  counter BIGINT DEFAULT 0,                  -- Replay protection counter
  device_type TEXT DEFAULT 'singleDevice',
  backed_up BOOLEAN DEFAULT FALSE,
  transports TEXT[] DEFAULT '{}',
  name TEXT NOT NULL,                         -- Friendly device name
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY,                       -- sessionId (UUID)
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Challenges Table (Ephemeral nonces for replay prevention)
CREATE TABLE IF NOT EXISTS public.challenges (
  username TEXT PRIMARY KEY,
  challenge TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vault Items Table (Confidential items per user)
CREATE TABLE IF NOT EXISTS public.vault_items (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) for all tables
-- Backend server uses SUPABASE_SERVICE_ROLE_KEY which automatically bypasses RLS.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_items ENABLE ROW LEVEL SECURITY;

-- 7. Read Policies for Supabase Dashboard View
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read for passkeys') THEN
    CREATE POLICY "Allow read for passkeys" ON public.passkeys FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read for users') THEN
    CREATE POLICY "Allow read for users" ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read for vault_items') THEN
    CREATE POLICY "Allow read for vault_items" ON public.vault_items FOR SELECT USING (true);
  END IF;
END $$;
