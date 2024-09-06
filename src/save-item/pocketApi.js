const POCKET_URL = 'https://getpocket.com/v3/add';

/**
 * Adds the specified url to the pocket account defined by the access_token.
 * @param {string} url - The url of the item to save
 * @param {string} consumerKey - The consumer key of this application
 * @param {string} accessToken - The access token of the user
 * @returns {Promise<Response>} See response details: https://getpocket.com/developer/docs/v3/add
 */
export const addItem = async (url, consumerKey, accessToken) => {
  if (!url) {
    throw new Error('url is required');
  }
  if (!consumerKey) {
    throw new Error('consumerKey is required');
  }
  if (!accessToken) {
    throw new Error('accessToken is required.');
  }

  return fetch(POCKET_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      url: encodeURI(url),
      consumer_key: consumerKey,
      access_token: accessToken,
    }),
  });
};
