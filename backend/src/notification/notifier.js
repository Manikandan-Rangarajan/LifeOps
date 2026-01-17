import { consoleChannel } from './channels/console.channel.js'

const channels = [
  consoleChannel
]

export const notify = ({type, userId, title, message, meta})=>{
  for(const channel of channels){
    channel.send({
      type,
      userId,
      title,
      message,
      meta
    })
  }
}
