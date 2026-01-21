import Account from './account.model.js'
import Transaction from '../transaction/transaction.model.js'
import mongoose from 'mongoose'

export const createAccount = async(req,res)=>{
  try{
    const userId = req.user.userId
    const { name,type } = req.body
    if(!name || !type){
      return res.status(400).json({message:"Account name or account type missing"})
    }
    const existingAccount = await Account.findOne({userId,name})
    if(existingAccount){
      return res.status(400).json({message:"Account already exists with thi name"})
    }
    const account = await Account.create({
      userId,
      name,
      type
    })
    
    res.status(201).json({
      message:"Account created successfully",
      account
    })
  }catch(err){
    console.log(err)
    return res.status(500).json({message:'Internal server error'}) 
  }
}

export const getAccountBalance = async (req,res)=>{
  try{
    const userId = req.user.userId
    const accountId = req.params.accountId
    const account = await Account.findOne({
      _id:accountId,userId,active:true
    })
    if(!account){
      return res.status(404).json({message:"Account not found or Inactive"})
    }
    const result = await Transaction.aggregate([
      {
        $match:{
          userId: new mongoose.Types.ObjectId(userId),
          accountId : new mongoose.Types.ObjectId(accountId)
        }
      },{ $group:{
          _id:null,
          balance:{$sum:"$amount"}
        }
      }
    ])
    const balance = result.length>0? result[0].balance:0
    res.status(200).json({
      message:"Balance is sent",
      balance
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
} 
