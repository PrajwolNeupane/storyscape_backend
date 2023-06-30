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

const storage = getStorage(initializeApp(config.firebaseConfig), process.env.STORAGE_URL);

export async function getBlogs(req, res) {
    try {
        let blogs = await Blog.find().select("-__v").populate('creater', ["-password", "-__v", "-isCreater"]);
        res.send(blogs);
    } catch (e) {
        console.log(e);
    }
}

export async function getSingleBlog(req, res) {
    try {
        const slug = req.params.slug;
        if(!slug){
            return res.status(404).send({message:"Slug not found"});
        }
        let blog = await Blog.findOne({ slug }).select("-__v").populate("creater", [
            "-password",
            "-__v",
            "-isCreater",
        ]);
        if (!blog) {
            return res.status(404).send({message:"Blog not found"});
        }
        res.send(blog);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Server error"});
    }
}


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

            var parsedParagraphs = JSON.parse(req.body?.paragraphs);
            var dataLength = parsedParagraphs.length + downloadURLs.length;
            var data = [];
            var imageIndex = 0;

            for (let m = 0; m < dataLength; m++) {
                const matchingParagraph = parsedParagraphs.find((curr) => curr.indx === m);
                if (matchingParagraph) {
                    data.push(matchingParagraph.paragraph);
                } else {
                    data.push(downloadURLs[imageIndex]);
                    imageIndex = imageIndex + 1;
                }
            }

            var blog = new Blog({
                creater: user?._id,
                title: req.body.title,
                tag: req.body.tag,
                date: Date.now(),
                likes: [],
                dislikes: [],
                slug: req.body.title.toLowerCase().replace(/\s/g, "-"),
                description: data
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
