import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name:{
      type: String,
      required: true
    },
    type:{
      type:String,
      enum:['CASH','BANK','CARD','WALLET','STOCKS','MFS'],
      required: true,
      default:'CASH'
    },
    currency:{
      type:String,
      default:'INR'
    },
    active:{
      type:Boolean,
      default:true
    }
  },{timestamps:true}
)

export default mongoose.model('Account',accountSchema)
