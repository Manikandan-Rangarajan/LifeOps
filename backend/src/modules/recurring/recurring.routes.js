import exprsess from "express"
import { protect } from "../../common/middleware/auth.middleware.js"
import { createRecurringTask, resumeRecurringTask, pauseRecurringTask, getRecurringHabits,deleteRecurring } from "./recurring.controller.js"

const router = exprsess.Router()

router.get('/',protect,getRecurringHabits)
router.post('/',protect,createRecurringTask)
router.patch('/:id/pause',protect,pauseRecurringTask)
router.patch('/:id/resume',protect,resumeRecurringTask)
router.delete('/:recurringId',protect,deleteRecurring)

export default router
