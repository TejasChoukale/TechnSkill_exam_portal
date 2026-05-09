import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const demoUsers = [
    { email: "admin@technnskill.com", password: "admin123" },
    { email: "rahul@student.com", password: "student123" },
  ];

  for (const userData of demoUsers) {
    const hashed = await bcrypt.hash(userData.password, 10);
    const result = await User.updateOne(
      { email: userData.email },
      { password: hashed },
    );
    console.log(userData.email, result.modifiedCount ? "updated" : "unchanged");
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
