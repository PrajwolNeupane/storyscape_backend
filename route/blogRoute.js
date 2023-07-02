import { checkKey } from '../controller/middleware.js';
import express from 'express'
import 'dotenv/config';
import multer from "multer";
import { getBlogs,postBlog,getSingleBlog ,getBlogsWithTag} from '../controller/blogController.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/',checkKey,getBlogs);

router.post('/single',checkKey,getSingleBlog);

router.post('/tag',checkKey,getBlogsWithTag);

router.post("/add",[checkKey,upload.array("images")],postBlog);



export default router;