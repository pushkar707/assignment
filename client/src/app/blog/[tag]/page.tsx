"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = ({params}:{params:any}) => {
    const {tag} = params;
    const [posts, setposts] = useState<any[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get(process.env.NEXT_PUBLIC_API_DOMAIN + "/posts/"+tag)
            if(res.data.success){
                setposts(res.data.posts)
            }
        }
        fetchPosts()
    },[])
  return (
    <div className='p-8'>
        <p className="text-center text-3xl">{tag}</p>

        <div className='mt-8 px-6 lg:px-16 xl:px-32'>
            <div className="grid grid-cols-3 gap-4 lg:gap-x-6">
            {posts.map(post => {
            return <div key={post._id}>
                <img src={"https://idea-usher-post-images.s3.ap-south-1.amazonaws.com/"+post.imageKey} className="w-full h-[180px]" />
                <div className="bg-[#0375FF14] p-4">
                <p className="mb-3 font-medium">{post.title.slice(0,75)}{post.title.length > 75 ? '....' : ''}</p>
                <p className="mb-2">Tags: {post.tags.map((tag:string,index:number) => {
                    return <span key={index}><a className="underline" href={"/blog/"+tag}>{tag}</a>&nbsp;</span>
                })}</p>
                <p className="font-light text-sm">Published on:  {post.createdAt.slice(0,10)}</p>
                <a href="#">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded mt-3">View Post</button>
                </a>
                </div>
            </div>
            })}
            </div>
        </div>
    </div>
  )
}

export default page