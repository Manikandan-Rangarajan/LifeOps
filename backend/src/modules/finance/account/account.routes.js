import { Router } from "express"
import { createAccount, getAccountBalance } from "./account.controller.js"
import { protect } from "../../../common/middleware/auth.middleware.js"

const router = Router()

router.post("/",protect,createAccount)
router.get("/:accountId/balance",protect,getAccountBalance)

export default router
