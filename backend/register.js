"use strict";

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.signUp = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const name = requestBody.name;
    const email = requestBody.email;
    const pwd = requestBody.pwd;

    if (name.trim() === '' || email.trim() === '' || pwd.trim() === '') {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t submit user because of validation errors.'));
        return;
    }

    submitUser(userInfo(requestBody))
        .then(res => {
            console.log('Registered user', res);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Sucessfully submitted user with email ${email}`,
                    user: res
                })
            });
        })
        .catch(err => {
            console.log(err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: `Unable to submit user with email ${email}`
                })
            })
        });
};


const submitUser = user => {
    const userInfo = {
        TableName: process.env.USERS_TABLE,
        Item: user
    };
    return dynamoDb.put(userInfo).promise()
        .then(res => user);
};

const userInfo = (requestBody) => {
    const timestamp = new Date().getTime();

    return {
        email: requestBody.email,
        mobile: requestBody.mobile,
        name: requestBody.name,
        pwd: requestBody.pwd,
        updatedAt: timestamp,
    };
};