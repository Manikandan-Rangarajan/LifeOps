import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title:{
      type: String,
      required: true
    },
    description: String,
    active:{
      type: Boolean,
      default: true
    },
    startDate:{
      type: String,
      required: true
    },
    lastCompletedDate:{ 
      type:String
    },
    currentStreak:{
      type:Number,
      default:0
    },
    longestStreak:{
      type:Number,
      default:0
    }
  },{timestamps:true}
)

export default mongoose.model('Habit',habitSchema)
