import express from "express"
import "dotenv/config"
import { connectDB } from "./loaders/mongodb"
import http from "http"
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
const server = http.createServer(app);
require("./loaders/initializesocket")(server)


connectDB(process.env.MONGO_DB || "mongodb://localhost:27017/gaurav")
//start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})