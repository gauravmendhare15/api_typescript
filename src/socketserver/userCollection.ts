import { socketUser } from "../interface/iuser";
class UserCollection {
    userInfo: any = {};

    constructor(userInfo: socketUser) {
        if (this.userInfo[userInfo._id] === undefined)
            this.userInfo[userInfo._id] = userInfo
    }

    getUserInfo(userId: string): any {
        return this.userInfo[userId]
    }

}


export {
    UserCollection
}