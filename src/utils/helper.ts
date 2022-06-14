import jwt from "jsonwebtoken"
import { IUser } from "./../models/user";
import { IResponse } from "./../interface/ihelper"



async function genrateJWT(userObj: IUser | {}) {
    let scretKey = process.env.JWT_SECRET || "tsnodejs"
    const token = jwt.sign(userObj, scretKey, { expiresIn: "7d" });
    return token;
}

function generateOTP() {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function generateRandomNumber() {
    var min = 1000000;
    var max = 9999999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}



function successObj(message: string, result: any): IResponse {
    if (isObject(result)) {
        return {
            flag: true,
            message: message,
            result: result
        };
    }
    else {
        return {
            flag: true,
            message: message,
            result: { data: result }
        };
    }
}
function errorObj(message: string, error: any, code?: number): IResponse {
    return {
        flag: false,
        message: message,
        error: error,
        code: (code) ? code : 500
    };
}
function isObject(obj: any) {
    return (typeof obj === "object" && !Array.isArray(obj) && obj !== null);
}

export { genrateJWT, generateOTP, generateRandomNumber, successObj, errorObj }