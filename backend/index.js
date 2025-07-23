import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=> 
    console.log("Connected to MongoDB"),
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
)
.catch((err)=> console.error("MongoDB error:", err))