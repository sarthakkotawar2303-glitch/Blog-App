require('dotenv').config()
const mongoose = require('mongoose')

const express = require('express')
const connectToDb = require('./src/config/connectToDb')
const userRoutes = require('./src/routes/userRoute')
const cors = require('cors')
const bodyParser = require('body-parser')
const postRouter = require('./src/routes/postRoute')
const commentRouter=require('./src/routes/commentsRoute')

const app = express()
const port = process.env.PORT || 8000



//connect to db
connectToDb()


//middleware
//app.use(express.json())
app.use(cors())
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))


//route
app.use('/auth', userRoutes)
app.use('/posts', postRouter)
app.use('/posts',commentRouter)

//server listen
app.listen(port, () => console.log(`server running on port ${port}`))
