export const consoleChannel = {
  send:({userId, title, message, meta})=>{
    console.log("🔔 NOTIFICATION")
    console.log("User:", userId)
    console.log("Title:", title)
    console.log("Message:", message)
    console.log("Meta:", meta)
    console.log("--------------------")
  }
}
