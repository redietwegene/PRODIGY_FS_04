import express from "express"
import multer from "multer";
import {registerUser} from "./controller/userController.js"

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/signup',upload.single('pic'), registerUser)

export default router;