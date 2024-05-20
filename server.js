const http = require('http');
const app = require("./src/index")
require('dotenv').config()
const port = process.env.PORT || 1000
const server = http.createServer(app)
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) // mandatory (as per the Node.js docs)
})
server.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
    // sequelize.sync().then(() => { 
    //     console.log("Database connected")
    // }).catch((err) => {
    //     console.log("Database not connected", err)
    // })
})
