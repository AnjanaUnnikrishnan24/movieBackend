import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userauth=Router();
const user = new Map();

userauth.post('/signUp',async(req,res)=>{
    try{
        const {UserName,FullName,Email,UserRole,Password} = req.body;
        console.log(FullName);
   
        if(user.get(UserName)){
            res.status(400).send("Username already exist") ;
        }
        else{
            const newPassword =await bcrypt.hash(Password,10);
            console.log(newPassword);
            user.set(UserName,{FullName,Email,UserRole,Password:newPassword});
            res.status(201).send("Signed-up successfully")
        }}
    catch{
        res.status(500).send("Internal Server error");
    } 
});

userauth.post('/login',async(req,res)=>{
    try{
        const {UserName,Password}=req.body;
        const result = user.get(UserName);
        if(!result){
            res.status(400).send("Enter a valid username");
        }
        else{
            console.log(result.Password);
            const valid =await bcrypt.compare(Password,result.Password);
            console.log(valid);
            if(valid){
                const token = jwt.sign({UserName:UserName,UserRole:result.UserRole},process.env.SECRET_KEY,{expiresIn:'4h'});
                console.log(token);
                res.cookie('authToken',token,
                {
                    httpOnly:true
                });
                res.status(200).json({message:"Logged in successfully"});
            }
            else{
                res.status(401).send("Unauthorized access");
            }
         }
    }
    catch{
        res.status(500).send("Internal Server Error")
    }
})



export {userauth};