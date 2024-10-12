const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')

const errorHandlerMiddleware = require('./middleware/error')

app.use(express.json())
app.use(cookieParser())

//Route Imports
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute')

app.use('/api/v1',productRoute)
app.use('/api/v1',userRoute)
// middleware Errors
app.use(errorHandlerMiddleware)


module.exports = app