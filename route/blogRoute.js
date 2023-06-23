import { checkKey } from '../controller/middleware.js';
import express from 'express'
import 'dotenv/config';
import multer from "multer";
import { postBlog } from '../controller/blogController.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/",[checkKey,upload.array("images")],postBlog);



export default router;