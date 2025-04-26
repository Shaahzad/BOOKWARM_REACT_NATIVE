import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectedRoutes = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        if(!token) {
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECCRET_KEY)
        const user = await User.findById(decoded.id).select("-password")

        if(!user) {
            return res.status(401).json({message: "Unauthorized"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }
}

export default protectedRoutes

