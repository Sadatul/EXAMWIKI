import crypto from 'crypto';

export function hashPassword(password) {
  const hash = crypto
    .createHmac('sha256', process.env.NEXT_PUBLIC_CRYPTO_SECRET)
    .update(password)
    .digest('hex');
  return hash;
}
