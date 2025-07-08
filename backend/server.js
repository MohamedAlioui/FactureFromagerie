import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB connection with serverless optimization
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxIdleTimeMS: 30000,
      family: 4
    });
    
    cachedConnection = connection;
    console.log("✅ Connected to MongoDB");
    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ 
      error: "Database connection failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint - serve the app info or frontend
app.get("/", (req, res) => {
  // In production, serve the frontend, otherwise show API info
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.json({ 
      message: "Fromagerie Invoice API", 
      version: "1.0.0",
      status: "✅ API is running",
      routes: {
        "Health Check": "GET /api/health",
        "Authentication": {
          "Login": "POST /api/auth/login",
          "Register": "POST /api/auth/register",
          "Get User": "GET /api/auth/me",
          "Logout": "POST /api/auth/logout",
          "Change Password": "PUT /api/auth/change-password"
        },
        "Invoices": {
          "List": "GET /api/invoices",
          "Create": "POST /api/invoices",
          "Get": "GET /api/invoices/:id",
          "Update": "PUT /api/invoices/:id",
          "Delete": "DELETE /api/invoices/:id"
        },
        "Clients": {
          "List": "GET /api/clients",
          "Create": "POST /api/clients",
          "Get": "GET /api/clients/:id",
          "Update": "PUT /api/clients/:id",
          "Delete": "DELETE /api/clients/:id"
        },
        "Users": "GET /api/users (admin only)"
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running on Vercel",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Public routes (no authentication required)
app.use("/api/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/invoices", authenticateToken, invoiceRoutes);
app.use("/api/clients", authenticateToken, clientRoutes);
app.use("/api/users", userRoutes); // Admin-only routes with auth middleware inside

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the build directory
  app.use(express.static(path.join(__dirname, 'dist')));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// For local development, start the server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
export default app;
