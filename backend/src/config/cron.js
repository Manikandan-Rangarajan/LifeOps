import cron from 'node-cron'
import Planner from '../modules/planner/planner.model.js'

cron.schedule("* * * * *", async()=>{
    const now = new Date()

    const events = await Planner.find({
        completed: false,
        reminded: false,
        eventTime: {$gt:now}
    })

    for(const event of events){
        const reminderTime = new Date(
            event.eventTime.getTime()- event.remindBefore * 60 * 1000
        )
        if(reminderTime <= now){
            console.log(`⏰ REMINDER: ${event.title} at ${event.eventTime.toISOString()}`)
            event.reminded = true
            await event.save()
        }
    }
})
