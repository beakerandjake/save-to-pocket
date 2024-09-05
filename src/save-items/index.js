export const handler = async (event) => {
  console.log(
    `access key param name: ${process.env.POCKET_ACCESS_KEY_PARAM_NAME}`,
  );
  console.log(
    `consumer key param name: ${process.env.POCKET_CONSUMER_KEY_PARAM_NAME}`,
  );
  console.log(`hello: ${JSON.stringify(event)}`);
  return {
    statusCode: 200,
    body: JSON.stringify('Great Job'),
  };
};
