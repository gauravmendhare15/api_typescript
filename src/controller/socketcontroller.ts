import { socketResponse } from "../utils/helper";
import { emitToSocket } from "../socketserver/responseHandler";
import { Message } from "../models/message";
import { SOCKETEVENT } from "../utils/const";

async function sendNewmessage(userId: any, socket: any, data: any) {
    emitToSocket(socket, SOCKETEVENT.SEND_NEW_MESSAGE_RESPONSE, { data: { _id: "", msg: data.msg } })
}

export {
    sendNewmessage,
}