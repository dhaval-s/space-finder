import * as cdk from 'aws-cdk-lib'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LamdaStackProps extends cdk.StackProps {
    spacesTable: ITable
}

export class LamdaStack extends cdk.Stack {
    
    public readonly spacesLamdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LamdaStackProps) {
        super(scope, id, props)

        const spacesLamda = new NodejsFunction(this, 'SpacesLamda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts'),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
        });

        spacesLamda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.spacesTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:PutItem',
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem'
            ]
        }))

        // helloLamda.addToRolePolicy(new PolicyStatement({
        //     effect: Effect.ALLOW,
        //     actions: [
        //         's3:ListAllMyBuckets',
        //         's3:ListBucket'
        //     ],
        //     resources: ["*"]
        // }))

        this.spacesLamdaIntegration = new LambdaIntegration(spacesLamda)
    }
}