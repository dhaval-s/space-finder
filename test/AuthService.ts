import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'ap-south-1'

Amplify.configure({
    Auth: {
        region: awsRegion,
        userPoolId: 'ap-south-1_uLUGi9vEF',
        userPoolWebClientId: 'oq34h6htevjlnq9h1erj1fvf6',
        identityPoolId: 'ap-south-1:fc5b9a77-2131-4f08-9b3c-bce9b6860b08',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {

    public async login(userName: string, password: string) {
        const result = await Auth.signIn(userName, password) as CognitoUser;
        return result;
    }

    public async generateTemporaryCredentials(user: CognitoUser){
        const jwtToken = user.getSignInUserSession()!.getIdToken().getJwtToken();
        // const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-south-1_uLUGi9vEF`;
        const cognitoIdentityPool = 'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_uLUGi9vEF';
        console.log(cognitoIdentityPool);
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'ap-south-1:fc5b9a77-2131-4f08-9b3c-bce9b6860b08',
                logins: {
                    [cognitoIdentityPool]: jwtToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}