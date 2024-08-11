import express from "express"
import multer from "multer";
import { authUser, getAllUsers, getAuthUser, registerUser } from "./controller/userController.js"
import wrapAsync from "./middlewares/wrapAsync.js";
import { authorization } from "./middlewares/authmiddleware.js";
import { allMessage, clearChat, createMessage } from "./controller/messagecontroller.js";
import { addToGroup, createGroup, deleteGroup, getChat, postChat, removeFromGroup, renameGroup } from "./controller/chatController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/signup', upload.single('pic'), registerUser)
router.post('/login', authUser)


router.get("/profile", authorization, wrapAsync(getAuthUser));
router.get("/users", authorization, wrapAsync(getAllUsers));



router.post("/", authorization, wrapAsync(createMessage));
router.get("/:chatId", authorization, wrapAsync(allMessage));
router.get(
	"/clearChat/:chatId",
	authorization,
	wrapAsync(clearChat)
);




router.post("/", authorization, wrapAsync(postChat));
router.get("/", authorization, wrapAsync(getChat));

router.post("/group", authorization, wrapAsync(createGroup));
router.delete(
	"/deleteGroup/:chatId",
	authorization,
	wrapAsync(deleteGroup)
);
router.post("/rename", authorization, wrapAsync(renameGroup
));
router.post(
	"/groupremove",
	authorization,
	wrapAsync(removeFromGroup)
);
router.post("/groupadd", authorization, wrapAsync(addToGroup));



export default router;