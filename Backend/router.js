import express from "express"
import multer from "multer";
import {allUsers, authUser, registerUser} from "./controller/userController.js"
import { accessChat } from "./controller/chatController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/signup', upload.single('pic'), registerUser)
router.post('/login', authUser)
router.get('/alluser', allUsers)
router.post('/accessChat',accessChat)

export default router;