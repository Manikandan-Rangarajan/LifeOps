import mongoose from "mongoose";

const recurringSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title:{
      type:String,
      required: true
    },

    description: String,

    rule:{
      frequency:{
        type: String,
        enum: ["DAILY","WEEKLY","MONTHLY"],
        required: true
      },
      
      interval:{
        type:Number,
        default:1
      },

      daysOfWeek:[Number]
    },

    nextRunAt:{
      type:Date,
      required:true
    },

    active:{
      type: Boolean,
      default:true
    }
  },
  {timeStamps: true}
)

export default mongoose.model("Recurring",recurringSchema)
