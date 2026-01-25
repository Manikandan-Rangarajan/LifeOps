import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import "./jobs/index.js";

// ✅ Load env ONCE. Let Docker handle which values exist.
dotenv.config();

// 🔒 Hard fail if critical env missing
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// 🧠 Optional safety: never allow localhost in Docker
// if (process.env.MONGO_URI.includes("localhost")) {
//   console.error("❌ Invalid MONGO_URI: localhost is not allowed in Docker");
//   process.exit(1);
// }

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongo connection failed:", err);
    process.exit(1);
  });
