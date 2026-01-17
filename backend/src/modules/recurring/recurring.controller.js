//import recurringModel from "./recurring.model.js";
import Recurring from "./recurring.model.js";
import { calculateNextRun } from "./recurring.service.js";


export const createRecurringTask = async (req,res)=>{
  try{
    const userId = req.user.userId
    const { title, description, rule, startAt} = req.body

    if(!title || !rule || !rule.frequency || !startAt){
      return res.status(400).json({message:"Some important field are missing"})
    }
    
    const allowedFreq = ["DAILY","WEEKLY","MONTHLY"]
    if (!allowedFreq.includes(rule.frequency)){
      return res.status(400).json({
        message:"Invalid recurrence frequency"
      })
    }

    const firstRunAt = new Date(startAt)
    if(isNaN(firstRunAt.getTime())){
      return res.status(400).json({
        message:"invalid startAt date"
      })
    }

    if(firstRunAt < new Date()){
      return res.status(400).json({
        message:"startAt must be in the future"
      })
    }

    const recurringEvent = await Recurring.create({
      userId,
      title,
      description,
      rule,
      nextRunAt: firstRunAt
    })

    res.status(201).json({
      message:"Recurring event created successfully",
      recurringEvent 
    })

  }catch(err){
    console.log(err);
    res.status(500).json({message:"Interal server error"})
  }
}

export const pauseRecurringTask = async(req,res)=>{
  try{
    const { id } = req.params
    const userId = req.user.userId

    const event = await Recurring.findOneAndUpdate(
      {_id:id,userId},{$set:{active:false}},
      {new:true}
    )

    if(!event){
      console.log(event)
      return res.status(404).json({message:"No such event"})
    }

    res.status(200).json(
      {message:"recurring event paused successfully"},
      event
    )

  }catch(err){
    console.error(err);
    return res.status(500).json({message:"Internal server error"})
  }
}

export const resumeRecurringTask = async(req,res)=>{
  try{
    const { id } = req.params
    const userId = req.user.userId

    const resumeEvent = await Recurring.findOne({_id:id,userId})
    if(!resumeEvent){
      return res.status(404).json({message:"Invalid object id"})
    }
    if(resumeEvent.active){
      return res.status(200).json({message:"Recurring event already active"})
    }

    const nextDate = calculateNextRun(new Date(),resumeEvent.rule)

    await Recurring.updateOne(
      {_id:id,userId},{$set:{nextRunAt: nextDate,active:true}}
    )

    res.status(200).json({message:"Recurring event resumed successfully"})

  }catch(err){
    console.log(err)
    return res.status(500).json({message:"Internal server error"})
  }
}
