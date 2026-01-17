import exprsess from "express"
import { protect } from "../../common/middleware/auth.middleware.js"
import { createRecurringTask, resumeRecurringTask, pauseRecurringTask } from "./recurring.controller.js"

const router = exprsess.Router()

router.post('/',protect,createRecurringTask)
router.patch('/:id/pause',protect,pauseRecurringTask)
router.patch('/:id/resume',protect,resumeRecurringTask)

export default router
