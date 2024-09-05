import { getSecrets } from './getSecrets.js';
import { memoize } from './util.js';

const getSecretsMemoized = memoize(getSecrets);

export const handler = async (event) => {
  const { consumerKey, accessToken } = await getSecretsMemoized();
  console.log(`got consumer key: ${consumerKey}`);
  console.log(`consumer key param name: ${accessToken}`);
  console.log(`hello: ${JSON.stringify(event)}`);
  return {
    statusCode: 200,
    body: JSON.stringify('Great Job'),
  };
};
