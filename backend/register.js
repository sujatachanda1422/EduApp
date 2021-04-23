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

    var params = {
        TableName: "users",
        Key: {
            email
        }
    };

    if (name.trim() === '' || email.trim() === '' || pwd.trim() === '') {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t submit user because of validation errors.'));
        return;
    }

    dynamoDb.get(params, function(err, data) {
        let response;

        if (err) {
            response = {
                body: JSON.stringify({ status: 501, message: "Unable to read item." })
            };

            callback(null, response);
        } else {
            response = JSON.stringify(data, null, 2);

            if (response === "{}") {
                updateUser(requestBody).then(res => {
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
                            status: 500,
                            message: "Unable to submit user with email"
                        })
                    });
                });
            } else {
                response = {
                    body: JSON.stringify({ status: 500, message: "User with email already exists." })
                };

                callback(null, response);
            };
        }
    });
};

module.exports.updaterUser = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;
    var params = {
        TableName: "users",
        Key: {
            email
        }
    };

    dynamoDb.get(params, function(err, data) {
        let response;

        if (err) {
            response = {
                body: JSON.stringify({ status: 501, message: "Unable to read item." })
            };

            callback(null, response);
        } else {
            response = JSON.stringify(data, null, 2);

            if (response !== "{}") {
                updateUser(updateUserInfo(data.Item, requestBody)).then(res => {
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
                            status: 500,
                            message: "Unable to submit user with email"
                        })
                    });
                });
            } else {
                response = {
                    body: JSON.stringify({ status: 500, message: "No user found" })
                };

                callback(null, response);
            };
        }
    });
};

module.exports.updatePassword = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;
    var params = {
        TableName: "users",
        Key: {
            email
        }
    };

    dynamoDb.get(params, function(err, data) {
        let response;

        if (err) {
            response = {
                body: JSON.stringify({ status: 501, message: "Unable to read item." })
            };

            callback(null, response);
        } else {
            response = JSON.stringify(data, null, 2);

            if (response !== "{}") {
                data.Item.pwd = requestBody.pwd;

                updateUser(data.Item).then(res => {
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
                            status: 500,
                            message: "Unable to submit user with email"
                        })
                    });
                });
            } else {
                response = {
                    body: JSON.stringify({ status: 500, message: "No user found" })
                };

                callback(null, response);
            };
        }
    });
};

const updateUser = (requestBody) => {
    return submitUser(userInfo(requestBody))
        .then(res => requestBody)
        .catch(err => err);
}

const submitUser = user => {
    const userInfo = {
        TableName: 'users',
        Item: user
    };

    return dynamoDb.put(userInfo).promise()
        .then(res => user).catch(err => err);
};

const updateUserInfo = (oldReq, newReq) => {
    const timestamp = new Date().getTime();

    oldReq.email = newReq.email;
    oldReq.mobile = newReq.mobile;
    oldReq.name = newReq.name;
    oldReq.updatedAt = timestamp;
    oldReq.class = newReq.class;
    oldReq.role = newReq.role;

    return oldReq;
};

const userInfo = (requestBody) => {
    const timestamp = new Date().getTime();

    return {
        email: requestBody.email,
        mobile: requestBody.mobile,
        name: requestBody.name,
        pwd: requestBody.pwd,
        updatedAt: timestamp,
        class: requestBody.class,
        role: requestBody.role
    };
};