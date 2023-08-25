import * as cdk from 'aws-cdk-lib'
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { AuthorizationToken } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
    spacesLamdaIntegration: LambdaIntegration,
    userPool: IUserPool;
}

export class ApiStack extends cdk.Stack {
    
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props)

        const api = new RestApi(this, 'SpacesApi');
        
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
            cognitoUserPools:[props.userPool],
            identitySource: 'method.request.header.Authorization'
        });
        authorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }

        const spaceResource = api.root.addResource('spaces')
        spaceResource.addMethod('GET', props.spacesLamdaIntegration, optionsWithAuth)
        spaceResource.addMethod('POST', props.spacesLamdaIntegration, optionsWithAuth)
        spaceResource.addMethod('PUT', props.spacesLamdaIntegration, optionsWithAuth);
        spaceResource.addMethod('DELETE', props.spacesLamdaIntegration, optionsWithAuth);
    }
}