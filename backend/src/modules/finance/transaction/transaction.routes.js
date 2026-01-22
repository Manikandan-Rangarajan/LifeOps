import { Router } from "express";
import { appendTransaction, getTransactions } from "./transaction.controller.js";
import { protect } from '../../../common/middleware/auth.middleware.js'

const router = Router()

router.get("/",protect,getTransactions)
router.post("/",protect,appendTransaction)

export default router
