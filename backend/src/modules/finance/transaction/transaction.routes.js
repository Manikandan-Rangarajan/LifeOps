import { Router } from "express";
import { appendTransaction, getTransactions, deleteTransaction } from "./transaction.controller.js";
import { protect } from '../../../common/middleware/auth.middleware.js'

const router = Router()

router.get("/",protect,getTransactions)
router.post("/",protect,appendTransaction)
router.delete('/:transactionId',protect,deleteTransaction)

export default router
