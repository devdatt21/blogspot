import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
        //required is bydefault false
    },
    createdBy: {
        //we have to give current user
        type: Schema.Types.ObjectId,
        ref: "user",
    },
}, { timestamps: true });

const Blog = model("blog", blogSchema);

export default Blog;