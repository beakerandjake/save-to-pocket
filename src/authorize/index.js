import { parseBasicAuth, response } from './util.js';

export const handler = async (event) => {
  try {
    console.log(`Got event: ${JSON.stringify(event)}`);
    const [username, password] = parseBasicAuth(event.identitySource[0]);
    console.log(`got: ${username}, password: ${password}`);
    return username === 'username' ? response(true) : response(false);
    // return response(true);
  } catch (error) {
    console.error('Unhandled exception', error);
    return response(false);
  }
};
