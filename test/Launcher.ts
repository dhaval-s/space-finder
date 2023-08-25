import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SpaceTable-0648ec2adc08';
handler({
    httpMethod: 'POST',
    // queryStringParameters: {
    //     id: '65b8d2be-ab37-4315-a883-ef6e924bd0ae'
    // },
    body: JSON.stringify({
        "location": "Baroda-2"
    })
} as any, {} as any).then(result => {
    console.log(result)
})