"use client";
import axios from 'axios';
import React, { FormEvent, useState, useEffect, MouseEvent } from 'react'

const Page = () => {
  const [title, setTitle] = useState<string>("")
  const [coverImage, setCoverImage] = useState<null | File>(null)
  const [postContent, setPostContent] = useState("")
  const [tags, setTags] = useState([""])
  const [selectedTags, setselectedTags] = useState<string[]>([])

  useEffect(() => {
    const setTagsFunc = async() => {
      const res = await axios.get(process.env.NEXT_PUBLIC_API_DOMAIN + "/tags")
      if(res.data.success){
        setTags(res.data.tags)
      }
    }

    setTagsFunc()

  },[])

  function addTag(e:any): void {
    if(e.currentTarget.classList.contains("bg-gray-600")){
      setselectedTags(prevState => [...prevState,e.target.textContent || ""])
      e.currentTarget.classList.remove("bg-gray-600")
      e.currentTarget.classList.add("bg-green-600")
    }else{
      setselectedTags(prevState => {
        const previousState = prevState
        return previousState.filter(tag => tag !== e.target.textContent)
      })
      e.currentTarget.classList.add("bg-gray-600")
      e.currentTarget.classList.remove("bg-green-600")
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const formData = new FormData();
    if(coverImage)
      formData.append('coverImage', coverImage);

    formData.append("title",title)
    formData.append("desc",postContent)
    formData.append("tags",JSON.stringify(selectedTags))

    try {
      const response = await axios.post( process.env.NEXT_PUBLIC_API_DOMAIN +'/posts', formData, {
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
    <div className='min-h-screen w-screen p-8 flex flex-col'>
        <p className='text-center text-3xl'>Add a Post</p>

        <form onSubmit={handleSubmit} className='mt-5 grow flex flex-col'>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter Post Title'  className='w-full border text-lg border-black p-2' />
          <div className="mt-5">
            <label htmlFor="coverImage" className='ml-0.5 text-lg' >Cover Image</label>
            <input onChange={(e) => setCoverImage(e.target.files && e.target.files[0])} type="file" className='mt-3 border w-full border-black' name="" id="coverImage" accept="image/*" />
          </div>
          <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} className='border border-black mt-5 w-full h-[60%] grow p-2 overflow-y-scroll' name="" id="" placeholder='Post Content'></textarea>
          <div className='mt-3'>
            <p className='inline'>Select Tags: </p>
            <div className='inline'>
              {tags.map((tag,index) => {
                return <button type='button' onClick={addTag} key={index} className='border px-2 py-1 bg-gray-600 text-white rounded-md mx-1 my-1 md:my-auto md:mx-2' >{tag}</button>
              })}
            </div>
          </div>
          <button className='w-fit bg-green-600 rounded-lg text-white px-3 py-2 mt-4'>Submit</button>
        </form>
    </div>
  )
}

export default Page