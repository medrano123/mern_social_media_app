import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER a new USER */

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        
        const salt = await bcrypt.genSalt(); //encryption for our password
        const passwordHash = await bcrypt.hash(password, salt); //create salt pass it in and its encrypted
        
        const newUser = new User({
            firstName,
            lastName,
            email, 
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 100 ),
            impressions: Math.floor(Math.random() * 100 )
        });
        const savedUser = await newUser.save(); 
        res.status(201).json(savedUser); //returns 201 code if the save was successful creates a json of the saveduser so frontend can access it 
    } catch (err) {
        res.status(500).json({error: err.messege});
    }
}