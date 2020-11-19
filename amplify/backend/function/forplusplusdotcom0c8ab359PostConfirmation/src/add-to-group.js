/* eslint-disable-line */ const aws = require('aws-sdk');
const {google} = require('googleapis');

exports.handler = async (event, context, callback) => {
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
  const groupParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
  };

  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  const accessToken = event.request.userAttribtues["custom:accessToken"];

  console.log("Google Access Token: ", accessToken);
  // google.request({
  //   path: 'https://youtube.googleapis.com/youtube/v3/subscriptions?forChannelId=UCNISz9B2VjLYr63ddljEkTA&mine=true&key='
  // });


  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }

  try {
    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
    callback(null, event);
  } catch (e) {
    callback(e);
  }
};
