"use strict";

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.login = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;

    const params = {
        TableName: process.env.USERS_TABLE,
        Key: {
            email
        },
    };

    dynamoDb.get(params).promise()
        .then(result => {
            let response, data = JSON.stringify(data, null, 2);

            if (data !== "{}") {
                response = {
                    body: JSON.stringify({ status: 200, data: result.Item })
                };
            } else {
                response = {
                    body: JSON.stringify({ status: 500, message: 'No user found' })
                };
            }

            callback(null, response);
        })
        .catch(error => {
            console.error("Error in data", params);
            const response = {
                body: JSON.stringify({ status: 404, message: 'No user found' })
            };
            callback(null, response);
            return;
        });
};