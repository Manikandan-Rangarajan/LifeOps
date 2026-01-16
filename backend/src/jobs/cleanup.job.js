import {startReminderJobs} from './reminder.job.js'

export const startJobs = ()=>{
  console.log("🛠️ Starting background jobs...");

  if(process.env.ENABLE_REMINDERS=="true"){
    startReminderJobs()
    console.log("✅ Reminder job started")
  }else{
    console.log("⛔ Reminder job disabled")
  }
}
