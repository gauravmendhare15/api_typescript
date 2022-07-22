import mongoose, { Types } from "mongoose";
import { Igroup, IgroupSubscribed } from "./../interface/group"
let Schema = mongoose.Schema

let groupSchema = new Schema({
    name: { type: String },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    groupType: { type: Number },

}, { timestamps: true })

let groupSubscribedSchema = new Schema<IgroupSubscribed>({
    gId: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    mId: { type: mongoose.Types.ObjectId, ref: "User" },
    role: { type: Number },

}, {
    timestamps: true
})

const Group = mongoose.model<Igroup>("Group", groupSchema)
const GroupSubscribe = mongoose.model("GroupSubscribe", groupSubscribedSchema)

export {
    Group,
    GroupSubscribe,
}






