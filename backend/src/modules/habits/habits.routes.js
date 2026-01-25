import express from 'express'
import { createHabit, completeHabit,getHabits, pauseHabit,resumeHabit, deleteHabit } from './habits.controller.js'
import { protect } from '../../common/middleware/auth.middleware.js'

const router = express.Router();

router.get('/',protect,getHabits)
router.post('/',protect,createHabit)
router.patch('/:id/complete',protect,completeHabit)
router.patch('/:id/pause',protect,pauseHabit)
router.patch('/:id/resume',protect,resumeHabit)
router.delete('/:habitId',protect,deleteHabit)

export default router
