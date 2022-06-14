import express from "express"
import { getUser, createUser, allUsers } from "./../controller/usercontroller"
import { IUser } from "./../models/user"
import { genrateJWT } from "../utils/helper"
import { authenticate } from "./../middlewar/auth"
import { busboyMiddleware } from "./../middlewar/busboy"
import * as userController from "./../controller/usercontroller"
import * as HelperUtils from "./../utils/helper"
import { IuserLogin, IuserSearch } from "./../interface/iuser"
const router = express.Router()



router.get("/", authenticate, async (req, res) => {
    let userObj: IUser[] | null | []
    userObj = await allUsers(req)
    res.send(HelperUtils.successObj("All users", userObj))
    return
})

router.post("/create", async (req, res) => {
    let userObj: IUser | null | {}
    let user: IUser = req.body
    userObj = await createUser(user)
    res.send(HelperUtils.successObj("User created successfully", userObj))
})

router.post("/login", async (req, res) => {
    try {
        let userObj: IUser | null | {}
        let user: IuserLogin = req.body
        userObj = await getUser(user)
        if (userObj) {
            let token = await genrateJWT(userObj)
            res.send(HelperUtils.successObj("User login successfully", { token: token, user: userObj }))
        } else {
            res.send({ error: "User not found" })
        }
    } catch (error) {
        console.log(error);
        res.send(HelperUtils.errorObj("User login failed", error))
    }
})

router.post("/upload", busboyMiddleware, async (req: any, res) => {
    console.log(req.fileInfo);

    res.send(HelperUtils.successObj("File uploaded successfully", req.fileInfo))
})

router.post("/search", authenticate, userController.searchUser)

export default router