import * as crypto from 'crypto';

export function getRandomString(length: number): string {
  return crypto.randomUUID().slice(0, length);
}
