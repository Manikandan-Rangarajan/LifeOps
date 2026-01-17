import Planner from '../planner/planner.model.js'
//import recurringModel from './recurring.model.js'
import Recurring from './recurring.model.js'

export const processRecurringTask = async (recurring)=>{
  const { userId, title, description, rule, nextRunAt } = recurring

  await Planner.create({
    userId,
    title,
    description,
    eventTime: nextRunAt,
    remindBefore: 30
  })
 
  const nextDate = calculateNextRun(nextRunAt, rule)

  await Recurring.updateOne(
    {_id: recurring._id },
    { $set: {nextRunAt: nextDate } }
  )
}

export const calculateNextRun = (currentDate, rule)=>{
  const next = new Date(currentDate)

  switch(rule.frequency){
    case "DAILY":
      next.setDate(next.getDate()+ rule.interval)
      break;
    case "WEEKLY":
      next.setDate(next.getDate()+7*rule.interval)
      break
    case "MONTHLY":
      next.setMonth(next.getMonth()+rule.interval)
      break
    default:
      throw new Error("Unsupported recurrence frequency")
  }
  return next
}
