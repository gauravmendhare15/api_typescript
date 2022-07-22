import UserCollection from "./userCollection";
import { User } from "./../models/user";
import { socketUser } from "../interface/iuser";
import { verifySocket } from "../middlewar/auth";
import { SOCKETEVENT } from "../utils/const";
import * as socketController from "./../controller/socketcontroller"
import { GroupSubscribe } from "../models/group";
import groupCollection from "./groupCollection";

class UserModel {
    socketServer: any = {}

    //user: any

    initializeSocketServer(io: any) {
        this.socketServer = io;
    }

    async getSocketArrOfUser(userId: any) {
        let sockets = await this.socketServer.to(userId.toString()).fetchSockets();
        return sockets
    }

    async getuserFromDB(userId: any, socket: any) {
        let obj = await User.findById(userId);
        if (obj) {
            // find groups of user
            let groupsId = await GroupSubscribe.distinct("gId", { mId: userId })
            groupsId = groupsId.map(group => group.toString());
            let user: socketUser = {
                _id: obj._id,
                name: obj.fname + " " + obj.lname,
                email: obj.email,
                socketId: socket.id,
                groups: groupsId  // find later group id's
            }
            UserCollection.setUserInfo(user)

        }
    }

    async addOnline(userId: any, socket: any) {
        try {
            let userData = UserCollection.getUserInfo(userId)
            let subGroupId = await GroupSubscribe.distinct("gId", { mId: userId })
            subGroupId.forEach(subGroupId => {
                if (userData.groups.indexOf(subGroupId.toString()) === -1) UserCollection.userInfo[userId].groups.push(subGroupId.toString())
                //add user in socket group room
                socket.join(subGroupId.toString())
                groupCollection.addUserInGroup(userId, subGroupId)
            })
            //add to its room to access socket object
            socket.join(userId.toString())
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async setSocket(socket: any, token: any) {
        try {
            let session: any, userId: any
            let verify = await verifySocket(socket, token)
            if (verify && verify.flag === false) {
                //disconnect
                socket.disconnect()
                return
            }
            session = verify.result
            userId = verify.result._id

            //listening socket events
            socket.on(SOCKETEVENT.SOCKET_REQUEST, function (data: any) {
                console.log("socket called", data)
                switch (data.event) {
                    case SOCKETEVENT.SEND_NEW_MESSAGE:
                        socketController.sendNewmessage(userId, socket, data.data)
                        break;

                    case SOCKETEVENT.CREATE_NEW_GROUP:
                        socketController.createGroup(userId, socket, data.data)
                        break;

                    case SOCKETEVENT.JOIN_GROUP:
                        socketController.joinGroup(userId, socket, data.data)
                        break;

                    default:
                        break;
                }
            })

        } catch (error) {
            console.log(error)
            socket.emit(SOCKETEVENT.SOCKET_RESPONSE, { message: "Not Ok" })
        }
    }

}

export default new UserModel
