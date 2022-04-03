import User from "../models/User.js";


export default function chat(io){
  const self = this;
  self.io = io;

  self.run = function(){
    self.io.on('connection', (socket)=>{
      console.log(socket.decoded_token)
      self.handleConnection(socket)
    })
  }

  //Handle connection
  self.handleConnection = (socket)=>{
    
  }
}
