import mongoose from 'mongoose'
import Habit from './habits.model.js'

export const createHabit = async(req,res)=>{
  try{
    const {title, description, startDate} = req.body
    const userId = req.user.userId

    if(!title || !startDate){
      return res.status(400).json({message:"Some fileds are missing"})
    }
    const today = new Date().toISOString().split("T")[0]
    
    if(!/^\d{4}-\d{2}-\d{2}$/.test(startDate)){
     return res.status(400).json({message:"Invalid date format"})
    }

    if(startDate < today){
     return res.status(400).json({ message: "startDate cannot be in the past" })
    }

    const habit = await Habit.create({
      userId,
      title,
      description,
      startDate
    })

    res.status(201).json({
      message:"Habit created succesfully",
      habit
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const completeHabit = async(req,res)=>{
  try{
    const habitId = req.params.id
    const userId = req.user.userId
    const today = new Date().toISOString().split("T")[0]
    const y = new Date
    y.setDate(y.getDate()-1)
    const yesterday = y.toISOString().split("T")[0]

    const habit = await Habit.findOne(
      {
        _id:habitId,userId,
        active:true
      }
    )
    if(!habit){
      return res.status(404).json({message:"Habit not found or Inactive"})
    }
    if(today < habit.startDate){
      return res.status(400).json({
        message:"Habit hasn't started yet"
      })
    }

    if(habit.lastCompletedDate === today){
      return res.status(200).json({message:"Already completed today"})
    }

    if(!habit.lastCompletedDate){
      habit.currentStreak = 1
    }else if(habit.lastCompletedDate === yesterday){
      habit.currentStreak += 1
    }else{
      habit.currentStreak = 1
    }

    if(habit.currentStreak > habit.longestStreak){
      habit.longestStreak = habit.currentStreak
    }

    habit.lastCompletedDate = today
    await habit.save()

    res.status(200).json({
      message:"Habit marked for today",
      habit
    })

  }catch(err){
    console.log(err)
    return res.status(500).json({message:"Internal server error"})
  }
}


export const pauseHabit = async(req,res)=>{
  try{
    const habitId = req.params.id
    const userId = req.user.userId
    const habit = await Habit.findOne(
      {
        _id: habitId,userId,
        active: true,
      }
    )
    if(!habit){
      return res.status(404).json({message:"Habit not found or inactive"})
    }
    habit.active = false
    await habit.save()
    res.status(200).json({
      message:"Habit paused sucessfully",
      habit
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

// export const getHabit = async(req,res)=>{
//   try{
//     const userId = req.user.userId
//     const habits = await Habit.find({userId})
    
//     res.status(200).json({
//       message:"habits found",
//       count: habits.length,
//       habits
//     })
//   }catch(err){
//     console.error(err)
//     return res.status(500).json({message:"Internal server error"})
//   }
// }

export const resumeHabit = async (req,res)=>{
  try{
    const habitId = req.params.id
    const userId = req.user.userId

    const habit = await Habit.findOneAndUpdate(
      {_id:habitId,userId,active:false},{$set:{active:true}},{new:true}
    )
    if(!habit){
      return res.status(404).json({message:"Habit not found"})
    }

    res.status(200).json({
      message:"Habit resumed successfully",
      habit
    })

  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getHabits = async (req, res) => {
  try {
    const userId = req.user.userId;

    const habits = await Habit.find({ userId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      count: habits.length,
      habits
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHabit = async(req,res)=>{
  try{
    const userId = req.user.userId
    const habitId = req.params.habitId
    
    if(!mongoose.Types.ObjectId.isValid(habitId)){
      return res.status(400).json({message:"Invlalid habit Id"})
    }
    const habit = await Habit.findOneAndDelete({
      _id:habitId,
      userId
    })
    if(!habit){
      return res.status(404).json({message:"Habit not found"})
    }
    res.status(200).json({
      message:"Habit deletd successfully"
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}