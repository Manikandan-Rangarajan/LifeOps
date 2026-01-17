import cron from "node-cron";
import Planner from "../modules/planner/planner.model.js";
import { notify } from "../notification/notifier.js"
import { NOTIFICATION_TYPES } from "../notification/notification.types.js";

export const ENABLE_REMINDER = process.env.ENABLE_REMINDER === "true"

export const startReminderJobs = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏳ CRON TICK:", new Date().toISOString());
    
    try {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + 60 * 60 * 1000);

      const events = await Planner.find({
        reminded: false,
        completed: false,
        eventTime: {
          $gt: now,
          $lte: windowEnd
        }
      });

      console.log("🔍 EVENTS FOUND:", events.length);

      for (const event of events) {
        const reminderTime = new Date(
          event.eventTime.getTime() - event.remindBefore * 60 * 1000
        );

        if (reminderTime <= now) {
          notify({
            type: NOTIFICATION_TYPES.REMINDER,
            userId: event.userId,
            title: "TASK REMINDER",
            message: `Reminder for task: ${event.title}`,
            meta: {
              eventId: event._id,
              eventTime: event.eventTime
            }
          });

          await Planner.updateOne(
            { _id: event._id, reminded: false },
            { $set: { reminded: true } }
          );
        }
      }
    } catch (err) {
      console.error("❌ Reminder job failed:", err);
    }
  });
};
