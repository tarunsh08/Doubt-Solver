import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { serve } from 'inngest/express'
import userRoutes from './routes/user.route.js'
import ticketRoutes from './routes/ticket.route.js'
import inngest from './inngest/client.js'
import { signup } from './inngest/functions/signup.js'
import { onTicketCreated } from './inngest/functions/ticketcreate.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: "https://doubt-solver1.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [signup, onTicketCreated]
    })
)

mongoose.connect(process.env.MONGO_URI)
    .then(() =>
        console.log("Connected to MongoDB"),
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    )
    .catch((err) => console.error("MongoDB error:", err))