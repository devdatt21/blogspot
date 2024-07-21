//for env file configuration
import dotenv from 'dotenv';
dotenv.config();


//framework library
import express from 'express';
//to resolve path addressess
import path from 'path';

//routes
import userRouter from "./routes/user.js";
import blogRouter from './routes/blog.js';

//to fetch Blogs from blog model
import Blog from "./models/blog.js";

//for database things
import mongoose from 'mongoose';

//to parse token into cookie (token is a thing we generate with JWT(json web token))
import cookieParser from 'cookie-parser';
//middleware for authenticating the user (used in signin part)
import { checkForAuthenticationCookie } from './middlewares/authentication.js';


// Creating an instance of express
const app = express();
//here if the site is running on the cloud then 8000 port would not be available
const PORT = process.env.PORT || 8000;

//connecting mongo database
// mongoose //here we can give any name to the model(table) here we gave blogspot
//     .connect("mongodb://localhost:27017/blogspot")
//     .then((e) => { console.log("mongo DB connected") })

//           if site is running on the website
mongoose //here we have to give MONGO_URL while running the 
    .connect("mongodb+srv://devdattrupapara21:B206W6t4tuShMyLZ@blogspot.6ubrio4.mongodb.net/blogspot?retryWrites=true&w=majority&appName=blogspot", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000
    })
    .then((error) => { console.log("mongo DB connected") });

// Setting template engine to render html pages on the browser
app.set("view engine", "ejs");

//to resolve views table (we have all the html (ejs) pages in the views folder)
app.set("views", path.resolve("./views"));

//setting middleware to decode form data
app.use(express.urlencoded({ extended: false }));
//to parse token into cookie
app.use(cookieParser());
//it's defined in middleware folder, applies the authentication middleware globally. This means every incoming request will pass through this middleware before reaching any route handler.
app.use(checkForAuthenticationCookie("token"));
//to load public folder statically to load images (when in html we give as "img src="/public/images"" the browser thinks that it is a url request but with this it reads as file fetch request )
app.use(express.static(path.resolve("./public")));



//setting a route for home page
app.get("/", async(req, res) => { //here we are sorting by created date and in descending order
    const allBlogs = await Blog.find({}).sort({ 'createdAt': -1 });

    res.render("home", {
        //here we are giving home page a user and blogs(all the blogs)
        user: req.user,
        blogs: allBlogs,
    })
})

//when query fires on /user or /blog it redirects it to userRouter and blogRouter respectively
app.use("/user", userRouter);
app.use("/blog", blogRouter);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server started at Port no. ${PORT}`);
});