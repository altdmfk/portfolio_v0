/**
 * Web Crypto API (AES-256-GCM + PBKDF2) 암호화 / 복호화 유틸리티
 * 
 * - 프론트엔드 코드나 빌드 파일(Bundle)에 원본 개인정보 및 비밀번호를 남기지 않음
 * - F12 개발자 도구로 소스코드를 열어보더라도 암호화된 Hex 문자열만 보이므로 안전함
 */

function hexToUint8(hexString) {
  if (!hexString) return new Uint8Array();
  const bytes = hexString.match(/.{1,2}/g);
  return new Uint8Array(bytes ? bytes.map(byte => parseInt(byte, 16)) : []);
}

function uint8ToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 암호화 함수 (새로운 암호문 생성 시 활용 가능)
 */
export async function encryptSecretPayload(dataObj, password) {
  const enc = new TextEncoder();
  const text = JSON.stringify(dataObj);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(text)
  );

  return {
    ciphertext: uint8ToHex(new Uint8Array(encryptedBuffer)),
    salt: uint8ToHex(salt),
    iv: uint8ToHex(iv)
  };
}

/**
 * 복호화 함수 (사용자가 입력한 비밀번호로 AES-256-GCM 복호화)
 */
export async function decryptSecretPayload(payload, password) {
  try {
    const saltBytes = hexToUint8(payload.salt);
    const ivBytes = hexToUint8(payload.iv);
    const cipherBytes = hexToUint8(payload.ciphertext);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      key,
      cipherBytes
    );

    const decodedText = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decodedText);
  } catch (err) {
    throw new Error("비밀번호가 올바르지 않거나 데이터 복호화에 실패했습니다.");
  }
}

/**
 * 기본 암호화 데이터 (AES-256-GCM)
 */
export const DEFAULT_ENCRYPTED_SECRET = {
  ciphertext: "36eca5d57a6e9f678443ff3ca2b11c80ff1b78a90b3c83e14dc1e9e8a201ff6a0b0f0197fef207d4cd2bef7a2fe21297f575d534493a950119e47a8f6b955bcc348684131698d2",
  salt: "5d98ac7f33173e2ab4559919333667c2",
  iv: "c01470b113cb4b19447bc49a"
};
