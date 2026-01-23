import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title:{
    type: String,
    required: true,
    trim: true
  },
  ingredients:{
    type: [String],
    required: true,
  },
  steps:{
    type: [String],
    required: true,
  },
  macros:{
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }
},{timestamps:true})

export default mongoose.model('Recipe',recipeSchema)
