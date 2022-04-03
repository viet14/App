const Schema = mongoose.Schema;
import mongoose from "mongoose";

const friend = new mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },{ timestamps: true }
);

const UserSchema = new Schema(
  {
    firstName: { type: String,required: true},
    lastName: {type: String,required: true},
    gender: {type: Number,min: 0,max: 2,required: true},
    thumbnail: {type: String,default: `${process.env.HOST}/image/default_avatar.png`},
    email: {type: String,required: true},
    phone: {type: String,required: true},
    password: {type: String,required: true},
    friends: {type: [friend],default: []},
    isVerify: {type: Boolean,default: false},
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
