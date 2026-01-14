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