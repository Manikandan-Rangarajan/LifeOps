import { Router } from "express";
import { appendTransaction } from "./transaction.controller.js";
import { protect } from '../../../common/middleware/auth.middleware.js'

const router = Router()

router.post("/",protect,appendTransaction)

export default router
