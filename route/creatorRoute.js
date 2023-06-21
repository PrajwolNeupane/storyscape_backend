import { checkKey } from '../controller/middleware.js';
import express from 'express'
import { logIn, signUp } from '../controller/createrController.js';

const router = express.Router();

router.post("/login", checkKey, logIn)

router.post("/createUser", checkKey, signUp)

export default router;