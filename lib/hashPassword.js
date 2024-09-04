import { pbkdf2, randomBytes } from 'node:crypto';

/**
 * Outputs a password hash in the format:
 * $pbkdf2$digest$iterations$keyLength$salt$hash
 */

const saltLength = 32;
const iterations = 100000;
const keyLength = 64;
const digest = 'sha512';

/**
 * Hashes the plaintext password using the pbkdf2 algorithm.
 * @param {string} plainTextPassword
 * @returns {Promise<{hash: string, salt:string}|Error>}
 */
const hashPassword = async (plainTextPassword) =>
  new Promise((resolve, reject) => {
    const salt = randomBytes(saltLength).toString('base64');
    const callback = (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ hash: derivedKey.toString('base64'), salt });
    };
    pbkdf2(plainTextPassword, salt, iterations, keyLength, digest, callback);
  });

const format = ({ hash, salt }) =>
  ['$pbkdf2', digest, iterations, keyLength, salt, hash].join('$');

// require user to provide password
const plainText = process.argv[2];

if (!plainText) {
  console.error(`usage: ${process.argv[1]} <password>`);
  process.exit(1);
}

try {
  const result = await hashPassword(plainText);
  console.log(format(result));
  process.exit();
} catch (e) {
  console.error('Failed to hash password:', e);
  process.exit(1);
}
