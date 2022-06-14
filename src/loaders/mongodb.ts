import mongoose from "mongoose";

export const connectDB = (DBUrl: string) => {
    mongoose.connect(DBUrl);

    mongoose.connection.on("connected", () => {
        console.log("Mongoose is connected");
    });

    mongoose.connection.on("error", (err) => {
        console.log(`Mongoose connection error: ${err}`);
    });
    mongoose.set("debug", true);
}