import { Types } from "mongoose"
interface socketGroup {
    _id: any;
    name: string;
    admins: string[];
    members: string[];
    onlineUser?: string[];

}

interface Igroup {
    _id?: any;
    name: string;
    groupType: Number;
    createdBy: Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IgroupSubscribed {
    gId: any;
    mId: any;
    role: Number;
    addedBy: any;
    createdAt?: Date;
    updatedAt?: Date;
}



export {
    socketGroup,
    Igroup,
    IgroupSubscribed,

}