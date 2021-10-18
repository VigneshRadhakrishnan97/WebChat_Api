const express = require("express");
const connectDB=require("./config/db");
const socket=require("./socket");
const path=require("path");

const App=express();

//DB connect
connectDB();

//Init middleware for body
App.use(express.json({extended:false}));


const PORT= process.env.PORT || 5000;

App.listen(PORT,()=>{
    console.log(`Server started in PORT ${PORT}`);
});

App.get("/",(req,res)=>{res.send("API running")});

App.use("/api/user",require("./routes/api/user"));
App.use("/api/auth", require("./routes/api/auth"));
App.use("/api/verifyemail", require("./routes/api/verifyemail"));
App.use("/api/createchat", require("./routes/api/createchat"));

socket();

//Server static asset in production
if(process.env.NODE_ENV==='production'){
    //set static folder
    App.use(express.static("../webchat/build"));

    App.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, "../webchat/build/index.html"));
    })
}
