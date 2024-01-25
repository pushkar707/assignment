"use client";
import PostCard from '@/app/components/PostCard';
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
            return <PostCard key={post._id} {...post} />
            })}
            </div>
        </div>
    </div>
  )
}

export default page