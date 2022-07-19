import { UserCollection } from "./userCollection";
import { User } from "./../models/user";
import { socketUser } from "../interface/iuser";
import { verifySocket } from "../middlewar/auth";
import { SOCKETEVENT } from "../utils/const";
import * as socketController from "./../controller/socketcontroller"

class UserModel {
    //user: any

    async getuserFromDB(userId: any, socket: any) {
        let obj = await User.findById(userId);
        if (obj) {
            let user: socketUser = {
                _id: obj._id,
                name: obj.fname + " " + obj.lname,
                email: obj.email,
                socketId: socket.id,
                groups: []  // find later group id's
            }
            new UserCollection(user)

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
                console.log("======", data)
                switch (data.event) {
                    case SOCKETEVENT.SEND_NEW_MESSAGE:
                        socketController.sendNewmessage(userId, socket, data.data)
                        break;

                    default:
                        break;
                }
            })

        } catch (error) {

        }
    }

}

export default new UserModel
