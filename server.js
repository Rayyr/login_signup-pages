const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();


const authRoutes=require("./routes/authRoutes.js");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",appRoutes);


//db connection
mongoose.connect(process.env.MONGO_URI)
.then(app.listen(process.env.PORT,()=>{
          console.log(`Server running on port ${process.env.PORT}`);
}))
.catch((error)=>{
          console.log("cant connect to DB");
});