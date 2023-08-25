import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsSpaceEntry } from "../shared/Validator";
import { createRandomId, parseJSON } from "../shared/utils";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const randomId = createRandomId();
    let item = parseJSON(event.body || '{}');
    item.id = randomId;
    validateAsSpaceEntry(item);

    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
        // Item: {
        //     id: {
        //         S: randomId
        //     },
        //     location: {
        //         S: item.location
        //     }
        // }
    }))
    console.log(result);
    return {
        statusCode: 200,
        body: JSON.stringify({id: randomId})
    }

}