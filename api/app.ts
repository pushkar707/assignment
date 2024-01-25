import express, {Request,Response} from "express"
import mongoose from "mongoose";
import {s3, upload} from "./utils/multer"
import Post from "./models/Post"
import Tag from "./models/Tag"
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
    const tags = JSON.parse(req.body.tags)
    let fileName = ""

    if(req.file){
        fileName = Date.now() + req.file.originalname 

        const params = {
            Bucket: 'idea-usher-post-images',
            Key:fileName,
            Body: req.file.buffer,
        };
        
        s3.upload(params, (err:Error, data:any) => {
            if (err) {
            console.error(err);
            return res.json({success:false});
            }
        }); 
    }    
    await Post.create({title,desc,imageKey:fileName,tags}) 
    res.json({success:true})
})

app.get("/posts",async(req:Request,res:Response) => {
    const {filter,sort,pagination}:any = req.query
    // filter by tags?filter="lifehacks traveladventures"
    let posts:any
    if(filter && filter.length){
        const filterTagsArray = filter.split(" ")
        const regexTags = filterTagsArray.map((tag:string) => new RegExp(tag, 'i'));    
        posts = await Post.find({tags:{$in:regexTags}})
    }else{
        posts = await Post.find({})
    }
    if(sort === "publishedOn"){
        posts = posts.sort((a:any, b:any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if(sort === "desc"){
        posts = posts.sort((a:any, b:any) => a.desc.length - b.desc.length)
    }
    if(pagination == true){
        const {perPage, pageNo}:any = req.query
        let subPosts:JSON[] = []

        for (let i = 0; i < posts.length; i += (parseInt(perPage))) {
            const chunk = posts.slice(i, i + parseInt(perPage));
            subPosts.push(chunk);
        }
        posts = subPosts[pageNo+1]
    }
     
    return res.json({success:true,posts})

})

app.get("/tags",async(req:Request,res:Response) => {
    const tags = await Tag.find({});
    let tagNames:string[] = []
    tags.forEach(tag => tagNames.push(tag.tagName))

    return res.json({success:true,tags:tagNames})
})

app.listen(8000,() => {
    console.log("Listening on port 8000");
})