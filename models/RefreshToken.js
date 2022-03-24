import mongoose from "mongoose"

const Schema = mongoose.Schema

const refreshTokenSchema = new Schema({
    refreshToken : {
        type: String,
        required: true
    },
    expireAt: {type: Date, default: Date.now()+604800000}
    }
)
refreshTokenSchema.index({"expireAt": 1}, {expireAfterSeconds: 0})

const RefreshToken = mongoose.model('RefreshToken' , refreshTokenSchema)

export default RefreshToken