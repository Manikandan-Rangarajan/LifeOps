import mongoose from "mongoose";

const readingSession = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    bookId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book'
    },
    startPage:{
      type: Number,
      required: true
    },
    endPage:{
      type: Number,
      required: true
    },
    date:{
      type: String,
      required: true,
    },
    notes:{
      type: String
    }
  }
  ,{timestamps:true}
)

export default mongoose.model('ReadingSession',readingSession)
