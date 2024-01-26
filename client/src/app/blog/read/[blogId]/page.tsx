"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const page = ({params}:any) => {
    const {blogId} = params
    const [blogDetails, setblogDetails] = useState<any>({})
    const fetchBlogDetails = async () => {
      const res = await axios.get(process.env.NEXT_PUBLIC_API_DOMAIN + "/posts/post/"+blogId)
      console.log("Post: ");
      console.log(res.data.post);
      
      
      if(res.data.success){
        setblogDetails(res.data.post)
      }

    }

    useEffect(() => {
      fetchBlogDetails()
    },[])
  if(blogDetails.title){
    return (
      <>
        <div className='bg-[#1188F0] py-16 w-full flex justify-center items-center flex-col text-white mt-5 px-5' >
          <p className='text-3xl mb-3 font-medium'>{blogDetails.title}</p>
          <p className='text-lg mb-2 font-light'>{blogDetails.tags.join(" ")}</p>
          <p className='font-light'>Published On: {blogDetails.createdAt.slice(0,10)}</p>
        </div>


        <div className='p-10'>
          <img src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/`+blogDetails.imageKey} className='block mb-8 mx-auto w-[70&] h-[400px]' />
          <pre className='whitespace-pre-line'>{blogDetails.desc}</pre>
        </div>
      
      </>
    )
  }
}

export default page