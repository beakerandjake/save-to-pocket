import { getAccessToken, getConsumerKey } from './secrets.js';

const consumerKey = await getConsumerKey();
const accessToken = await getAccessToken();

export const handler = async (event) => {
  console.log(`got consumer key: ${consumerKey}`);
  console.log(`consumer key param name: ${accessToken}`);
  console.log(`hello: ${JSON.stringify(event)}`);
  return {
    statusCode: 200,
    body: JSON.stringify('Great Job'),
  };
};
