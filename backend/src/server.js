import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import "./jobs/index.js"

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({
  path: envFile,
  override: true
});

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("USING ENV FILE:", envFile);
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
