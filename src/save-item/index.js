import { getSecrets } from './getSecrets.js';
import { addItem } from './pocketApi.js';
import { getItemUrl, memoize, response } from './util.js';

const getSecretsMemoized = memoize(getSecrets);

export const handler = async (event) => {
  try {
    const url = getItemUrl(event);
    if (!url) {
      return response(400, 'Bad Request');
    }
    const { consumerKey, accessToken } = await getSecretsMemoized();
    const pocketResponse = await addItem(url, consumerKey, accessToken);
    // display Pocket API errors to the users
    if (!pocketResponse.ok) {
      return response(
        pocketResponse.status,
        `Pocket integration failed with message: ${pocketResponse.headers.get('x-error')}`,
      );
    }
    return response(200, 'Item saved');
  } catch (error) {
    console.error('Unhandled exception', error);
    return response(500, 'Failed to save item');
  }
};
