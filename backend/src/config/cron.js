// import cron from 'node-cron'
// import Planner from '../modules/planner/planner.model.js'

// cron.schedule("* * * * *", async()=>{
//     try{
//         const now = new Date()
//         const windowEnd = new Date(now.getTime()+60*60*1000)

//         const events = await Planner.find({
//             completed: false,
//             reminded: false,
//             eventTime: {$gt:now,$lte:windowEnd}
//         })

//         for(const event of events){
//             const reminderTime = new Date(
//                 event.eventTime.getTime()- event.remindBefore * 60 * 1000
//             )
//             if(reminderTime <= now){
//                 console.log(`⏰ REMINDER: ${event.title} at ${event.eventTime.toISOString()}`)
//                 event.reminded = true
//                 await Planner.updateOne(
//                     {_id:event.id,reminded:false},
//                     {$set:{reminded:true}}
//                 )
//             }
//         }
//     }catch(err){
//         console.log("Reminder job failed",err.message)
//     }
// })
