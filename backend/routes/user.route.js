import express from 'express'
import { getUsers, login, logout, signup, updateUser } from '../controllers/user.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post("/update-user", auth, updateUser)
router.get("/users", auth, getUsers)

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router