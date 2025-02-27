import { bech32 } from 'bech32';
export function isAddress(input: string) {
  const ALLOWED_CHARS = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const regexp = new RegExp(`^([a-z]*)1([${ALLOWED_CHARS}]+)$`); // Prefix + bech32 separated by '1'

  const match = regexp.exec(input);

  try {
    if (match) {
      const decoded = bech32.decode(input);
      return decoded?.words?.length === 32;
    }
  } catch {
    return false;
  }

  return false;
}
