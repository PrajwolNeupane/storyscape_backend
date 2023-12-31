import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: Array,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Array,
        required: true
    },
    dislikes: {
        type: Array,
        required: true
    },
    mainDescription: String
})

const Blog = mongoose.models.BlogSchema || mongoose.model('Blog', BlogSchema);
export default Blog;

