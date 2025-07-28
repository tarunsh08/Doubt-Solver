import express from "express"
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controller.js"
import { auth } from "../middlewares/auth.js"

const router = express.Router()

router.use(auth)

router.get("/", getTickets)
router.get("/:id", getTicket)
router.post("/", createTicket)

export default router