import { socketUser } from "../interface/iuser";
import { Group, GroupSubscribe } from "../models/group";
class UserCollection {
    userInfo: any = {};

    // constructor(userInfo: socketUser) {
    //     if (this.userInfo[userInfo._id] === undefined)
    //         this.userInfo[userInfo._id] = userInfo
    // }

    getUserInfo(userId: string): any {
        return this.userInfo[userId]
    }

    setUserInfo(userInfo: socketUser) {
        if (this.userInfo[userInfo._id] === undefined)
            this.userInfo[userInfo._id] = userInfo
    }

    async addUserInGroup(userId: string, groupId: string, socket: any) {
        let userObj = this.userInfo[userId.toString()];
        if (userObj.groups.indexOf(groupId.toString()) === -1) {
            userObj.groups.push(groupId.toString());
        }
        socket.join(groupId.toString());
    }
}


export default new UserCollection()
