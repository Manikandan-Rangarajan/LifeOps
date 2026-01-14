import express from 'express'
import { createEvent } from './planner.controller.js'
import {protect} from '../../common/middleware/auth.middleware.js'

const router = express.Router()

router.post('/',protect,createEvent)

export default router