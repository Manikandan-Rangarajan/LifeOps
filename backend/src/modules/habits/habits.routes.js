import express from 'express'
import { createHabit, completeHabit } from './habits.controller.js'
import { protect } from '../../common/middleware/auth.middleware.js'

const router = express.Router();

router.post('/',protect,createHabit)
router.patch('/:id/complete',protect,completeHabit)

export default router
