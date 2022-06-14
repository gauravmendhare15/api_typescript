import jwt from "jsonwebtoken"
import { IUser } from "./../models/user";


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

export { authenticate }


