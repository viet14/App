import {verifyToken} from './index.js'

const socketAuthentication = {
    checkUser: (socket , next)=>{
        try {
            const data = verifyToken(socket.handshake.query.token, process.env.SECRET_KEY)
            socket.decoded_token = data
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default socketAuthentication