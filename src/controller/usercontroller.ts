import { User, IUser } from "../models/user";
import { IuserLogin, IuserSearch } from "./../interface/iuser"
import * as HelperUtils from "./../utils/helper"


async function getUser(req: IuserLogin) {
    try {
        let user: IUser | null | {};
        if (req.email)
            user = await User.findOne({ email: req.email }).lean();
        else if (req._id)
            user = await User.findById(req._id).lean();
        else user = null;
        return user;
    } catch (error) {
        console.log(error);
        return {}
    }
}
async function createUser(req: IUser) {
    try {
        const user = new User(req);
        const result = await user.save();
        return result;
    } catch (error) {
        console.log(error);
        return {}
    }
}

async function allUsers(req: any) {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.log(error);
        return []
    }
}

async function searchUser(req: any, res: any) {
    try {
        let bodyData: IuserSearch = req.body

        let findData = {}
        if (bodyData.search) {
            let fullNameArr = bodyData.search.split(" ")
            if (fullNameArr.length > 1) {
                findData = {
                    $or: [
                        { fname: { $regex: fullNameArr[0], $options: "i" } },
                        { lname: { $regex: fullNameArr[1], $options: "i" } }
                    ]
                }
            }
            else {
                findData = {
                    $or: [
                        { fname: { $regex: bodyData.search, $options: "i" } },
                        { lname: { $regex: bodyData.search, $options: "i" } },
                        { email: { $regex: bodyData.search, $options: "i" } }
                    ]
                }
            }

        }
        const users = await User.find(findData);
        res.send(HelperUtils.successObj("Users found", users));

    } catch (error) {
        console.log(error);
        res.send(error)

    }
}

export { getUser, createUser, allUsers, searchUser }




// class Userdata implements IUser {
//     fname: string;
//     lname: string;
//     email: string;
//     password: string;
//     phone?: string | undefined;
//     address?: string | undefined;

//     constructor(fname: string, lname: string, email: string, password: string, phone?: string, address?: string) {
//         this.fname = fname;
//         this.lname = lname;
//         this.email = email;
//         this.password = password;
//         this.phone = phone;
//         this.address = address;
//     }

//     newUser(): any {
//         new User({
//             fname: this.fname,
//             lname: this.lname,
//             email: this.email,
//             password: this.password,
//             phone: this.phone,
//             address: this.address
//         }).save((err: any, user: any) => {
//             if (err) {
//                 console.log(err);
//                 return {}
//             } else {
//                 console.log(user);
//                 return user;
//             }
//         });

//     }



// }