import express, {Request,Response, response} from "express"
import mongoose from "mongoose";
import {s3, upload} from "./utils/multer"
import Post from "./models/Post"
import Tag from "./models/Tag"
import cors from "cors"
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_URI || "")
.then(() => {
    console.log("Connected to mongoose");
}).catch((e:Error) => {
    console.log("Could not connect to the database"); 
})


const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL
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
            Bucket: process.env.AWS_BUCKET_NAME || "",
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
    const post = await Post.create({title,desc,imageKey:fileName,tags})
    tags.forEach(async(tag:any) => {
        await Tag.findOneAndUpdate({tagName:tag},{$push:{posts:post._id}})
    })
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
        posts = await Post.find({}).sort({createdAt:"asc"}).skip((pageNo-1)*perPage).limit(perPage).select('title createdAt imageKey tags')
    }else if(sort === "latest"){
        // @ts-ignore
        posts = await Post.find({}).sort({createdAt:"desc"}).skip((pageNo-1)*perPage).limit(perPage).select('title createdAt imageKey tags')
    } else if(sort === "lengthiest" || sort === "shortest"){    
        
        posts = await Post.aggregate([
            {
                $project: {
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
        posts = await Post.find({}).skip((pageNo-1)*perPage).limit(perPage).select('title createdAt imageKey tags')
    }    
     
    return res.json({success:true,posts:posts?posts:[]})
})

app.get("/posts/post/:postId",async(req:Request,res:Response) => {
    const {postId} = req.params
    const post = await Post.findById(postId)
    
    return res.json({success:true,post})
})

app.get("/posts/:tag",async(req:Request,res:Response) => {
    const {tag} = req.params
    const tagDoc = await Tag.findOne({tagName:tag}).populate({
        path:"posts",
        select:"title createdAt imageKey tags"
    })
    
    return res.json({success:true,posts:tagDoc?.posts})
})


// Return all the available tags
app.get("/tags",async(req:Request,res:Response) => {
    const tags = await Tag.find({});
    let tagNames:string[] = []
    tags.forEach(tag => tagNames.push(tag.tagName))

    return res.json({success:true,tags:tagNames})
})

app.get("/search",async(req:Request,res:Response) => {
    const {type,searchTerm} = req.query

    const searchQuery = {}
    try{
        if(searchTerm && searchTerm.length && typeof(searchTerm) == "string"){
            const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // @ts-ignore
            searchQuery[type == "description" ? "desc" : type] = { $regex: escapedSearchTerm, $options: "i" };
            const posts = await Post.find(searchQuery)
            return res.json({success:true,posts});
        }return res.json({success:false,message:"Searchterm empty"})
    }catch(e){
        console.log("Error occured in search");        
        console.log(e); 
        return res.status(500).json({success:false,error:true,errorObj:e})
    }
})

app.listen(8000,() => {
    console.log("Listening on port 8000");
})