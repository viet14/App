import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config';
import upload from 'express-fileupload'
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import chat from "./Controllers/socket.js";

import socketAuthentication  from "./authentication/socket.js";
import userRouter from "./Routes/user.js";
import authenticationRouter from "./Routes/Authentication.js";

const app = express()
//socket 
const server = createServer(app);
const io = new Server(server , {cors: {
    origin: '*',
}});
io.use(socketAuthentication.checkUser);
const Chat = new chat(io)
Chat.run()


app.use(cors())
app.use(upload({createParentPath : true}))
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
//mongoose
mongoose.connect(process.env.MONGODB_ADDRESS)
    .then(()=>{
        console.log('Connected successfully')
    })

//Router
app.use('/' , authenticationRouter)
app.use('/', userRouter)
//catch error not found
app.use((req, res , next ) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

//Error handler

app.use((err , req, res , next ) => {
    // const error = app.get('evn') ==='development'?err:{}
    const status = err.status || 500
    return res.status(status).json({
        error:{
            message: err.message
        }
    })
})

server.listen(3000 , ()=>{
    console.log("Listen on port 3000");
})