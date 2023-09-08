const dotenv = require("dotenv")
const path = require("path")

dotenv.config()

module.exports = {
    serviceName: process.env.SERVICE_NAME,
    urlDb: process.env.MONGO_URL,
    rootPath: path.resolve(__dirname, ".."),
    jwtKey: process.env.SECRET,
}