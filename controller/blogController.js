import Blog from "../modal/blogModal.js";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from "../config/firebase.config.js"
import User from "../modal/userModal.js";
import jwt from 'jsonwebtoken';
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import * as dotenv from 'dotenv';
dotenv.config()

const storage = getStorage(initializeApp(config.firebaseConfig),process.env.STORAGE_URL);

export async function postBlog(req, res) {

    var downloadURLs = [];

    try {

        const token = req.body.token;
        if (!token) return res.status(401).send('Acess denied. No token provided.');

        const decode = jwt.verify(token, process.env.JWT_CODE);

        if (!decode) return res.status(401).send('Acess denied. No token provided.');

        var user = await User.findById(decode.id).select(['-password', "-__v"]);
        if (user) {

            for (const curr of req.files) {
                const compressedImage = await imagemin.buffer(curr.buffer, {
                    plugins: [
                        imageminMozjpeg({ quality: 60 }), // Adjust the quality as per your requirements
                        imageminPngquant({ quality: [0.6, 0.6] }), // Adjust the quality range as per your requirements
                    ]
                });
                const storageRef = ref(storage, `BlogImage/${curr.originalname}`);
                const metadata = {
                    contentType: curr.mimetype,
                };

                const snapshot = await uploadBytesResumable(storageRef, compressedImage, metadata);
                const url = await getDownloadURL(snapshot.ref);

                downloadURLs.push(url);
            }
            var blog = new Blog({
                creater: user?._id,
                title: req.body.title,
                date: Date.now(),
                likes: [],
                dislikes: [],
                slug: req.body.title.toLowerCase().replace(/\s/g, "-"),
                description: [
                    ...downloadURLs
                ]
            })

            blog = await blog.save();

            res.send({
                blog
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Error uploading images');
    }
}
