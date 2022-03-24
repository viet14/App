import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import bcryptjs from "bcryptjs";
import {generateToken} from "../authentication/index.js"

const userController = {
    signIn: async(req, res , next) => {
        const {key , password} = req.body
        //Check email or phone number
        const getUser = await User.findOne({$or:[
            {email : key},
            {phone : key}
        ]})
        if(!getUser){
            return res.status(401).json({error:{message: "User not found"}})
        }
        //Check password
        const checkPassword = await bcryptjs.compare(password, getUser.password)
        if(!checkPassword){
            return res.status(401).json({error:{message: "Password is incorrect"}})
        }
        //Json web token
        const secretToken= generateToken({id :getUser._id } , process.env.SECRET_KEY , '3m')
        const refreshToken= generateToken({id :getUser._id } , process.env.SECRET_KEY , '7d')
        const rtoken = new RefreshToken({refreshToken})
        rtoken.save().then((result) => {
            return res.status(200).json({success : {
                secretToken : secretToken,
                refreshToken : refreshToken
            }})
        }).catch((err) => {
            next(err)
        });
    },
    signUp:async(req, res , next) => {
        const {firstName, lastName , dateOfBirth , email ,phone , password} = req.body
        //Check email or phone is exists
        const check = await User.findOne({$or:[
            {phone : phone},
            {email : email}
        ]})
        if(check) {
            res.status(400).json({err:{message : "User already exists"}})
        }
        
        //Save use to database
        const user = new User({firstName, lastName , dateOfBirth, email, phone , password : bcryptjs.hashSync(password , 10)})
        try {
            await user.save()
            res.status(200).json({success : true})
        }catch(err) {
            next(err)
        }
    }
}

export default userController