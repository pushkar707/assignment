import mongoose from "mongoose"
import Post from "./models/Post"
import Tag from "./models/Tag"

const title = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, nulla."
const desc = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos dolorem neque maxime omnis obcaecati nostrum perspiciatis impedit quasi ab, sed aliquid eligendi, eaque accusantium asperiores nesciunt voluptatibus, odit accusamus quas odio expedita provident quis tempore veniam fuga! Nisi ratione suscipit voluptatum enim eligendi error ipsum, accusamus aspernatur quibusdam? Nulla saepe ad eveniet officiis sint quaerat praesentium tenetur numquam sed quos, veniam nam assumenda laboriosam consectetur error tempore totam ex quisquam? Amet vel nulla quisquam vitae, deleniti eum placeat delectus quaerat ipsam, modi autem repudiandae ea odio, non eveniet reprehenderit incidunt aliquid? Ab enim obcaecati iure quo libero provident itaque veniam, quas distinctio quisquam quam asperiores laudantium labore magni mollitia excepturi deleniti ea dolorum atque eligendi consequuntur, alias officia hic ducimus? Iusto unde et dolor mollitia! Dolorem totam fuga similique deserunt ratione illo eligendi exercitationem impedit officiis laboriosam dignissimos voluptatem quod quo doloribus sequi consectetur quis beatae, repudiandae quia natus est! Consequuntur pariatur totam, quam corporis praesentium non voluptatem. Voluptatibus dolorem consectetur aspernatur officiis eligendi nostrum totam magni voluptate. Vitae voluptate doloremque, in ad aliquam veniam ex blanditiis cum facilis, maiores fuga, error odio ipsa sapiente porro qui dolores quisquam rerum. Consectetur error nemo distinctio dolorum? Quis, aspernatur. Iste, dolor ratione!"

mongoose.connect("mongodb://127.0.0.1:27017/ideaUsher")
.then(() => {
    console.log("Connected to mongoose");
}).catch((e:Error) => {
    console.log("Could not connect to the database"); 
})

const addPosts = async () => {
    const tags = await Tag.find({})
    const tagNames:string[] = []
    tags.forEach(tag => tagNames.push(tag.tagName))

    for (let i=0; i<40; i++){
        await Post.create({title,desc, tags:[tagNames[i%5],tagNames[(i%5)+1]],imageKey:"17061785986331319298.jpeg"})
    }
    process.exit()
}
addPosts()