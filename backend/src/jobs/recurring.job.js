import cron from "node-cron"
import Recurring from "../modules/recurring/recurring.model.js"
import { processRecurringTask } from "../modules/recurring/recurring.service.js"

export const startRecurringJobs = ()=>{
  cron.schedule("* * * * *",async ()=>{
    console.log("🔁 RECURRING CRON TICK:", new Date().toISOString())

    try{
      const now = new Date();
      const  recurringTasks = await Recurring.find({
        active:true,
        nextRunAt:{$lte:now}
      })
      console.log("🔍 RECURRING FOUND:", recurringTasks.length)

      for(const recurring of recurringTasks){
        try{
          await processRecurringTask(recurring)
        }catch(err){
          console.error(
            "❌ Failed to process recurring task:",
            recurring._id,
            err.message
          )
        }
      }
    }catch(err){
      console.error(
            "❌ Failed to process recurring task:",
            err.message
          )
    }
  })
}
