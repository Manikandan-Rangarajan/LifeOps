import FoodLog from './foodLog.model.js'
import mongoose from 'mongoose'

export const addFoodLog = async(req,res)=>{
  try{
    const userId = req.user.userId
    const { mealType, date, calories, protein, carbs, fats, fiber } = req.body
    if(!date || !mealType || calories===undefined){
      return res.status(400).json({message:"Missing required fields"})
    }
    if(calories < 0){
      return res.status(400).json({message:"Calories cannot be less than zero"})
    }
    const log = await FoodLog.create({
      userId,
      date: new Date(date),
      mealType,
      calories,
      protein,
      carbs,
      fats,
      fiber
    })
    res.status(201).json(log)
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getFoodLog = async(req,res)=>{
  try{
    const userId = req.user.userId
    const {date} = req.query
    const filter = {userId}
    if( date ){
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate()+1)
      filter.date = {$gte:start,$lt:end}
    }

    const log = await FoodLog.find(filter).sort({date:-1})

    res.status(200).json({
      count:log.length,
      log
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getMonthlyFoodTrend = async (req, res) => {
  try {
    const userId = req.user.userId
    const { year, month } = req.query

    if (!year || !month) {
      return res.status(400).json({ message: "Missing year or month" })
    }

    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    const result = await FoodLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          dailyCalories: { $sum: "$calories" }
        }
      },
      {
        $group: {
          _id: null,
          averageCalories: { $avg: "$dailyCalories" },
          maxCalories: { $max: "$dailyCalories" },
          minCalories: { $min: "$dailyCalories" },
          daysLogged: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          averageCalories: { $round: ["$averageCalories", 0] },
          maxCalories: 1,
          minCalories: 1,
          daysLogged: 1
        }
      }
    ])

    const summary = result[0] || {
      averageCalories: 0,
      maxCalories: 0,
      minCalories: 0,
      daysLogged: 0
    }

    return res.status(200).json(summary)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal server error" })
  }
};

export const getWeeklyCalories = async(req,res)=>{
  try{
    const userId = req.user.userId
    const today = new Date()
    today.setHours(0,0,0,0)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate()-6)

    const logs = await FoodLog.find({
      userId,
      date:{
        $gte: startDate,
        $lt: today
      }
    })

    const map = {}

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = d.toISOString().split("T")[0];

      map[key] = {
        date: key,
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        calories: 0
      };
    }

    for (const log of logs) {
      const key = log.date.toISOString().split("T")[0];
      if (map[key]) {
        map[key].calories += log.calories;
      }
    }

    res.status(200).json({
      range: "last_7_days",
      data: Object.values(map)
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}
