//we ll need a router to route through different pages

import { Router } from "express";
import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/signin", (req, res) => {
    return res.render("signin");
})

userRouter.get("/signup", (req, res) => {
    return res.render("signup");
});

userRouter.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");
})

userRouter.post("/signin", async(req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("token of user ", token);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", { error: "incorrect credentials" })
    }
})

userRouter.post("/signup", async(req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect("/");
})


// 
export default userRouter;