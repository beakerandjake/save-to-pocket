export const handler = async (event) => {
  console.log(`hello: ${JSON.stringify(event)}`);
  return {
    statusCode: 200,
    body: JSON.stringify('Great Job'),
  };
};
