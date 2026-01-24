import mongoose from "mongoose";
import Transaction from "../transaction/transaction.model.js";
import Account from "../account/account.model.js"

export const incomeVsExpenseAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { year, month } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Missing month or year" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [
                { $lt: ["$amount", 0] },
                { $abs: "$amount" },
                0
              ]
            }
          }
        }
      }
    ]);

    const summary = result[0] || { income: 0, expense: 0 };

    const income = summary.income;
    const expense = summary.expense;
    const savings = income - expense;

    res.status(200).json({
      income,
      expense,
      savings
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const categoryWiseSplit = async(req,res)=>{
  try{
    const userId = req.user.userId
    const { year, month } = req.query
    if(!year || !month){
      return res.status(400).json({message:"Missing reuired fields"})
    }
    const start = new Date(year,month-1,1)
    const end = new Date(year,month,1)

    const result = await Transaction.aggregate([
      {
        $match:{
          userId: new mongoose.Types.ObjectId(userId),
          date: {$gte:start,$lt:end},
          amount:{$lt:0}
        }
      },
      {
        $group:{
          _id:"$category",
          total:{$sum:{$abs:"$amount"}}
        }
      },
      {
        $project:{
          _id:0,
          category:"$_id",
          total:1
        }
      }
    ])
    res.status(200).json(result)

  }catch(err){
      console.error(err)
      return res.status(500).json({message:"Internal server error"})
    
  }
}


export const accountWiseSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: "$accountId",
          income: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          accountId: "$_id",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] }
        }
      }
    ]);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const netBalance = async(req,res)=>{
  try{
    const userId = req.user.userId
    const { year , month } = req.query
    if(!year || !month){
      return res.status(400).json({message:"Missing required fields"})
    }
    const start = new Date(year,month-1,1)
    const end = new Date(year,month,1)

    const result = await Transaction.aggregate([
      {$match:{
        userId: new mongoose.Types.ObjectId(userId),
        date: {$gte:start,$lt:end}
      }},{$group:{
        _id:null,
        income:{
          $sum:{
            $cond:[{$gt:["$amount",0]},"$amount",0]
          }
        },
        expense:{
          $sum:{
            $cond:[{$lt:["$amount",0]},{$abs:"$amount"},0]
          }
        }
      }},{$project:{
        _id:0,
        income:1,
        expense:1,
        net:{$subtract:["$income","$expense"]}
      }}
    ])
    const summary = result[0]||{income:0,expense:0,net:0}
    res.status(200).json(summary)
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}
