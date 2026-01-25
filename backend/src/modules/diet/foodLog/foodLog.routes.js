import { Router } from "express";
import { protect } from "../../../common/middleware/auth.middleware.js"
import { addFoodLog, getFoodLog, getMonthlyFoodTrend, getWeeklyCalories } from "./foodLog.controller.js";

const router = Router()

router.get('/',protect,getFoodLog)
router.get('/monthly',protect,getMonthlyFoodTrend)
router.get('/weekly',protect,getWeeklyCalories)
router.post('/',protect,addFoodLog)


export default router
