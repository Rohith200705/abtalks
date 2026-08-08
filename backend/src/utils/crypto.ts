import crypto from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-me';

export const encrypt = (text: string): string => {
  return crypto.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decrypt = (encryptedText: string): string => {
  const bytes = crypto.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(crypto.enc.Utf8);
};
