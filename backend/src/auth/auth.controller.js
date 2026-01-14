import bcrypt from "bcryptjs"
import User from './user.model.js'

export const register = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        if(!name||!email||!password){
            return res.status(400).json('All fields required');
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(409).json('User Already Exists...')
        }
        
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(200).json({
            message: 'User registerd successfully',
            userid: user._id
        })

    }catch(err){
        console.error(err);
        res.status(500).json("Internal server error")
    }
}