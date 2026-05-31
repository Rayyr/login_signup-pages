const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const router = express.Router();


//signup process
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({

            email: email,
            password: hashedPassword
        });

        return res.status(201).json({
            msg: "User has been created successfully!",
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ msg: "Signup failed", error: error.message });

    }
});


//login process
router.post("/login",async (req,res)=>{

    try{

        const{email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            res.status(400).json({msg:"Invalid email or password"});
        }

        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(isPasswordCorrect==false){
            res.status(400).json({msg:"Invalid email or password"});
        }

        //valid
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );

        res.status(200).json({msg:"login successfull",token});
    }catch(error){
        res.status(500).json({msg:"Login Failed",error:error.message});
    }
});

module.exports = router;