import express from 'express'
import { createEvent, getEvent,updateEvent } from './planner.controller.js'
import {protect} from '../../common/middleware/auth.middleware.js'

const router = express.Router()

router.post('/',protect,createEvent)
router.get('/',protect,getEvent)
router.patch('/:id/complete',protect,updateEvent)

export default router