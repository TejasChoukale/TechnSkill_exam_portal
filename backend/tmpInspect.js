import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function inspect() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: "admin@technnskill.com" }).select(
    "+password",
  );
  console.log(user);
  await mongoose.disconnect();
}

inspect().catch((err) => {
  console.error(err);
  process.exit(1);
});
