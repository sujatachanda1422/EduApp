"use strict";

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.classList = (event, context, callback) => {
    const params = {
        TableName: 'classes'
    };

    dynamoDb.scan(params).promise()
        .then(result => {
            let response;

            response = {
                body: JSON.stringify(result.Items)
            };
            callback(null, response);
        })
        .catch(error => {
            console.error("Error in data", params);
            callback(null);
            return;
        });
}

module.exports.classDetails = (event, context, callback) => {
    const params = {
        TableName: 'classes',
        Key: {
            name: event.pathParameters.name
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