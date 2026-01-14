import express from "express"
import bcrypt from "bcryptjs"
import cors from "cors"
import routes from './auth/auth.routes.js'

const app = express() 

app.use(cors())
app.use(express.json())
app.use('/api',routes)

app.get('/',(req,res)=>{
    res.json({status:'ok'})
})

export default app