import mongoose from "mongoose"
const Schema =  mongoose.Schema

const VerifySchema = new Schema({
    user: {type: Schema.Types.ObjectId,ref : 'User', required: true},
    token: {type : String,required: true},
    expireAt: {type: Date, default: Date.now()+60000}
})
VerifySchema.index({"expireAt": 1}, {expireAfterSeconds: 0})
const Verify = mongoose.model('VerifyToken' , VerifySchema)

export default Verify