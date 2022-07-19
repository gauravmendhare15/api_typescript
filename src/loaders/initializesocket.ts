import { Server } from 'socket.io';
import * as authorization from "../middlewar/auth"
import { UserCollection } from '../socketserver/userCollection';
import UserModel from '../socketserver/userService';

// function 


class openSocket {
  io: any;
  constructor(io: any) {
    this.io = io;
  }
  async openSocket1() {
    this.io.on("connection", async function (socket: any) {
      console.log("new connection ", socket.id)
      if (!socket.handshake.query.token) {
        socket.emit("res", { message: "Token is required" })
        socket.disconnect()
      }
      //please check token passed is valid or not || expired
      let authorizedUser = await authorization.verifySocket(socket, socket.handshake.query.token)
      if (authorizedUser && authorizedUser.flag === true) {
        //add user into the userCollection Class
        UserModel.getuserFromDB(authorizedUser.result._id, socket)
        UserModel.setSocket(socket, socket.handshake.query.token)

      } // disconect socket and not valid token

    })
  }



}


module.exports = async (server: any) => {
  const io = new Server(server, { 'pingTimeout': 180000, 'pingInterval': 25000 })
  let openSocketObj = new openSocket(io)
  await openSocketObj.openSocket1()
}