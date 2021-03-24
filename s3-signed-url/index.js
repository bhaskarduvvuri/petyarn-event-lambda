const aws = require('aws-sdk');
const { "v4": uuidv4 } = require('uuid');
aws.config.update({ region: process.env.S3_REGION });
const s3 = new aws.S3({
  signatureVersion: 'v4'
});

exports.handler = async(event) => {
    let fileExt = 'png';
    if(event["name"]) {
        fileExt = event["name"].split('.')[1];
    }
    const params = { Bucket: process.env.S3_BUCKET, Key: `${uuidv4()}.${fileExt}`, Expires: 200 };
    const url = s3.getSignedUrl('putObject', params);
    const response = {
        statusCode: 200,
        url,
    };
    return response;
};
