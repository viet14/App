
const validations = {
    validateBody: (schema)=>{
        return (req , res , next)=>{
            const isValid = schema.validate(req.body)
            console.log(isValid);
            if(isValid.error){
                return res.status(400).json({err:{message: 'Invalid data'}})
            }
             next()
        }
    }
}

export default validations