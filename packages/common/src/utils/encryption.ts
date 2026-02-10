import * as crypto from "crypto";

const saltCookie = process.env.SALT_COOKIES!;

const salt = process.env.SALT!;

const key = Buffer.from(saltCookie, "base64");

export function encrypt(plaintext: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return encrypted.toString("base64url");
}

export function decrypt(ivCiphertextB64: string) {
  const ivCiphertext = Buffer.from(ivCiphertextB64, "base64url");
  const iv = ivCiphertext.subarray(0, 16);
  const ciphertext = ivCiphertext.subarray(16);
  const cipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);
  return decrypted.toString("utf-8");
}

export function encryptMD5(input: string) {
  return crypto
    .createHash("md5")
    .update(input + salt)
    .digest("hex");
}
