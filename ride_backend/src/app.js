import express from "express";
import userRoutes from "./routes/routes.js";
import pool from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", userRoutes);

async function connectDB() {
  try {
    await pool.connect();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectDB();

export default app;
