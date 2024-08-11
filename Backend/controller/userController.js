
import { User } from "../model/userModel.js";
import { generateToken } from "../config.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from 'cloudinary';
import dotenv from "dotenv";
import bcrypt from 'bcrypt';


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


cloudinary.config({
  cloud_name: 'dqssfu7rl',
  api_key: '555615328341924',
  api_secret: 'S7a4bjYvGPrWb1yK-Ps9Sa5U93I'
});



const registerUser = async (req, res,next) => {
    try {
        let { name, email, password } = req.body;
        const result = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream((error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(req.file.buffer);
        });

        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the Feilds");
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        password = bcrypt.hashSync(password, 8)
        const userData =  new User({
            name,
            email,
            password,
            pic:result.secure_url,
        });
        userData.save();
	   const jwt = generateToken(userData._id);
	    res.status(200).json({
		message: "Registration Successfully",
		token: jwt,
	});
    
       
    } catch (err) {
        console.log(err)
    }
};


const authUser = async (req, res) => {
	let { email, password } = req.body;
	let user = await User.findOne({ email: email });
	if (!user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid Password" });
	}
	const jwt = generateToken(user._id);
	user.password = null;
	res.status(200).json({
		message: "Login Successfully",
		data: user,
		token: jwt,
	});
}
const getAuthUser = async (req, res) => {
	if (!req.user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	res.status(200).json({
		data: req.user,
	});
};

const getAllUsers = async (req, res) => {
	const allUsers = await User.find({ _id: { $ne: req.user._id } })
		.select("-password")
		.sort({ _id: -1 });
	res.status(200).send({ data: allUsers });
};


export { registerUser ,authUser ,getAuthUser,getAllUsers};