import * as cdk from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LamdaStack } from './stacks/LamdaStack';
import { ApiStack } from './stacks/APIStack';
import { AuthStack } from "./stacks/AuthStack";

const app = new cdk.App();
const dataStack = new DataStack(app, 'DataStack');
const lamdaStack = new LamdaStack(app, 'LamdaStack', {
    spacesTable: dataStack.spacesTable
})
const authStack = new AuthStack(app, 'AuthStack');
new ApiStack(app, 'ApiStack', {
    spacesLamdaIntegration: lamdaStack.spacesLamdaIntegration,
    userPool: authStack.userPool
})