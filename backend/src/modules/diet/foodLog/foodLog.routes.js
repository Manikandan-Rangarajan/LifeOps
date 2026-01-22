import { Router } from "express";
import { protect } from "../../../common/middleware/auth.middleware.js"
import { addFoodLog, getFoodLog, getMonthlyFoodTrend } from "./foodLog.controller.js";

const router = Router()

router.get('/',protect,getFoodLog)
router.get('/monthly',protect,getMonthlyFoodTrend)
router.post('/',protect,addFoodLog)


export default router
