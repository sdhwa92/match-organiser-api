import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      hostUserId: event.requestContext.identity.cognitoIdentityId,
      matchId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "" +
      "SET description = :description, " +
      "matchDate = :matchDate, " +
      "numOfPlayers = :numOfPlayers, " +
      "numOfTeams = :numOfTeams, " +
      "players = :players, " +
      "title = :title",
    ExpressionAttributeValues: {
      ":description": data.description || null,
      ":matchDate": data.matchDate || null,
      ":numOfPlayers": data.numOfPlayers || null,
      ":numOfTeams": data.numOfTeams || null,
      ":players": data.players || [],
      ":title": data.title || null
    },
    // 'ReturnValue' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update.
    ReturnValues: "ALL_NEW"
  };

  try {
    let result = await dynamoDbLib.call("update", params);
    console.log(result);
    return success({status: true});
  } catch (e) {
    console.log(e);
    return failure({status: false});
  }
}
