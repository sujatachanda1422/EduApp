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
            let response, data = JSON.stringify(result, null, 2);

            if (data !== "{}") {
                response = {
                    body: JSON.stringify({ status: 200, data: result.Item })
                };
            } else {
                response = {
                    body: JSON.stringify({ status: 404, message: 'No user found' })
                };
            }

            callback(null, response);
        })
        .catch(error => {
            console.error("Error in data", params);
            const response = {
                body: JSON.stringify({ status: 500, message: 'Login error' })
            };
            callback(null, response);
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