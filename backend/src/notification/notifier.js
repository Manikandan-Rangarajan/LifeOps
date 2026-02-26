import User from "../auth/user.model.js";
import { consoleChannel } from "./channels/console.channel.js";
import { emailChannel } from "./channels/email.channel.js";

export const notify = async ({ type, userId, title, message, meta }) => {
  const user = await User.findById(userId).lean();

  const payload = {
    user,
    title,
    message,
    meta,
  };

  consoleChannel.send(payload);

  if (type === "REMINDER") {
    await emailChannel.send(payload);
  }
};

