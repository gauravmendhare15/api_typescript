import { socketResponse } from "../utils/helper";
import { SOCKETEVENT } from "../utils/const";
import UserCollection from "./userCollection";
import groupCollection from "./groupCollection";
import UserModel from "./../socketserver/userService"

function emitToSocket(socket: any, event: any, data: any) {
    let resposne = socketResponse(event, data)
    socket.emit(SOCKETEVENT.SOCKET_RESPONSE, resposne)
}

function emitToSocketIdUser(socket: any, socketId: string, event: any, data: any) {
    let resposne = socketResponse(event, data)
    socket.to(socketId).emit(SOCKETEVENT.SOCKET_RESPONSE, data)
}

function emitToChatUser(userId: any, socket: any, msgObj: any) {


    let userCollection = UserCollection
    try {
        //p2p chat message
        if (msgObj && msgObj.type === 1) {
            emitToSocket(socket, SOCKETEVENT.SEND_NEW_MESSAGE_RESPONSE, msgObj)
            let rcvrUser = userCollection.getUserInfo(msgObj.rcvId.toString())
            console.log("------------", userCollection.userInfo)
            if (rcvrUser) {
                console.log("-----rcvrUser", rcvrUser)
                emitToSocketIdUser(socket, rcvrUser.socketId, SOCKETEVENT.SEND_NEW_MESSAGE_RESPONSE, msgObj)
            }
        }
        else if (msgObj && msgObj.type === 2) {
            emitToRoom(socket, msgObj.gId, SOCKETEVENT.SEND_NEW_MESSAGE_RESPONSE, msgObj)
            emitToSocket(socket, SOCKETEVENT.SEND_NEW_MESSAGE_RESPONSE, msgObj)
        }
        else {
            let data = {
                msg: "hey its not chatting message"
            }
            emitToSocket(socket, SOCKETEVENT.SEND_NEW_MESSAGE, data)
        }
        return true
    } catch (error: any) {
        console.log(error)
        let errorObj = {
            msg: error.message,
        }
        emitToSocket(socket, SOCKETEVENT.SEND_NEW_MESSAGE, errorObj)
        return false
    }
}

function emitToRoom(socket: any, roomId: string, event: string, data: any) {
    let resposne = socketResponse(event, data)
    socket.to(roomId.toString()).emit(SOCKETEVENT.SOCKET_RESPONSE, resposne)
}


export {
    emitToSocket,
    emitToSocketIdUser,
    emitToChatUser
}