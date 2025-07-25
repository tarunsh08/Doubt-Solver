import express from "express"
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controller.js"
import { auth } from "../middlewares/auth.js"

const router = express.Router()

router.get("/", auth, getTickets)
router.get("/:id", auth, getTicket)
router.post("/", auth, createTicket)

export default router