import { Server } from 'socket.io';
import * as authorization from "../middlewar/auth"
import UserCollection from '../socketserver/userCollection';
import UserModel from '../socketserver/userService';
import groupCollection from '../socketserver/groupCollection';

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
        let userId = authorizedUser.result._id
        await UserModel.getuserFromDB(userId, socket)
        await UserModel.setSocket(socket, socket.handshake.query.token)
        await UserModel.addOnline(userId, socket)

      } // disconect socket and not valid token

    })
  }



}


module.exports = async (server: any) => {
  groupCollection.initializeGroup();
  const io = new Server(server, { 'pingTimeout': 180000, 'pingInterval': 25000 })
  UserModel.initializeSocketServer(io);
  let openSocketObj = new openSocket(io)
  await openSocketObj.openSocket1()
}