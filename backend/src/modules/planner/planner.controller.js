import Planner from './planner.model.js'

export const createEvent = async (req,res)=>{
    try{
        const {title, description, eventTime, remindBefore} = req.body

        if(!title || !eventTime){
            return res.status(400).json({message:"all the fileds are required"})
        }

        const event = await Planner.create({
            userId: req.user.userId,
            title,
            description,
            eventTime,
            remindBefore,
            expiresAt: new Date(eventTime.getTime()+ 5 * 24 * 60 * 60 * 1000)
        })
        console.log('REQ.USER:', req.user)
        res.status(201).json({
            message:"Event created",
            event
        })

    }catch(err){
        console.error(err)
        return res.status(500).json({message:"internal server error"})
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
        
        const event = await Planner.findOneAndUpdate(
            {_id: id,userId},
            {completed:true},
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