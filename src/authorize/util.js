/**
 * Decodes the base64 encoded string
 * @param {string} str - The base64 encoded string
 * @returns {string} The decoded string
 */
const base64Decode = (str) => Buffer.from(str, 'base64').toString('utf8');

/**
 * Returns the username and password from the basic authorization header
 * @param {string} basicAuth - The basic authorization header
 * @returns {[string,string]} The username and password
 */
export const parseBasicAuth = (basicAuth) => {
  if (!basicAuth || !basicAuth.startsWith('Basic ')) {
    throw new Error('Invalid basic authorization header');
  }
  const decoded = base64Decode(basicAuth.replace('Basic', '').trim());
  const [username, password] = decoded.split(':');
  if (!username || !password) {
    throw new Error('Could not parse basic authorization header');
  }
  return [username, password];
};

/**
 * Returns the expected authorization response
 * @param {bool} authorized - Is the user authorized?
 */
export const response = (authorized) => ({
  isAuthorized: !!authorized,
  context: {},
});
