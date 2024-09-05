export const handler = async (event) => {
  console.log(`hello world: ${JSON.stringify(event)}`);
  return { isAuthorized: false };
};
