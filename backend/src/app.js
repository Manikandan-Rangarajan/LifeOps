import express from "express"
import bcrypt from "bcryptjs"
import cors from "cors"
import routes from './auth/auth.routes.js'
import {protect} from './common/middleware/auth.middleware.js'
import plannerRoutes from "./modules/planner/planner.routes.js"

const app = express() 

app.use(cors())
app.use(express.json())
app.use('/api',routes)
app.use('/api/planner',plannerRoutes)

app.get('/',(req,res)=>{
    res.json({status:'ok'})
})


app.get('/api/me',protect,(req,res)=>{
    res.json({
        message:"U r Authenticated",
        user: req.user
    })
})

export default app