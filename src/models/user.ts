import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;

export interface IUser extends mongoose.Document {
    fname: string;
    lname: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    profile?: string;
}

const userSchema = new Schema<IUser>({
    fname: { type: String, required: true },
    lname: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    profile: { type: mongoose.Types.ObjectId, ref: "Profile" }

})

export const User = model<IUser>("User", userSchema);