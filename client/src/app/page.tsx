"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";

// BLOGS PAGE
export default function Home() {
  const [posts, setposts] = useState<any[]>([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setquery] = useState("")
  const [reverse, setreverse] = useState(false)

  useEffect(() => {
    fetchPosts()
  },[page,reverse,query])

  const fetchPosts = async() => {
    setLoading(true)
    const res = await axios.get(process.env.NEXT_PUBLIC_API_DOMAIN + "/posts?pagination=true&perPage=6&pageNo="+JSON.stringify(page)+query)
    
    if(res.data.success){
      return setposts(prevPosts => {
        const copyPrev = [...prevPosts]
        return [...copyPrev,...res.data.posts]
      })
    }
    setLoading(false)
  }

  const handleScroll = () => {
    const isBottom = window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight;

    if (isBottom && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  return (
    <div className="p-8">
      <p className="text-center text-3xl">Blog</p>

      <div className="mt-8 px-6 lg:px-16 xl:px-32">
        <div className="mb-5 flex gap-y-4 items-center w-full flex-col-reverse">
          <div className="gap-x-4 flex items-center">
            <p>Sort By: </p>
            {/* <button onClick={() => fetchPosts("&sort=publishedOn",false)} className="bg-slate-600 text-white px-3 py-2 text-sm">Oldest</button>
            <button onClick={() => fetchPosts("&sort=publishedOn",true)} className="bg-slate-600 text-white px-3 py-2 text-sm">Latest</button>
            <button onClick={() => fetchPosts("&sort=length",false)} className="bg-slate-600 text-white px-3 py-2 text-sm">Lenghtiest</button>
            <button onClick={() => fetchPosts("&sort=length",true)} className="bg-slate-600 text-white px-3 py-2 text-sm">Shortest</button> */}

            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=oldest");setreverse(false)}} className="bg-slate-600 text-white px-3 py-2 text-sm">Oldest</button>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=latest");setreverse(true)}} className="bg-slate-600 text-white px-3 py-2 text-sm">Latest</button>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=lengthiest");setreverse(false)}} className="bg-slate-600 text-white px-3 py-2 text-sm">Lenghtiest</button>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=shortest");setreverse(true)}} className="bg-slate-600 text-white px-3 py-2 text-sm">Shortest</button>
          </div>
          <input type="text" placeholder="Search by title here" className="border-b focus:outline-none border-black p-2 w-full  lg:w-[70%]" name="" id="" />

        </div>
        <div className="grid grid-cols-3 gap-4 lg:gap-x-6">
        {posts.map(post => {
          return <div key={post._id} className="cursor-pointer">
            <img src={"https://idea-usher-post-images.s3.ap-south-1.amazonaws.com/"+post.imageKey} className="w-full h-[180px]" />
            <div className="bg-[#0375FF14] p-4">
              <p className="mb-3 font-medium">{post.title.slice(0,75)}{post.title.length > 75 ? '....' : ''}</p>
              <p className="mb-2">{post.tags.join(" ")}</p>
              <p className="font-light text-sm">Published on:  {post.createdAt.slice(0,10)}</p>
              <a href="#">
                <button className="bg-blue-600 text-white px-3 py-2 rounded mt-3">View Post</button>
              </a>
            </div>
          </div>
        })}
        </div>
      </div>
      {loading &&<div className="flex justify-center scale-75">
        <Loading/>
      </div>}
    </div>
  );
}
