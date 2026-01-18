import express from "express";
import { protect } from "../../common/middleware/auth.middleware.js"
import { createBook, startReadingBook, logReadingSession, getAllBooks, getBookById } from "./book.controller.js";
const router = express.Router()

router.get('/',getAllBooks)
router.get('/:bookId',getBookById)
//router.get('/:bookId',)
router.post('/',protect,createBook)
router.post('/:bookId/start',protect,startReadingBook)
router.post('/:bookId/session',protect,logReadingSession)

export default router
