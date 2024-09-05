import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

/**
 * Searches the parameters for a parameter with matching key and returns the value.
 * @param {array} parameters - The parameters array returned by SSM
 * @param {string} key - The key of the parameter to find.
 * @returns {string}
 */
const extractParameter = (parameters, key) => {
  const result = parameters.find(({ Name }) => Name === key);
  if (!result) {
    throw new Error(`Could not load secret: ${key}`);
  }
  return result.Value;
};

/**
 * Loads the encrypted secrets from the SSM Parameter Store
 */
const loadSecrets = async () => {
  const client = new SSMClient();
  const { Parameters: parameters } = await client.send(
    new GetParametersCommand({
      Names: [
        process.env.POCKET_CONSUMER_KEY_PARAM_NAME,
        process.env.POCKET_ACCESS_TOKEN_PARAM_NAME,
      ],
      WithDecryption: true,
    }),
  );
  return {
    consumerKey: extractParameter(
      parameters,
      process.env.POCKET_CONSUMER_KEY_PARAM_NAME,
    ),
    accessToken: extractParameter(
      parameters,
      process.env.POCKET_ACCESS_TOKEN_PARAM_NAME,
    ),
  };
};

// load secrets once during start up, they are not expected to change during runtime
const { consumerKey, accessToken } = await loadSecrets();

/**
 * Returns the pocket consumer key which identifies this application.
 * @returns {Promise<string>}
 */
export const getConsumerKey = async () => consumerKey;

/**
 * Returns the pocket access token which identifiers the user we are saving items for.
 * @returns {Promise<string>}
 */
export const getAccessToken = async () => accessToken;
