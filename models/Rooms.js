import mongoose from "mongoose"
import increment from 'mongoose-sequence'

const autoIncrement = increment(mongoose)

const chat = new mongoose.Schema({
    id:{type:mongoose.Types.ObjectId},
    type:{type:String, enum:['image', 'text', 'file']},
    content:{type:String , required:true}
},{timestamps:true})

const RoomSchema =  new mongoose.Schema({
    roomId:{type : Number},
    users : {type: [mongoose.Types.ObjectId],default : []}, 
    chats: {type: [chat],default :[]}
})

//Add plugin
RoomSchema.plugin(autoIncrement , {start_seq : 1000 , inc_field : 'roomId'})

const Rooms = mongoose.model('Rooms', RoomSchema)
export default Rooms