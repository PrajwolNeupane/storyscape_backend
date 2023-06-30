import { checkKey } from '../controller/middleware.js';
import express from 'express'
import 'dotenv/config';
import multer from "multer";
import { getBlogs,postBlog,getSingleBlog } from '../controller/blogController.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/',checkKey,getBlogs);

router.get('/:slug',checkKey,getSingleBlog)

router.post("/add",[checkKey,upload.array("images")],postBlog);



export default router;