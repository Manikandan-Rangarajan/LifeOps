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
      date:new Date(date)
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

export const getTransactions = async(req,res)=>{
  try{
    const userId = req.user.userId
    const filter = { userId }
    const { kind, year, month } = req.query
    const page = Math.max(parseInt(req.query.page)||1,1)
    const limit = Math.min(parseInt(req.query.limit)||20,100)
    const skip = (page-1)*limit

    if(kind==='expense'){
      filter.amount = {$lt:0}
    }
    if(kind==='income'){
      filter.amount = {$gt:0}
    }
    if(month && year){
      const start = new Date(year,month-1,1)
      const end = new Date(year,month,1)
      filter.date = {$gte:start,$lt:end}
    }

    const [transactions,total] = await Promise.all([
      Transaction.find(filter)
      .sort({date:-1})
      .skip(skip)
      .limit(limit),
      Transaction.countDocuments(filter)
    ])
    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total/limit),
      count: transactions.length,
      transactions
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

