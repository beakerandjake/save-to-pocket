import { parseBasicAuth, response } from './util.js';
import { getHashedPassword } from './users.js';
import { check } from './hashedPassword.js';

export const handler = async (event) => {
  try {
    const [username, password] = parseBasicAuth(event.identitySource[0]);
    // if could not load hashed password that means the user did not exist in the database
    const hashedPassword = await getHashedPassword(username);
    if (!hashedPassword) {
      throw new Error(`Login attempt for unknown user: ${username}`);
    }
    // provided password must match the users hashed password in the database
    const passwordMatch = await check(password, hashedPassword);
    if (!passwordMatch) {
      throw new Error(`Failed login attempt for user: ${username}`);
    }
    return response(true);
  } catch (error) {
    console.error('Unhandled exception', error);
    return response(false);
  }
};
