import { v1 as uuidv1 } from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
  //-- Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    /**
     * 'Item' contains the attributes of the match to be created
     * - matchId(String): a unique uuid
     * - hostUserId(String): the match host identifies are federated through the Cognito Identity Pool,
     *                we will use the identity id as the user id of the authenticated user
     * - title(String): title of the creating match
     * - description(String): description of the creating match
     * - players(List): list of players in this match
     * - matchDate(String): date of match
     * - venue(String): where the match is going to be
     * - numOfTeams(Number): the number of teams in this event/match
     * - numOfPlayers(Number): the maximum number of players in each team of this match
     * - createdAt(Number): match created date timestamp
     */
    Item: {
      matchId: uuidv1(),
      hostUserId: event.requestContext.identity.cognitoIdentityId,
      title: data.title,
      description: data.description,
      players: [],
      matchDate: data.matchDate,
      venue: data.venue,
      numOfTeams: data.numOfTeams,
      numOfPlayers: data.numOfPlayers,
      createdDate: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.MatchDetails);
  } catch (e) {
    console.log(e);
    return failure({status: false, message: e});
  }
}
