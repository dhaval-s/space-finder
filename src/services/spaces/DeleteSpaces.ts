import { DeleteItemCommand, DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/utils";

export async function DeleteSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (!hasAdminGroup(event)) {
        return {
            statusCode: 401,
            body: JSON.stringify(`Not authorized!`)
        }
    }

    if (event.queryStringParameters && 'id' in event.queryStringParameters) {
        const spaceId = event.queryStringParameters['id'];
        
        const deleteResult = await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {S: spaceId!}
            }
        }))

        return {
            statusCode: 200,
            body: JSON.stringify(`deleted space with id: ${spaceId}`)
        }
    } else {
        return {
            statusCode: 204,
            body: JSON.stringify('Please provider right args!')
        }
    }
}