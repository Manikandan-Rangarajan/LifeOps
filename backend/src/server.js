import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("mongodb connected");
    app.listen(PORT,()=>{
        console.log(`server running on ${PORT}`)
    })
}).catch(err=>{
    console.log('Db error',err);
})