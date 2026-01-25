import Book from './book.model.js'
import ReadingState from './readingState.model.js'
import ReadingSession from './readingSession.model.js'
import mongoose from 'mongoose'

export const startReadingBook = async(req,res)=>{
  try{
    const bookId = req.params.bookId
    const userId = req.user.userId
    const today = new Date().toISOString().split("T")[0]
    const book = await Book.findById(bookId)
    if(!book){
      return res.status(404).json({message:"Book not found"})
    }
    let state = await ReadingState.findOne(
      {userId,bookId}
    )

    if(!state){
      state = await ReadingState.create({
        userId,
        bookId,
        status:"READING",
        currentPage:0,
        startedAt:today,
        finishedAt:null
      })
      return res.status(201).json({message:"Started Reading",state})
    }

    if(state.status==="READING"){
      return res.status(200).json({message:"Already reading this book",state})
    }

    if(state.status==="NOT_STARTED"){
        state.status = "READING"
        state.startedAt = today
        await state.save()
        
        return res.status(200).json({message:"Reading started",state})
    }

    if(state.status==='FINISHED'){
      return res.status(400).json({message:"Book already finished"})
    }

  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}


export const logReadingSession = async (req,res)=>{
  try{
    const bookId = req.params.bookId
    const userId = req.user.userId
    const {startPage, endPage, notes} = req.body
    const today = new Date().toISOString().split('T')[0]
    const book = await Book.findById(bookId)
    if(!book){
      return res.status(404).json({message:"Book not found"})
    }
    const state = await ReadingState.findOne({userId,bookId})
    if(!state){
      return res.status(400).json({message:"Start Reading the book first"})
    }
    if(state.status!=='READING'){
      return res.status(400).json({message:"Book is currently not being read"})
    }
    if(startPage!==state.currentPage){
      return res.status(400).json({message:"Invalid start page"})
    }
    if(startPage>=endPage){
      return res.status(400).json({message:"Invalid page range"})
    }
    if(endPage > book.totalPages){
      return res.status(400).json({message:"Exceeds total page"})
    }

    const session = await ReadingSession.create({
      userId,
      bookId,
      startPage,
      endPage,
      date:today,
      notes
    })

    state.currentPage = endPage

    if(state.currentPage===book.totalPages){
      state.status = 'FINISHED'
      state.finishedAt = today
    }

    await state.save()
    res.status(201).json({
      message:"Session logged",
      state,
      session
    })

  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}


export const createBook = async(req,res)=>{
  try{
    const userId = req.user.userId
    const { title, author, totalPages, tags } = req.body

    if(!title || !author || !totalPages){
      return res.status(400).json({message:"Missing some fields"})
    }

    if(totalPages <= 0){
      return res.status(400).json({message:"Enter proper book total pages"})
    }

    const book = await Book.create({
      title:title.trim(),
      author:author.trim(),
      totalPages,
      tags,
      createdBy:userId
    })

    res.status(201).json({
      message:"Book created successfully", book
    })

  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}


export const getAllBooks = async (req,res)=>{
  try{
    const books = await Book.find()
    res.status(200).json({
      count: books.length,
      books
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getBookById = async(req,res)=>{
  try{
    const bookId = req.params.bookId
    const book = await Book.findById(bookId)
    if(!book){
      return res.status(404).json({message:"Book not found"})
    }
    res.status(200).json({
      message:"Book found",
      book
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getReadingState = async(req,res)=>{
  try{
    const bookId = req.params.bookId
    const userId = req.user.userId

    const state = await ReadingState.findOne({bookId,userId})
    if(!state){
      return res.status(404).json({message:"ReadingState not found"})
    }
    res.status(200).json({
      state
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}


export const getCompletedBooks = async(req,res)=>{
  try{
    const userId = req.user.userId
    const completedBooks = await ReadingState.find({
      userId,
      status:'FINISHED' 
    })

    res.status(200).json({
      count:completedBooks.length,
      completedBooks
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getCurrentlyReadingBooks = async(req,res)=>{
  try{
    const userId = req.user.userId
    const currentlyReadingBooks = await ReadingState.find({
      userId,
      status: 'READING'
    })
    res.status(200).json({
      count:currentlyReadingBooks.length,
        currentlyReadingBooks
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getMyReadingSessions = async(req,res)=>{
  try{
    const bookId = req.params.bookId
    const userId = req.user.userId

    const sessions = await ReadingSession.find({
      userId,
      bookId
    }).sort({date:1})

   // sessions.sort((a,b)=>a-b)
    res.status(200).json({
      count: sessions.length,
      sessions
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const deleteBook = async(req,res)=>{
  try{
    const userId = req.user.userId
    const bookId = req.params.bookId

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findOneAndDelete({
      _id:bookId,
      createdBy:userId
    })
    if(!book){
      return res.status(404).json({message:"Either book not found or you are not the one created it"})
    }
    res.status(200).json({
      message:"Book deleted successfully"
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}