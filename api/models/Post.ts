import mongoose, {Schema} from "mongoose";

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    imageKey:String,
    tags:[{
        type:Schema.Types.ObjectId,
        ref:"Tag"
    }]
})

const Post = mongoose.model("POST",postSchema);
export default Post;