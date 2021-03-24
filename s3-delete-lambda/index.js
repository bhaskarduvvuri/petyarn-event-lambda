const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE;

const parseS3Event = (event) => {
    if (!event || !event.Records || !Array.isArray(event.Records)) {
        return [];
    }
    const extractMessage = record => record.s3 && record.s3.object;
    return event.Records.map(extractMessage);
};

const deleteFromDynamoDB = (data) => {
    if (!data) {
        return Promise.resolve();
    }
    const id = data.key.split(".")[0];
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        }
    };
    return docClient.delete(params)
        .promise()
        .then(response => response)
        .catch(err => {
            console.log(err);
            return err;
        });
};

exports.handler = async (event) => {
    const S3Objects = parseS3Event(event);
    return Promise.all(S3Objects.map(deleteFromDynamoDB));
};
