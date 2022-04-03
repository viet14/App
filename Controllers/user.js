import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import fs from "fs";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Verify from "../models/VerifyToken.js";
import sendMail from "../mail/mailer.js";
import Rooms from "../models/Rooms.js";
import {generateToken , verifyToken} from "../authentication/index.js"

const userController = {
    signIn:async(req, res , next) => {
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
        const secretToken= generateToken({id :getUser._id } , process.env.SECRET_KEY , '30m')
        const refreshToken= generateToken({id :getUser._id } , process.env.REFRESH_SECRET_KEY , '7d')
        const rToken = new RefreshToken({refreshToken})
        rToken.save().then((result) => {
            return res.status(200).json({success : {
                secretToken : secretToken,
                refreshToken : refreshToken
            }})
        }).catch((err) => {
            next(err)
        });
    },
    signUp:async(req, res , next) => {
        const {firstName, lastName , dateOfBirth , email ,phone , password , gender} = req.body
        //Check email or phone is exists
        const check = await User.findOne({$or:[
            {phone : phone},
            {email : email}
        ]})
        if(check) {
            return res.status(400).json({err:{message : "User already exists"}})
        }

        
        //Save use to database
        const user = new User({firstName, lastName , dateOfBirth,gender, email, phone , password : bcryptjs.hashSync(password , 10)})
        try {
            const u = await user.save()
            //Generate code verify email
            const code = await new Verify({
                user: u._id,
                token: Math.floor(Math.random() *100000).toString()
            }).save()
            //Send code verify to email address 
            await sendMail(email, 
                "Xác nhận email",
                "confirmEmail",
                {
                    name : "Giang", 
                    code : code.token,
                    email : email,
                }
            )
            const verifyToken= generateToken({id :u._id } , process.env.VERIFY_KEY , '1m')
            res.status(200).json({success : {verifyToken}})
        }catch(err) {
            next(err)
        }
    },
    refreshToken:async(req, res , next) => {
        //Check refresh token 
        const refreshToken = req.query.rToken
        if(!refreshToken || refreshToken == ""){
            return res.status(401).json({err:{message : "Refresh token is required"}})
        }
        //Check refresh token exists in the database
        const checkRefreshToken = await RefreshToken.findOne({refreshToken})
        if(!checkRefreshToken){
            return res.status(401).json({err:{message : "Refresh token is incorrect"}})
        }
        // //Verify refresh token
        const data =  verifyToken(refreshToken , process.env.REFRESH_SECRET_KEY)
        //Json web token
        const secretToken= generateToken({id :data.id } , process.env.SECRET_KEY , '30m')
        
        return res.status(200).json({secretToken})
    },
    verifyEmail:async(req, res, next) => {
        const {token} = req.query
        const {code} = req.body
        //Check token is exists
        if(!token || token === ""){
            return res.status(401).json({err:{message : "Token is required"}})
        }
        // check code is exists
        if(!code || code === ""){
            return res.status(401).json({err:{message : "Code is required"}})
        }
        const data = verifyToken(token, process.env.VERIFY_KEY)
        const verify = await Verify.findOne({token : code})
        console.log(verify);
        if(!verify){
            return res.status(400).json({err:{message : "The code is incorrect"}})
        }
        
        try {
            await User.findOneAndUpdate({_id : mongoose.Types.ObjectId(data.id)} , {isVerify : true})
            return  res.status(200).json({success: true})
        } catch (error) {
            next(error)
        }    
    },
    upload :async(req, res , next)=>{
        const file = req.files.file
        if(!file)  return  res.status(401).json({error: {message: "No file upload"}})
        //Save file
        file.mv('./public/images/'+file.name)
        res.status(200).json({success: {path: `${process.env.HOST}/images/${file.name}`}})
    },
    changeAvatar:async(req, res , next)=>{
        try {
            const avatar = req.body.avatar
            if(!avatar){
                return res.status(401).json({err:{message : "avatar is required"}})
            }
            const fileName = avatar.split('/')[2]
            if (!fs.existsSync(`public/images/${fileName}`)) return res.status(404).json({error: 'File not found'});
            await User.findOneAndUpdate({id : req.data.id} , {thumbnail : avatar})
            return res.status(200).json({success: true})
        } catch (error) {
            next(error)   
        }
    },
    getAvatar:async(req, res , next) => {
        try {
            const avatar = await User.findOne({_id: mongoose.Types.ObjectId(req.data.id)} , {thumbnail : 1});
            return  res.status(200).json({success: {path: avatar.thumbnail}})
        } catch (error) {
            next(error)
        }
    },
    deleteAvatar : async(req, res , next)=>{
        try {
           const user = User.findById(req.data.id);
           if(user.thumbnail == `${process.env.HOST}/images/default_avatar.png`) {
               return res.status(403).json({err:{message: "You's avatar is default"}})
           }
           user.thumbnail = `${process.env.HOST}/images/default_avatar.png`
           await user.update({} , {thumbnail : `${process.env.HOST}/images/default_avatar.png`})
           return  res.status(200).json({success: true})
        } catch (error) {
            next(error)
        }
    },
    getListUserByName:async(req, res , next) => {
        const keyword = req.query.q
        if(!keyword || keyword === '') return res.status(400).json({ err : {message : 'keyword is required'}})  
        try {
            console.log(`/${keyword}/`);
            const users = await User.find(
                {$or : [{firstName    : {$regex : keyword}} , {lastName :{$regex : keyword}}]}
                
                , {password : 0 , created_at : 0 , updatedAt : 0 , createdAt : 0 , isVerify : 0 }
            )
            return res.status(200).json({...users})
        } catch (error) {
            return res.status(400).json({err : {message: error.message}})
        }
    },
    getUser : async(req, res , next)=>{
        const query = req.query.q
        var objId = new mongoose.Types.ObjectId( (query.length <= 12) ? "123456789012" : query );
        try {
            const user = await User.findOne({
                $or: [
                    {email: query},
                    {phone : query},
                    {_id : objId}
                ]
            })
            
            return res.status(200).json({
                firstName : user.firstName,
                lastName : user.lastName,
                dateOfBirth: user.dateOfBirth,
                thumbnail : user.thumbnail,
                email : user.email, 
                phoneNumber : user.phoneNumber,
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({err:{message: "This user not found"}})
        }
    },
    addFriend :async(req, res , next) => {
        try {
            const user = await User.findOne({_id: new mongoose.Types.ObjectId(req.data.id)});
            console.log();
        } catch (error) {
            
        }
    }
}

export default userController