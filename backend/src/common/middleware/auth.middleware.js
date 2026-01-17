import jwt from 'jsonwebtoken'

export const protect = (req,res,next)=>{
    try{
         console.log('JWT SECRET ===>', process.env.JWT_SECRET_KEY)
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message:'Not Authorised'})
        }    
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = {userId:decoded.userId}
        next()
    }catch(err){
        console.error(err)
        return res.status(401).json({message:"Invalid Token"})
    }
} 
