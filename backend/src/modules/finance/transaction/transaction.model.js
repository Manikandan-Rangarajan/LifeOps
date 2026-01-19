import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true
    },
    accountId:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required:true
    },
    amount:{
      type:Number,
      required:true
    },
    currency:{
      type:String,
      default:'INR'
    },
    type:{
      type:String,
      enum:['INCOME','EXPENSE','TRANSFER'],
      required:true
    },
    category:{
      type:String,
      required:true
    },
    note:{
      type:String
    },
    date:{
      type:String,
      required:true
    }
  },{timestamps:true}
)

export default mongoose.model('Transaction',transactionSchema)
