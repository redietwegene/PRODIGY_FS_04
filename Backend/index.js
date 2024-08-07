import express, { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import router from './router.js'


const app = express();
app.use(express.json());
app.use(cors())
dotenv.config();
const PORT = process.env.PORT || 5000;
const mongourl = process.env.DB_URL;
 

mongoose
.connect(mongourl)
.then(()=>{
    console.log("Database is connected sucessfully");
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    });
})
    .catch((err) => console.log(err))

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials:true
}));

app.use('/',router)