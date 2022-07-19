import jwt from "jsonwebtoken"
import { IUser } from "./../models/user";
import * as  HelperUtils from "./../utils/helper"


async function authenticate(req: any, res: any, next: any) {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(401).send("Access Denied No Token Found");
        jwt.verify(token, process.env.JWT_SECRET || "tsnodejs", (err: any, decoded: any) => {
            if (err) return res.status(401).send("Access Denied Invalid Token");
            req.user = decoded;
            next();
        })
    } catch (error) {
        res.status(401).send(error)
    }
}
async function verifySocket(socket: any, token: any) {
    try {
        if (!token) return (HelperUtils.errorObj("Access Denied No Token Found", {}));
        let data = await jwt.verify(token, process.env.JWT_SECRET || "tsnodejs")
        return (HelperUtils.successObj("Authorized", data))
    } catch (error) {
        console.log(error)
        return HelperUtils.errorObj("something went wrong", error)
    }
}

export { authenticate, verifySocket }


