const express = require("express");
const nodemailer=require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const authMiddleware=require("../middleware/authMiddleware.js");

const router = express.Router();


router.get("/profile",authMiddleware,async(req,res)=>{
      res.status(200).json({
    msg: "You are authenticated",
    userId: req.user.id,
  });
})


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
        return res.status(500).json({ msg: "Signup failed", error: error.message });

    }
});


//login process
router.post("/login",async (req,res)=>{

    try{

        const{email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({msg:"Invalid email"});
        }

       
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(isPasswordCorrect==false){
            return res.status(400).json({msg:"Invalid password"});
        }

        //valid email & password
        
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"2m"}
        );

       return res.status(200).json({msg:"login successfull",token});
    }catch(error){
        return res.status(500).json({msg:"Login Failed",error:error.message});
    }
});



router.post("/forgetPassword",async (req,res)=>{

    try{

        const {email}=req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"Email is not exist"});
        }

        const resetToken=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"15m"}
        );
       const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

        return res.status(200).json({msg:"Reset Link has been sent to you , check your email"});

    }catch(error){
        return res.status(500).json({msg:"Forget Password Faild",error:error.message});
    }
});


router.post("/reset-password/:token",async(req,res)=>{

    try{

        
        const {password}=req.body;
        const {token}=req.params;

        
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
                
        const user=await User.findById(decoded.id);
        if(!user){
                  return res.status(400).json({ msg: "Invalid reset link" });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        user.password=hashedPassword;
        await user.save();
        return res.status(200).json({msg: "Password has been reset successfully"});

    }catch(error){
        return res.status(500).json({msg:"Reset Password Faild either it is invalid or expired",error:error.message});
    }
});



module.exports = router;