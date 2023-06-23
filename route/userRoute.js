import { checkKey } from '../controller/middleware.js';
import express from 'express'
import 'dotenv/config';
import { auth, logIn, signUp,adminSignUp,linkUser,adminLogIn, updateProfilePicture } from '../controller/userController.js';
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/auth",checkKey,auth);

router.post("/login", checkKey, logIn)

router.post("/createUser", checkKey, signUp)

router.post("/admin/login",checkKey,adminLogIn)

router.post("/admin/createUser",checkKey,adminSignUp)

router.post("/admin/linkUser",checkKey,linkUser)

router.post("/update/profile/picture",[checkKey,upload.single("image")],updateProfilePicture);

export default router;