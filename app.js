import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import globalErrorHandler from "./src/middlewares/globalErrorHandler.js";
import AppError from "./src/utils/appError.js";
import constants from "./src/utils/constants.js";
import authRouter from "./src/modules/auth/authRoute.js";
import schoolRouter from "./src/modules/school/schoolRoute.js";
import academicSessionRouter from "./src/modules/academicSession/academicSessionRoute.js";
import studentRouter from "./src/modules/student/studentRoute.js";

const app = express();

app.use(helmet());
// Global Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiPrefix = "/api/v1";

// API Routes
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/schools`, schoolRouter);
app.use(`${apiPrefix}/academic-sessions`, academicSessionRouter);
app.use(`${apiPrefix}/students`, studentRouter);

app.get("/", (req, res) => {
    res.status(200).json({ success: true, statusCode: 200, message: "Welcome to CollabHub" });
});

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ success: true, statusCode: 200, message: "OK" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ success: true, statusCode: 200, message: "OK" });
});

// Route Not Found Handler
app.use((req, res, next) => {
    throw new AppError(`${req.method}, Route ${req.originalUrl} not found`, constants.NotFound);
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;