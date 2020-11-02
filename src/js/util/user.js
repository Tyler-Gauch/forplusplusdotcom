const USER_GROUP_KEY = "cognito:groups";
const ADMIN_GROUP = "admins";
const SUBSCRIBER_GROUP = "subscribers";

class User {

    constructor(cognitoUserData) {
        this.userData = cognitoUserData;
    }

    getFullname() {
        return this.userData.attributes.name;
    }

    isAdmin() {
        return this.getRoles().includes(ADMIN_GROUP);
    }

    isSubscribed() {
        return this.getRoles().includes(SUBSCRIBER_GROUP);
    }

    getRoles() {
        return this.userData.signInUserSession.accessToken.payload[USER_GROUP_KEY];
    }

}


export default User;