import Blog from "../modal/blogModal.js";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import config from "../config/firebase.config.js"
import User from "../modal/userModal.js";
import jwt from 'jsonwebtoken';

initializeApp(config.firebaseConfig);

const storage = getStorage();

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
                const storageRef = ref(storage, `BlogImage/${curr.originalname}`);
                const metadata = {
                    contentType: curr.mimetype,
                };

                const snapshot = await uploadBytesResumable(storageRef, curr.buffer, metadata);
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
                    ...downloadURLs,
                    ...req.body.paragraphs
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
