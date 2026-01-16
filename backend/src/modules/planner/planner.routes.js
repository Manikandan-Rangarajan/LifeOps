import express from 'express'
import { createEvent, getEvent,updateEvent, completeEvent } from './planner.controller.js'
import {protect} from '../../common/middleware/auth.middleware.js'

const router = express.Router()

router.post('/',protect,createEvent)
router.get('/',protect,getEvent)
router.patch('/:id',protect,updateEvent)
router.patch("/:id/complete",protect,completeEvent)
export default router
