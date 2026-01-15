import express from 'express'
import { createEvent, getEvent } from './planner.controller.js'
import {protect} from '../../common/middleware/auth.middleware.js'

const router = express.Router()

router.post('/',protect,createEvent)
router.get('/',protect,getEvent)

export default router