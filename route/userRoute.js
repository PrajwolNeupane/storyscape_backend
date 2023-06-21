import { checkKey } from '../controller/middleware.js';
import express from 'express'
import 'dotenv/config';
import { auth, logIn, signUp } from '../controller/userController.js';

const router = express.Router();

router.post("/auth",checkKey,auth);

router.post("/login", checkKey, logIn)

router.post("/createUser", checkKey, signUp)

export default router;