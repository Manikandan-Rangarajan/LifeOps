import express from "express"
import cors from "cors"
import routes from './auth/auth.routes.js'
import {protect} from './common/middleware/auth.middleware.js'
import plannerRoutes from "./modules/planner/planner.routes.js"
import recurringRoutes from './modules/recurring/recurring.routes.js'
import habitRoutes from "./modules/habits/habits.routes.js"
import bookRoutes from "./modules/books/book.routes.js"

const app = express() 

app.use(cors())
app.use(express.json())
app.use('/api',routes)
app.use('/api/planner',plannerRoutes)
app.use('/api/recurring',recurringRoutes)
app.use('/api/habit',habitRoutes)
app.use('/api/book', bookRoutes)
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
