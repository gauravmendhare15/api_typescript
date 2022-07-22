import { socketResponse } from "../utils/helper";
import * as responseHandler from "../socketserver/responseHandler";
import { Message } from "../models/message";
import { SOCKETEVENT } from "../utils/const";
import { v4 } from "uuid";
import { Group, GroupSubscribe } from "./../models/group"
import groupCollection from "../socketserver/groupCollection";
import UserCollection from "./../socketserver/userCollection"
import UserModel from "./../socketserver/userService"

/**
 * like interface, 
 * @typedef NewMessageModel
 * @property {string}  sId - sender id
 * @property {string}  rcvId - reciever ID
 * @property {string}  msg - sender id
 * @property {string}  media - file path
 * @property {string}  type - 1: p2p 2:group
 * @property {string}  gId - group identifier
 */
async function sendNewmessage(userId: any, socket: any, data: any) {
    let newMsg = data
    if (newMsg.type === 1 && !newMsg.rcvId) {
        let errorObj = {
            "error": "reciever Id required for p2p chat"
        }
        responseHandler.emitToSocket(socket, SOCKETEVENT.SEND_NEW_MESSAGE_RESPONSE, errorObj)
    }
    if (newMsg.type === 1) {
        let query = {
            $or: [{ sId: userId, rcvId: newMsg.rcvId },
            { sId: newMsg.rcvId, rcvId: userId }
            ]
        }
        let previousMsg = await Message.findOne(query).lean()
        if (previousMsg && previousMsg.chId) newMsg.chId = previousMsg.chId
        else newMsg.chId = v4();  // genrate a unique id for private chat
    }
    else if (newMsg.type === 2) newMsg.chId = newMsg.gId; //set chat id as a group identifier

    newMsg.sendtime = Date.now();
    let saveMessage = new Message(newMsg); //
    await saveMessage.save();

    responseHandler.emitToChatUser(userId, socket, saveMessage);
}
/**
 * @typedef newGroup
 * @property {string} name
 * @property {string} groupType
 */
async function createGroup(userId: string, socket: any, data: any) {
    try {
        let groupObj = new Group()
        groupObj.name = data.name
        groupObj.groupType = data.groupType
        groupObj.createdBy = userId
        await groupObj.save()

        //add in groupcollection data
        let obj = {
            _id: groupObj._id,
            name: groupObj.name,
            admins: [userId],
            members: [],
            onlineUser: [userId]
        }
        groupCollection.setGroupInfo(obj)

        let groupSub = new GroupSubscribe()
        groupSub.gId = groupObj._id;
        groupSub.addedBy = userId;
        groupSub.mId = userId;
        groupSub.role = 1
        await groupSub.save()

        UserCollection.addUserInGroup(userId, groupObj._id, socket)
        responseHandler.emitToSocket(socket, SOCKETEVENT.CREATE_NEW_GROUP_RESPONSE, groupObj)
    } catch (error) {
        console.log(error);
        let errobj = {
            msg: "Not ok"
        }
        responseHandler.emitToSocket(socket, SOCKETEVENT.CREATE_NEW_GROUP_RESPONSE, errobj);
        return false;
    }
}
/**
 * @typedef joindGroupModel interface
 * @property {string} gId
 * @property {string} mId 
 * @property {string} addedBy - if added by admin then required by admin
 * @property {number} role - if role 1:admin 2:member
 */
async function joinGroup(userId: string, socket: any, data: any) {
    try {
        let { mId, gId, role } = data;
        let groupId = await Group.findById(gId)
        if (!groupId) {
            let err = {
                msg: "Not Ok"
            }
            responseHandler.emitToSocket(socket, SOCKETEVENT.JOIN_GROUP_RESPONSE, err)
        }
        let alreadySub = await GroupSubscribe.findOne({ gId, mId })
        if (!alreadySub) {
            let addedBy = (data && data.addedBy) ? data.addedBy : (groupId && groupId.createdBy) ? groupId.createdBy : ""
            await groupCollection.addSubscriber(gId, addedBy, mId, role)
            let sockets = await UserModel.getSocketArrOfUser(mId)
            for (let i = 0; i < sockets.length; i++) {
                await UserModel.addOnline(mId, sockets[i])
            }
        }
        let res = {
            "msg": "successfully joined group"
        }
        responseHandler.emitToSocket(socket, SOCKETEVENT.JOIN_GROUP_RESPONSE, res)

    } catch (error) {
        console.log(error)
        let errobj = {
            "error": "Not Ok"
        }
        responseHandler.emitToSocket(socket, SOCKETEVENT.CREATE_NEW_GROUP_RESPONSE, errobj);
    }
}

export {
    sendNewmessage,
    createGroup,
    joinGroup,
}