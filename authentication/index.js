import jwt from "jsonwebtoken"
const generateToken = (data , key , exp) =>{
    return jwt.sign(data, key, {expiresIn : exp})
}

const verifyToken = (token , key)=>{
    return jwt.verify(token ,key)
}

export  {generateToken , verifyToken}