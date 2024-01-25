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
    const {filter,sort,pageNo,perPage}:any = req.query
    let posts:any
    
    if(filter && filter.length){
        const filterTagsArray = filter.split(" ")
        const regexTags = filterTagsArray.map((tag:string) => new RegExp(tag, 'i'));    
        posts = await Post.find({tags:{$in:regexTags}})
    }
    if(sort === "oldest"){
        // @ts-ignore
        posts = await Post.find({}).sort({createdAt:"asc"}).skip((pageNo-1)*perPage).limit(perPage)
    }else if(sort === "latest"){
        // @ts-ignore
        posts = await Post.find({}).sort({createdAt:"desc"}).skip((pageNo-1)*perPage).limit(perPage)
    } else if(sort === "lengthiest" || sort === "shortest"){    
        
        posts = await Post.aggregate([
            {
                $project: {
                  desc: 1,
                  title:1,
                  imageKey:1,
                  tags:1,
                  createdAt:1,
                  length: { $strLenCP: '$desc' }
                }
              },
              {
                $sort: { length: sort === "shortest" ? 1 : -1 } // 1 for ascending, -1 for descending
              },
            {
              $skip: (parseInt(pageNo)-1)*parseInt(perPage)
            },
            {
              $limit: parseInt(perPage)
            }
        ])       
        
    }else{
        posts = await Post.find({}).skip((pageNo-1)*perPage).limit(perPage)
    }    
     
    return res.json({success:true,posts:posts?posts:[]})
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