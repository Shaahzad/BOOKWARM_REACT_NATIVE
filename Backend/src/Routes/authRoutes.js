import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const router = express.Router();


const generateToken = (id) => {
    // console.log(id)
   return jwt.sign({id}, process.env.JWT_SECCRET_KEY, {expiresIn: "1d"})
}

router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body
        if(!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        if(username.length < 3) {
            return res.status(400).json({message: "Username must be at least 3 characters"})
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"})
        }
        const existingUsername = await User.findOne({username})
        if(existingUsername) {
            return res.status(400).json({message: "Username already exists"})
        }

        const hashpass = await bcrypt.hash(password, 10)
        const profilePic = "https://cdn-icons-png.flaticon.com/512/149/149071.png"

        const user = await User.create({
            username,
            email,
            password: hashpass,
            profilePic
        })

        await user.save()
        const token = generateToken(user._id)
        return res.status(201).json({
            token,
            user
        })
        
    } catch (error) {
        console.log(error)
    }
})


router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({message: "Invalid Password"})
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            token,
            user
        })

    } catch (error) {
        console.log(error)
    }
})

export default router