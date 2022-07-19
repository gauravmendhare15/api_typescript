import { socketResponse } from "../utils/helper";
import { SOCKETEVENT } from "../utils/const";

function emitToSocket(socket: any, event: any, data: any) {
    let resposne = socketResponse(event, data)
    socket.emit(SOCKETEVENT.SOCKET_RESPONSE, resposne)
}

export {
    emitToSocket,
}