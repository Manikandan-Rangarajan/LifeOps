import Account from '../account/account.model.js'
import Transaction from './transaction.model.js'

export const appendTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { accountId, amount, type, category, date, note } = req.body;

    if (!accountId || amount === undefined || !type || !category || !date) {
      return res.status(400).json({ message: "Some major fields are missing" });
    }

    const rawAmount = Number(amount);
    if (isNaN(rawAmount) || rawAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (!["INCOME", "EXPENSE"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const normalizedAmount =
      type === "EXPENSE" ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const account = await Account.findOne({
      _id: accountId,
      userId,
      active: true
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const transaction = await Transaction.create({
      userId,
      accountId,
      amount: normalizedAmount,
      type,
      category,
      note,
      date: parsedDate
    });

    res.status(201).json({
      message: "Transaction recorded",
      transaction
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


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
    if (month && year) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  filter.date = { $gte: start, $lt: end };
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

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { transactionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.deleteOne({ _id: transactionId });

    return res.status(200).json({
      message: "Transaction deleted successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
