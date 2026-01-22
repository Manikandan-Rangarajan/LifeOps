import mongoose from "mongoose";

const foodLog = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date:{
    type: Date,
    required: true
  },
  mealType:{
    type:String,
    enum:['BREAKFAST','LUNCH','SNACK','DINNER'],
    required: true
  },
  calories:{
    type: Number,
    required: true
  },
  protein:{
    type:Number
  },
  carbs:{
    type:Number
  },
  fats:{
    type:Number
  },
  fiber:{
    type:Number
  }
},{timestamps:true})

export default mongoose.model('FoodLog',foodLog)
