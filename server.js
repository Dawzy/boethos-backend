// Imports
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorHandler from "./middleware/error.js";
import authRouter from "./routes/authRouter.js"
import sheetsRouter from "./routes/sheetsRouter.js"

// Initialize env variables
dotenv.config();

// App initialization
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"))

// Mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sheets", sheetsRouter);

// Mount middleware
app.use(errorHandler);

// Entry
const server = app.listen(
  PORT,
  console.log(`Running in ${process.env.NODE_ENV} on port: ${PORT}`)
)

process.on("unhandledRejection", (err, promise) => {
  // Log error that crashed app
  console.log(err);

  // Close server and exit process on unhandled rejection
  server.close(() => process.exit(1));
})