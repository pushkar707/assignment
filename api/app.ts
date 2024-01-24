import express, {Request,Response} from "express"
import mongoose from "mongoose";
import {s3, upload} from "./utils/multer"
import Post from "./models/Post"
import cors from "cors"

mongoose.connect("mongodb://127.0.0.1:27017/ideaUsher")
.then(() => {
    console.log("Connected to mongoose");
}).catch((e:Error) => {
    console.log("Could not connect to the database"); 
})


const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get("/",(req:Request,res:Response) => {
    res.send("API healthy.");
})

app.post("/posts",upload.single("coverImage"),async (req:any,res:Response) => {
    const {title, desc} = req.body
    console.log(title, desc);

    const fileName = req.file.originalname + Date.now()    

    const params = {
        Bucket: 'idea-usher-post-images',
        Key:fileName,
        Body: req.file.buffer,
    };
    
    s3.upload(params)  
    // await Post.create({title,desc,imageKey:fileName}) 
    res.json({success:true})
})

app.get("/posts",async(req:Request,res:Response) => {
    const {filter,sort,pagination} = req.query
    const post = await Post.find({})
})

app.listen(8000,() => {
    console.log("Listening on port 8000");
})