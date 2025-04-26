import express from "express";
import "dotenv/config"
import cors from "cors"
import authRoutes from "./src/Routes/authRoutes.js"
import bookRoutes from "./src/Routes/bookRoutes.js"
import { connectDB } from "./src/lib/db.js";


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})