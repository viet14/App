
const validations = {
    validateBody: (schema)=>{
        return (req , res , next)=>{
            const isValid = schema.validate(req.body)
            if(isValid.error){
                return res.status(400).json({err:{message: 'Invalid data'}})
            }
             next()
        }
    }
    
}

export default validations