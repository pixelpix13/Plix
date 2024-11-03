import express from 'express';
import { signup, login, logout, verify } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup); // Ensure this is POST
router.post("/login", login);    // POST for login
router.get("/logout", logout);   // GET for logout
router.post("/verify", verify);

export default router;

