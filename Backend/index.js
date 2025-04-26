import express from "express";
import "dotenv/config"
import authRoutes from "./src/Routes/authRoutes.js"
import { connectDB } from "./src/lib/db.js";


const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000



app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})