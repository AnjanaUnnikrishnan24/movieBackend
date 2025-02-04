import { Router } from "express";
import authenticate from "../Middleware/authAdmin.js";
import adminCheck from "../Middleware/adminCheck.js";

const adminAuth = Router();
const mDetails = new Map();

adminAuth.post("/addMovie", authenticate, adminCheck, (req, res) => {
    try {
        const { MovieName,NoOfShows,Language,StartDate,ScreenNumber, } = req.body;
        if (mDetails.get(MovieName)) {
            res.status(400).json({ msg: "Movie already exists" });
        }
        else{
            mDetails.set(MovieName, { NoOfShows,Language,StartDate,ScreenNumber });
            console.log(mDetails.get(MovieName));
            res.status(201).json({ msg: `${MovieName} stored successfully` });
        }
    } catch {
        console.error("Error in Adding Movie Details:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

adminAuth.get('/viewMovie',(req,res)=>{
    try {
        const { MovieName } = req.query;
        const viewMovie = mDetails.get(MovieName);

        if(viewMovie){
            const { } = viewMovie;
            mDetails.set(MovieName, {  });
            console.log(mDetails.get(MovieName));    
            res.status(200).json({MovieAdded : mDetails.get(MovieName) });     
        }else{
            res.status(400).json({ msg: "Movie doesn't exists" });
        }
    } catch {
        console.error("Error viewing movie:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
})

export default adminAuth;
