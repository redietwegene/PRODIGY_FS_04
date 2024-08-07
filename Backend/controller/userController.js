
import { User } from "../model/userModel.js";
import { generateToken } from "../config.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from 'cloudinary';
import dotenv from "dotenv"

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


cloudinary.config({
  cloud_name: 'dqssfu7rl',
  api_key: '555615328341924',
  api_secret: 'S7a4bjYvGPrWb1yK-Ps9Sa5U93I'
});



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
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

        const user = await User.create({
            name,
            email,
            password,
            pic:result.secure_url,
        });
    
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("User not found");
        }
    } catch (err) {
        console.log(err)
    }
};


const authUser = async (req, res) => {
    const {  email, password } = req.body;

    try {
        const user = await User.findOne({ email:email});

        if (!user) {
            res.status(400).json({ message: "User not found" });
            console.log("User not found");
            return;
        }

       if (user.password !== password) {
            return res.status(401).send("Incorrect password");
        }

        res.status(200).json({ message: "User authenticated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};


export { registerUser ,authUser,allUsers};