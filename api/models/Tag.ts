import mongoose, {Schema} from "mongoose";

const tagSchema = new Schema({
    tagName:{
        type:String,
        required:true
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }]
})

const Tag = mongoose.model("Tag",tagSchema);
export default Tag;