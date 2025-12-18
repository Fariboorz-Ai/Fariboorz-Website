import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const KEY = Buffer.from(process.env.ENCRYPTION_SECRET!, 'base64'); 

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';

  const [ivHex, tagHex, encryptedHex] = encryptedText.split(':');
  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);


  const decrypted = Buffer.concat([
    decipher.update(encrypted), 
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}