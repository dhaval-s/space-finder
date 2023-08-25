import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { GetSpaces } from "./GetSpaces";
import { UpdateSpaces } from "./UpdateSpaces";
import { DeleteSpaces } from "./DeleteSpaces";
import { JsonError, MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({})

async function handler(event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {
    
    let message: string | undefined;

    try {
        switch(event.httpMethod) {
            case 'GET':
                const getResponse = await GetSpaces(event, ddbClient);
                console.log(getResponse);
                return getResponse;
            case 'POST':
                const postResponse = await postSpaces(event, ddbClient);
                console.log(postResponse);
                return postResponse;
            case 'PUT':
                const putResponse = await UpdateSpaces(event, ddbClient);
                console.log(putResponse);
                return putResponse;
            case 'DELETE':
                    const deleteResponse = await DeleteSpaces(event, ddbClient);
                    console.log(deleteResponse);
                    return deleteResponse;
            default:
                break;
        }
    } catch (error) {
        console.error(error);

        let errorMessage = "Failed to do something exceptional";

        if (error instanceof MissingFieldError) {
            errorMessage = error.message;
            return {
                statusCode: 400,
                body: JSON.stringify(errorMessage)
            }
        }

        if (error instanceof JsonError) {
            errorMessage = error.message;
            return {
                statusCode: 400,
                body: JSON.stringify(errorMessage)
            }
        }

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            statusCode: 500,
            body: JSON.stringify(errorMessage)
        }
    }
    
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }
    return response;
}

export { handler }