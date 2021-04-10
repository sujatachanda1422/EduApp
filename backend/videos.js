"use strict";

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.videoList = (event, context, callback) => {
    const params = {
        TableName: 'videos',
        Key: {
            lessonId: event.pathParameters.lessonId
        },
    };

    dynamoDb.get(params).promise()
        .then(result => {
            console.log("Logged in data", result);
            let response;

            response = {
                body: JSON.stringify(result.Item)
            };
            callback(null, response);
        })
        .catch(error => {
            console.error("Error in data", params);
            callback(null);
            return;
        });
}

module.exports.workList = (event, context, callback) => {
    const params = {
        TableName: 'worklist',
        Key: {
            lessonId: event.pathParameters.lessonId
        },
    };

    dynamoDb.get(params).promise()
        .then(result => {
            console.log("Logged in data", result);
            let response;

            response = {
                body: JSON.stringify(result.Item)
            };
            callback(null, response);
        })
        .catch(error => {
            console.error("Error in data", params);
            callback(null);
            return;
        });
}