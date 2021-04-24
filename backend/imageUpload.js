"use strict";

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.setPromisesDependency(require('bluebird'));

module.exports.imageUpload = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    let encodedImage = requestBody.image;
    let decodedImage = Buffer.from(encodedImage, 'base64');
    let filePath = "avatars/" + requestBody.email + ".jpg"
    let params = {
        "Body": decodedImage,
        "Bucket": "issschool-scorm",
        "Key": filePath
    };

    s3.upload(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            let response = {
                "body": JSON.stringify({ status: 200, data })
            };
            callback(null, response);
        }
    });
};

module.exports.getImage = (event, context, callback) => {
    var params = {
        "Bucket": "issschool-scorm",
        "Key": "avatars/" + event.queryStringParameters.email + ".jpg"
    };

    s3.getObject(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            let response = {
                "body": JSON.stringify({ status: 200, data })
            };

            callback(null, response);
        }
    });

};