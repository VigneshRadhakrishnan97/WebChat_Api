const config=require('config');
const mongoose=require('mongoose');
const db = config.get("mongodbDIR");

const connectDB=async ()=>{

    try{
        await mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex: true,useFindAndModify:false});

        console.log("mongoDB connected");
    }catch(error)
    {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports=connectDB;

