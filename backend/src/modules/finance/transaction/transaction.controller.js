import Account from '../account/account.model.js'
import Transaction from './transaction.model.js'

export const appendTransaction = async (req,res)=>{
  try{
    const userId = req.user.userId
    const { accountId, amount, type, category, date, note } = req.body
    if(!accountId || amount===undefined || !type || !category || !date){
      return res.status(400).json({message:"Some major fields are missing"})
    }
    if(amount===0){
      return res.status(400).json({message:"Amount cannot be zero"})
    }
    const account = await Account.findOne({
      _id:accountId,userId,active:true
    })
    if(!account){
      return res.status(404).json({message:"Account not found"})
    }

    const transaction = await Transaction.create({
      userId,
      accountId,
      amount,
      type,
      category,
      note,
      date
    })

    res.status(201).json({
      message:"Transaction recorded",
      transaction
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}
