import { Router } from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const blogRouter = Router();

const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        //here we are giving an uploaded file a destination
        cd(null, path.resolve(`./public/uploads`));
    },
    filename: function(req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },

})

const upload = multer({ storage: storage })

blogRouter.get("/add-new", (req, res) => {
    return res.render("addblog", {
        user: req.user,
    })
})

//dynamic route to get perticuler blog
blogRouter.get('/:id', async(req, res) => {
    //populate used to feed data of user as we have referenced the user while creating Blog model
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    console.log("blog", blog);
    console.log("Comments", comments);

    res.render("blog", {
        user: req.user,
        blog,
        comments,
    })
})

//for comments
blogRouter.post("/comment/:blogId", async(req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })

    return res.redirect(`/blog/${req.params.blogId}`);
})


//here we are using middleware to upload file (photos)
blogRouter.post("/", upload.single("coverImage"), async(req, res) => {
    const { title, body } = req.body;

    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });

    return res.redirect(`/blog/${ blog._id }`);

});

export default blogRouter;