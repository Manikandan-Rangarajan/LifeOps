import {startReminderJobs} from './reminder.job.js'
import dotenv from "dotenv"

// const envFile =
//   process.env.NODE_ENV === "production"
//     ? ".env.production"
//     : ".env.development";

dotenv.config();
const ENABLE_REMINDER = "true"

export const startJobs = ()=>{
  console.log("🛠️ Starting background jobs..."); 
  if (process.env.ENABLE_REMINDER==="true") {
  console.log("cron is working")
    startReminderJobs()
}else{
  console.log("⛔ Reminder job disabled via env");
  return;
}

}
