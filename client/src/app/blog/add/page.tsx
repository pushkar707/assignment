"use client";
import axios from 'axios';
import React, { FormEvent, useState } from 'react'

const page = () => {
  const [title, setTitle] = useState<string>("")
  const [coverImage, setCoverImage] = useState<null | File>(null)
  const [postContent, setPostContent] = useState("")
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const formData = new FormData();
    if(!coverImage)
      return

    formData.append('coverImage', coverImage);
    formData.append("title",title)
    formData.append("desc",postContent)

    try {
      const response = await axios.post('http://localhost:8000/posts', formData, {
        method:"POST",
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if(response.data.success){
        window.location.href = "/"
      }else{
        console.log("Post addition Failed");
        
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }

  }

  return (
    <div className='h-screen w-screen p-8 flex flex-col'>
        <p className='text-center text-3xl'>Add a Post</p>

        <form onSubmit={handleSubmit} className='mt-5 grow'>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter Post Title'  className='w-full border text-lg border-black p-2' />
          <div className="mt-5">
            <label htmlFor="coverImage" className='ml-0.5 text-lg' >Cover Image</label>
            <input onChange={(e) => setCoverImage(e.target.files && e.target.files[0])} type="file" className='mt-3 border w-full border-black' name="" id="coverImage" accept="image/*" />
          </div>
          <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} className='border border-black mt-5 w-full h-[65%] p-2 overflow-y-scroll' name="" id="" placeholder='Post Content'></textarea>
          <button className='bg-green-600 rounded-lg text-white px-3 py-2 mt-2'>Submit</button>
        </form>
    </div>
  )
}

export default page