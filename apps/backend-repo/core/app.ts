// Import dependencies
import express from "express";
import cors from "cors";
import userRoutes from "../routes/user-routes"
import authroutes from "../routes/auth-routes"

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(cors({
    origin: "*", // Izinkan semua origin (bisa disesuaikan)
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
    allowedHeaders: ["Content-Type", "Authorization"] // Header yang diizinkan
}));

app.use(express.json());

app.use('/api/v1/auth', authroutes)
app.use('/api/v1/user', userRoutes)

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// export { app, auth, db };
