import mongoose from 'mongoose'

const userDb = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    title:{
        type: String,
        required: true,
        trim:true
    },
    description:{
        type: String
    },
    eventTime:{
        type: Date,
        required: true
    },
    remindBefore:{
        type: Number,
        default: 30
    },
    completed:{
        type: Boolean,
        default: false
    },
    reminded:{
        type: Boolean,
        default:false
    }
},
    {timestamps:true}
)

export default mongoose.model('Planner',userDb)