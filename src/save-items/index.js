import { getSecrets } from './getSecrets.js';
import { add } from './pocketApi.js';
import { getItemUrl, memoize, response } from './util.js';

const getSecretsMemoized = memoize(getSecrets);

export const handler = async (event) => {
  try {
    const url = getItemUrl(event);
    if (!url) {
      return response(400, 'Bad Request');
    }
    const { consumerKey, accessToken } = await getSecretsMemoized();
    await add(url, consumerKey, accessToken);
    return response(200, 'Item saved');
  } catch (error) {
    console.error('Unhandled exception', error);
    return response(500, 'Failed to save item');
  }
};
