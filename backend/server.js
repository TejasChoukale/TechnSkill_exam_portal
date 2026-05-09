import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import resultRoutes from "./routes/resultRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import examRoutes from "./routes/examRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const isBcryptHash = (value) =>
  typeof value === "string" &&
  /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);

const normalizeUserPasswords = async () => {
  const users = await User.find({}).select("+password");

  for (const user of users) {
    if (user.password && !isBcryptHash(user.password)) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.updateOne({ _id: user._id }, { password: hashedPassword });
      console.log(`Updated plain-text password for user: ${user.email}`);
    }
  }
};

const seedDefaultUsers = async () => {
  const defaultUsers = [
    {
      name: "Admin User",
      email: "admin@technnskill.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Rahul Student",
      email: "rahul@student.com",
      password: "student123",
      role: "student",
    },
  ];

  for (const userData of defaultUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });
      console.log(`Seeded default user: ${userData.email}`);
    }
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await normalizeUserPasswords();
    await seedDefaultUsers();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/results", resultRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
