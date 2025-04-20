import crypto from 'crypto';

const ALG = 'aes_256-cbc'; // key length is 32 bytes

export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) throw new Error('Encryption key not found');

  const iv = crypto.randomBytes(16); // 16 bytes IV for AES-256-CBC
  const cipher = crypto.createCipheriv(ALG, Buffer.from(key), iv);

  // abcd =
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('Encryption key not found');

  const textParts = encrypted.split(':');
  const iv = Buffer.from(textParts.shift() as string, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, 'hex'), iv);
  let decryted = decipher.update(encryptedText);
  decryted = Buffer.concat([decryted, decipher.final()]);
  return decryted.toString();
};
