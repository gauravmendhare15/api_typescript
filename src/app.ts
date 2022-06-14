import express from "express"
import "dotenv/config"
import { connectDB } from "./loaders/mongodb"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function loggerMiddleware(request: express.Request, response: express.Response, next: any) {
    console.log(`${request.method} ${request.path}`);
    next();
}
import userRouter from "./routes/user"

app.use(loggerMiddleware)
app.use("/api/user", userRouter)


connectDB(process.env.MONGO_DB || "mongodb://localhost:27017/gaurav")
//start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})



/** 
Promise.all([
    connectDB(process.env.MONGO_DB || "mongodb://localhost:27017/gaurav")

]).then(() => {
    console.log("all things are ready")
    //start server
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
    process.exit()
})
*/