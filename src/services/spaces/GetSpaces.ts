import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function GetSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (event.queryStringParameters) {
        if ('id' in event.queryStringParameters) {
            const spaceId = event.queryStringParameters['id'];
            const getItemResponse = await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': {S: spaceId!}
                }
            }))

            if (getItemResponse.Item) {
                const unmarshalledItem = unmarshall(getItemResponse.Item);
                return {
                    statusCode: 200,
                    body: JSON.stringify(unmarshalledItem)
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify(`space with id ${spaceId} Not Found!`)
                }
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify('id Required')
            }
        }
    }

    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME
    }))

    const unmarshalledItem = result.Items?.map(item => unmarshall(item));
    console.log(unmarshalledItem);
    return {
        statusCode: 201,
        body: JSON.stringify(unmarshalledItem)
    }

}