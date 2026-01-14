import jwt from 'jsonwebtoken'

export const protect = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message:'Not Authorised'})
        }    
        const token = authHeader.split(' ')[1]
        const decoded = jwt.decode(token,process.env.JWT_SECRET_KEY)
        req.user = {userId:decoded.userid}
        next()
    }catch(err){
        console.error(err)
        return res.status(401).json({message:"Invalid Token"})
    }
} 