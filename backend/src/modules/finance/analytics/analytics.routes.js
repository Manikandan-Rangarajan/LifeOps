import { Router } from "express";
import { protect } from "../../../common/middleware/auth.middleware.js"
import { incomeVsExpenseAnalytics,categoryWiseSplit, accountWiseSummary, netBalance } from "./analytics.controller.js";

const router = Router()

router.get('/monthly',protect, incomeVsExpenseAnalytics)
router.get('/categories',protect,categoryWiseSplit)
router.get('/account',protect,accountWiseSummary)
router.get('/netbalance',protect,netBalance)

export default router
