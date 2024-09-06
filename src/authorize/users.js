import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();

/**
 * Returns the hashed password of the user
 * @param {string} userId
 */
export const getHashedPassword = async (userId) => {
  const result = await client.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { id: { S: userId } },
      ProjectionExpression: 'hashed_password',
    }),
  );
  return result.Item?.hashed_password?.S;
};
