import express from "express";
import Book from "../models/book.js"
import cloudinary from "../lib/cloudinary.js"
import protectedRoutes from "../middleware/authmiddleware.js";
const router = express.Router();


router.post("/", protectedRoutes, async(req, res) => {
    try {
        const { title, caption, image, rating } = req.body

        if(!title || !caption || !image || !rating) {
            return res.status(400).json({message: "All fields are required"})
        }

        const response = await cloudinary.uploader.upload(image)
        const imageUrl = response.secure_url

        const book = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        })

        const savedBook = await book.save()
        return res.status(200).json(savedBook)

    } catch (error) {
        console.log(error)
    }
})

router.get("/", protectedRoutes, async(req,res)=>{
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit

        const books = await Book.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username profilePic")


        const totalBooks = await Book.countDocuments()

        return res.status(200).json({
            books,
            CurrentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })
    } catch (error) {
        console.log(error)
    }
})

router.delete("/:id", protectedRoutes, async(req, res) => {
    try {
        const Book = await Book.findById(req.params.id)

        if(!Book) {
            return res.status(404).json({message: "Book not found"})
        }

        if(Book.user.toString() !== req.user._id) {
            return res.status(401).json({message: "Unauthorized"})
        }

        if(Book.image && Book.image.include("cloudinary")) {
            try {
                const publicId = Book.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId)
            } catch (error) {
                console.log(error)
            }
        }

        await Book.deleteOne()

        return res.status(200).json({message: "Book deleted successfully"})
    } catch (error) {
        console.log(error)
    }
})

router.get("/user", protectedRoutes, async(req, res) => {
try {
    const Books = await Book.find({user: req.user._id}).sort({createdAt: -1})

    return res.status(200).json(Books)
} catch (error) {
    console.log(error)
}
})
export default router