/**
 * Returns the username and password from the basic authorization header
 * @param {object} event - The API gateway event
 * @returns {[string,string]} The username and password
 */
export const getBasicAuth = (event) => {
  console.log(event);
  const header = event?.headers?.authorization;
  if (!header || !header.startsWith('Basic ')) {
    throw new Error('Could not get basic authorization Header');
  }
  const encoded = Buffer.from(header.replace('Basic ', '').trim(), 'base64');
  const decoded = encoded.toString('utf8');
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
