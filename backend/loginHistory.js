"use strict";

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addLoginHistory = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;

    var params = {
        TableName: "login-history",
        Key: {
            email
        }
    };

    getUser(params).then(data => {
        const response = JSON.stringify(data, null, 2);

        console.log("params data = ", data);

        if (response === "{}") {
            console.log("adding data = ", data);

            addUser(requestBody).then(res => {
                console.log("added data = ", res);

                callback(null, {
                    body: JSON.stringify({
                        status: 200,
                        message: "Sucessfully submitted user with email",
                        user: res
                    })
                });
            }).catch(err => {
                callback(null, {
                    body: JSON.stringify({
                        status: 400,
                        message: "Unable to submit user with email"
                    })
                });
            });
        } else {
            callback(null, {
                body: JSON.stringify({ status: 500, message: "User with email already exists." })
            });
        };
    }).catch(err => {
        const response = {
            body: JSON.stringify({ status: 501, message: "Unable to read item." })
        };

        callback(null, response);
    });
};

module.exports.deleteLoginHistory = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;

    var params = {
        TableName: "login-history",
        Key: {
            email
        }
    };

    dynamoDb.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, {
                body: JSON.stringify({ status: 500, message: "Unable to delete item. Error JSON: " + JSON.stringify(err, null, 2) })
            });
        } else {
            callback(null, {
                body: JSON.stringify({ status: 200, message: "User deleted" })
            });
        }
    });
};

const addUser = (requestBody) => {
    return submitUser(userInfo(requestBody))
        .then(res => requestBody)
        .catch(err => err);
}

const submitUser = user => {
    const userInfo = {
        TableName: 'login-history',
        Item: user
    };

    return dynamoDb.put(userInfo).promise()
        .then(res => user).catch(err => err);
};

const getUser = user => {
    return dynamoDb.get(user).promise()
        .then(res => res).catch(err => err);
};

const userInfo = (requestBody) => {
    const timestamp = new Date().getTime();

    return {
        email: requestBody.email,
        loggedInAt: timestamp
    };
};