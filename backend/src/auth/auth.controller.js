import bcrypt from "bcryptjs"
import User from './user.model.js'
import jwt from 'jsonwebtoken'

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

export const login = async (req,res)=>{
    try{
        const {email, password} = req.body

        if(!email||!password){
            return res.status(400).json({message:"All fields required"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:"Invalid credentials"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign(
            {userid: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: process.env.JWT_EXPIRES_IN|| "1d"}
        )

        res.status(200).json({
            message:"Login Successfull",
            token
        })


    }catch(err){
        console.error(err)
        res.status(500).json({message:"server error"})
    }
}