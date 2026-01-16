import cron from 'node-cron'
import Planner from '../modules/planner/planner.model.js'

export const startReminderJobs = ()=>{
  cron.schedule("* * * * *",async ()=>{
    try{

    }catch(err){
      console.error("❌ Reminder job failed:", err.message)
    }  

    const now = new Date
    const windowEnd = new Date(now.getTime()+60*60*1000)

    const events = Planner.find({
      reminded: false,
      completed: false,
      eventTime: ($gt:now,$lte:windowEnd)
    })
      
    for(const event of events){
      const reminderTime = new Date(
        event.eventTime.getTime() - event.remindBefore * 60 * 1000
      )

      if(reminderTime <= now){
        console.log(`⏰ REMINDER: ${event.title}`);
        await Planner .updateOne(
          {_id: event._id, reminded:false},
          {$set: {reminded: true}}
        )
      }
    }
  })
}
