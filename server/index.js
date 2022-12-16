import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";

//configuration (middleware- runs in between different requests (basically functions))

const __fileName = fileURLToPath(import.meta.url); // grab the file url and specifically for when you use the modules 
const __dirname = path.dirname(__fileName); //gets name of type module
dotenv.config(); //invoke dotenv files

const app = express(); //invoke our express app so we can use our middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"})); 
app.use(morgan("common")); 
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,"publis/assets")));

/* File storage configuration*/

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({ storage });  

// Routes with files aka authorization
app.post("/auth/register", upload.single("picture", register)); //register is called a controller which is the logic of the endpoint | upload.single is the middleware we upload our picture locally



/* MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', true); // might need to remove this
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`SERVER ON PORT: ${PORT}`)); 
}).catch((error) => console.log(`Did not connect error: ${error}`));

//make sure to organize data beforehand