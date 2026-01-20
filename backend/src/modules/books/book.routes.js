import express from "express";
import { protect } from "../../common/middleware/auth.middleware.js"
import { createBook, startReadingBook, logReadingSession, getAllBooks, getBookById, getReadingState, getCurrentlyReadingBooks, getCompletedBooks, getMyReadingSessions } from "./book.controller.js";
const router = express.Router()

router.get('/',getAllBooks)
router.get('/:bookId',getBookById)
router.get('/:bookId/state',protect,getReadingState)
router.get('/reading',protect,getCurrentlyReadingBooks)
router.get('/finished',protect,getCompletedBooks)
router.get('/:bookId/sessions',protect,getMyReadingSessions)
router.post('/',protect,createBook)
router.post('/:bookId/start',protect,startReadingBook)
router.post('/:bookId/session',protect,logReadingSession)

export default router
