import Planner from './planner.model.js'

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventTime, remindBefore } = req.body

    if (!title || !eventTime) {
      return res.status(400).json({
        message: "title and eventTime are required"
      })
    }

    const eventDate = new Date(eventTime)

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        message: "Invalid eventTime format"
      })
    }

    const event = await Planner.create({
      userId: req.user.userId,
      title,
      description,
      eventTime: eventDate,
      remindBefore,
      expiresAt: new Date(
        eventDate.getTime() + 5 * 24 * 60 * 60 * 1000
      )
    })

    res.status(201).json({
      message: "Event created",
      event
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal server error" })
  }
}


export const getEvent = async (req,res)=>{
    try{
        const userId = req.user.userId
        const events = await Planner.find({userId})
        .sort({eventTime:1})
        res.status(200).json({
            count: events.length,
            events
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const updateEvent = async (req,res)=>{
    try{
        const userId = req.user.userId
        const {id} = req.params
        
        const updates = {}
        const allowedFields = ["title","description","eventTime","remindBefore"]

        for(const field of allowedFields){
          if(req.body[field]!== undefined){
            updates[field] = req.body[field] 
          }
        }

        if(Object.keys(updates).length===0){
            console.log(updates)
          return res.status(400).json({message:"No valid fields are mentioned"})
        }
        
        const event = await Planner.findOneAndUpdate(
            {
              _id: id,userId,
              completed: false,
              reminded:false
            },
            {$set: updates},
            {new:true}
        )
        if(!event){
            return res.status(404).json({message:"Event not found or cannot be"})
        }

        res.status(200).json({
            message:"Event updated successfully",
            event
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const completeEvent = async (req,res)=>{
  try{
    const {id} = req.params
    const userId = req.user.userId
    
    const event = await Planner.findOneAndUpdate(
      {_id:id,userId, completed:false},
      {$set:{completed: true}},
      {new:true}
    )

    if(!event){
      return res.status(404).json({message:"Event not found"})
    }

    res.status(200).json({
      message:"Event marked as completed",
      event
    })

  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}
