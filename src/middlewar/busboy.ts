import busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import { generateOTP, generateRandomNumber } from "./../utils/helper"

async function busboyMiddleware(req: any, res: any, next: any) {
    try {

        const bb = busboy({ headers: req.headers });
        var saveTo: string = "", fileInfo: any = {};
        bb.on('file', (name, file, info) => {
            fileInfo = info
            fileInfo.name = name + generateRandomNumber() + path.extname(info.filename)
            saveTo = path.join(__dirname, "./../uploads/" + fileInfo.name);
            fileInfo.path = saveTo
            file.pipe(fs.createWriteStream(saveTo));
            fileInfo.ext = path.extname(info.filename)

        });
        bb.on('close', () => {
            req.fileInfo = fileInfo
            next();
        });
        req.pipe(bb);
        return;
    } catch (error) {
        console.log(error);
        res.send(error)

    }
}

export { busboyMiddleware }


