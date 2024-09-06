import { pbkdf2 } from 'node:crypto';

/**
 * Parses a hashed password in the format $pbkdf2$digest$iterations$keyLength$salt$hash
 * @param {string} hashData - The hashed password
 */
const parse = (hashData) => {
  if (!hashData.startsWith('$pbkdf2')) {
    throw new Error('Failed to parse hash: expected pbkdf2 format');
  }
  const parts = hashData.replace('$pbkdf2$', '').split('$');
  if (parts.length !== 5) {
    throw new Error('Failed to parse hash: unexpected part length');
  }
  const [digest, iterations, keyLength, salt, hash] = parts;
  return {
    digest,
    iterations: Number(iterations),
    keyLength: Number(keyLength),
    salt,
    hash,
  };
};

/**
 * Checks to see if the password and the hashed password match
 * @param {string} password - The plaintext password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<bool>}
 */
export const check = async (password, hashedPassword) => {
  const { digest, iterations, keyLength, salt, hash } = parse(hashedPassword);
  return new Promise((resolve, reject) => {
    // invoked when the pbkdf2 call completes
    const callback = (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      // passwords match only if they result in the same hash
      resolve(hash === derivedKey.toString('base64'));
    };
    pbkdf2(password, salt, iterations, keyLength, digest, callback);
  });
};
