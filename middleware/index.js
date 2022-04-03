import mongoose from "mongoose"
import { verifyToken } from "../authentication/index.js"
import User from "../models/User.js"

const middleware = {
    checkUser : async(req, res, next) => {
        try {
            const {token} = req.query
            if(!token) return res.status(400).json({err: {message: 'Token is required'}})
            const data  = verifyToken(token , process.env.SECRET_KEY)
            const user = await User.findOne({id: new mongoose.Types.ObjectId(data.id)})
            req.data = data
            next()
        } catch (error) {
            next(error)
        }   
    }
}

export default middleware