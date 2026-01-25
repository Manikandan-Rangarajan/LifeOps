//import recurringModel from "./recurring.model.js";
import Recurring from "./recurring.model.js";
import { calculateNextRun } from "./recurring.service.js";
import mongoose from "mongoose";


export const createRecurringTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, rule, startAt } = req.body;

    if (!title || !rule?.frequency || !startAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowedFreq = ["DAILY", "WEEKLY", "MONTHLY"];
    if (!allowedFreq.includes(rule.frequency)) {
      return res.status(400).json({ message: "Invalid recurrence frequency" });
    }

    const firstRunAt = new Date(startAt);
    if (isNaN(firstRunAt.getTime())) {
      return res.status(400).json({ message: "Invalid startAt date" });
    }

    const now = new Date();
    if (firstRunAt.getTime() < now.getTime() - 60_000) {
      return res.status(400).json({ message: "startAt must not be in the past" });
    }

    const recurringEvent = await Recurring.create({
      userId,
      title,
      description,
      rule: { frequency: rule.frequency },
      startAt: firstRunAt,
      nextRunAt: firstRunAt,
      active: true
    });

    res.status(201).json({
      message: "Recurring event created successfully",
      recurringEvent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


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
      {message:"recurring event paused successfully",
      event}
    )

  }catch(err){
    console.error(err);
    return res.status(500).json({message:"Internal server error"})
  }
}

export const resumeRecurringTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const event = await Recurring.findOne({ _id: id, userId });
    if (!event) {
      return res.status(404).json({ message: "Recurring event not found" });
    }

    if (event.active) {
      return res.status(200).json({ message: "Recurring event already active" });
    }

    const baseDate = event.nextRunAt || event.startAt;
    const nextDate = calculateNextRun(baseDate, event.rule);

    event.active = true;
    event.nextRunAt = nextDate;
    await event.save();

    res.status(200).json({
      message: "Recurring event resumed successfully",
      event
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getRecurringHabits = async (req, res) => {
  try {
    const userId = req.user.userId;

    const events = await Recurring.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: events.length,
      events
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRecurring = async(req,res)=>{
  try{
    const userId = req.user.userId
    const recurringId = req.params.recurringId

    if (!mongoose.Types.ObjectId.isValid(recurringId)) {
     return res.status(400).json({ message: "Invalid recurring id" });
    }

    const recurring = await Recurring.findOneAndDelete({
      _id:recurringId,
      userId
    })
    if(!recurring){
      return res.status(404).json({message:"Recurring task not found"})
    }
    res.status(200).json({
      message:"recurring task deleted successfully"
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}