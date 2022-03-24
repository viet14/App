import User from "../modules/User.js";
import bcryptjs from "bcryptjs";

const userController = {
    signIn: (req, res , next) => {
        console.log(req.body);
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