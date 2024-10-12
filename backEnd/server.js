const app = require('./app')
const dotenv = require('dotenv').config()
const connectDatabase = require('./config/database')
const error = require('./middleware/error')

// Handling Uncaught Exception 
process.on('uncaughtException',(err)=>{
console.log(err,"uncaught error")
console.log("shutting down the server Uncaught Error like reference error ")
process.exit(1)
})

//connect to database
connectDatabase()

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// Unhandled Promise Rejection  crash the server self
process.on('unhandledRejection',error=>{
    console.log(`error # ${error.message}`)
    console.log("shutting down the server unhandledRejection ")
    server.close(()=>{
        process.exit(1)
    })
})
