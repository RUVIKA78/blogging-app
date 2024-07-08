const express = require("express")
const User = require("../models/user.model")
const { createToken } = require("../utility/authentication")

const router = express.Router()

router.get('/signin', (req, res,) => {
    return res.render("signin")
})
router.get("/signup", (req, res) => {
    return res.render("signup")
})


router.post("/signup", async(req, res) => {
    const { fullName, email, password } = req.body;
    const user=await User.create({
        fullName, 
        email,
        password,
    })
    const token = createToken(user)
    return res.cookie("token",token).redirect("/")
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const token = await User.matchPassGeneToken(email, password);

        if (token) {
            return res.cookie("token", token).redirect('/');
        } else {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
    } catch (error) {
        console.log('Error during sign-in:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

router.get("/logout", (req, res)=> {
    res.clearCookie('token').redirect("/")
})

module.exports = router
