"use strict";
exports.__esModule = true;
var express_1 = require("express");
require("dotenv/config");
var mongodb_1 = require("./loaders/mongodb");
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
function loggerMiddleware(request, response, next) {
    console.log("API Called:".concat(request.method, " ").concat(request.path));
    next();
}
var user_1 = require("./routes/user");
app.use(loggerMiddleware);
app.use("/api/user", user_1["default"]);
(0, mongodb_1.connectDB)(process.env.MONGO_DB || "mongodb://localhost:27017/gaurav");
//start server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server started on port ".concat(PORT));
});
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
