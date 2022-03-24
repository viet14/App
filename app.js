import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import userRouter from "./Routes/Authentication.js";

const app = express()
//Morgan
app.use(morgan('dev'))

//mongoose
mongoose.connect('mongodb://localhost/App')
    .then(()=>{
        console.log('Connected successfully')
    })
//Body Parser
app.use(bodyParser.json())
//Router
app.use('/' , userRouter)
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

app.listen(3000 , ()=>{
    console.log("Listen on port 3000");
})