import mongoose from "mongoose";

const readingStateSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    currentPage:{
      type: Number,
      default: 0
    },
    status:{
      type: String,
      enum: ["NOT_STARTED","READING","FINISHED" ],
      required: true,
      default: "NOT_STARTED"
    },
    startedAt:{
      type: String
    },
    finishedAt:{
      type: String
    }
  },
  {timestamps:true}
)

readingStateSchema.index({
  userId:1,
  bookId:1
},{
  unique:true
})

export default mongoose.model('ReadingState',readingStateSchema)
