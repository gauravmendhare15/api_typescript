import mongoose from 'mongoose';
const Schema = mongoose.Schema

export interface IMessage extends mongoose.Document {
    sId: string | object,
    rcvId?: string,
    chId: string,
    gId?: string,
    msg?: string,
    media?: Array<string>,
    isEdited: Boolean,

}

const messgaeSchema = new Schema<IMessage>({
    sId: { type: mongoose.Types.ObjectId, ref: "User" },
    rcvId: { type: mongoose.Types.ObjectId, ref: "User" },
    chId: { type: String },
    gId: { type: mongoose.Types.ObjectId, ref: "Group" },
    msg: { type: String },
    media: [{ type: String }],
    isEdited: { type: Boolean, default: false },
}, {
    timestamps: true
})

export const Message = mongoose.model('Message', messgaeSchema)