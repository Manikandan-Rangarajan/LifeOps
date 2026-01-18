import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: true,
      immutable: true
    },
    author:{
      type: String,
      required: true,
      immutable: true
    },
    totalPages:{
      type: Number,
      required: true,
      immutable: true
    },
    tags:{
      type: [String],
      immutable: true
    }
  },
  {timestamps:true}
)

export default mongoose.model("Book",bookSchema)
