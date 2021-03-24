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

const saveToDynamoDB = (data) => {
    if (!data) {
        return Promise.resolve();
    }
    data["id"] = data.key.split(".")[0];
    data["likes"] = 0;
    const params = {
        TableName: TABLE_NAME,
        Item: data
    };
    return docClient.put(params)
        .promise()
        .then(response => response)
        .catch(err => {
            console.log(err);
            return err;
        });
};

exports.handler = async(event) => {
    const S3Objects = parseS3Event(event);
    return Promise.all(S3Objects.map(saveToDynamoDB));
};
