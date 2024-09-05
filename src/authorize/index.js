import { getBasicAuth, response } from './util.js';

export const handler = async (event) => {
  try {
    const [username, password] = getBasicAuth(event);
    console.log(`got: ${username}, password: ${password}`);
    return response(true);
  } catch (error) {
    console.error('Unhandled exception', error);
    return response(false);
  }
};
