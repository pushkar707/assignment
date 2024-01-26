"use client";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import Loading from "./components/Loading";
import PostCard from "./components/PostCard";

// BLOGS PAGE
export default function Home() {
  const [posts, setposts] = useState<any[]>([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setquery] = useState("")
  const [hasMore, setHasMore] = useState(true);

  const [searchType, setSearchType] = useState<'title'|'description'>("title")

  useEffect(() => {
    fetchPosts()
  },[page,query])

  const fetchPosts = async() => {
    setLoading(true)
    const res = await axios.get(process.env.NEXT_PUBLIC_API_DOMAIN + "/posts?perPage=6&pageNo="+JSON.stringify(page)+query)
    
    if(res.data.success){
      if(res.data.posts.length){
        return setposts(prevPosts => {
          const copyPrev = [...prevPosts]
          return [...copyPrev,...res.data.posts]
        })
      }else{
        setHasMore(false)
      }
    }
    setLoading(false)
  }

  const handleScroll = () => {
    const isBottom = window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight;

    if (isBottom && !loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  async function searchPosts(e: ChangeEvent<HTMLInputElement>): Promise<void> {    
    if(e.target.value.length){
      setLoading(true)
      const res = await axios.get(process.env.NEXT_PUBLIC_API_DOMAIN + `/search?type=${searchType}&searchTerm=${e.target.value}`)
      
      if(res.data.success){
        console.log('refdsfcd');
              
        setposts(res.data.posts)
      }
      setLoading(false)
    }else{
      setPage(1)
      setposts([])
      fetchPosts()
    }
  }

  return (
    <div className="p-8">
      <a href="/blog/add" className="underline text-blue-600 absolute top-5 left-5">Add blog post</a>
      <p className="text-center text-3xl">Blog</p>

      <div className="mt-8 px-6 lg:px-16 xl:px-32">
        <div className="mb-5 flex gap-y-4 items-center w-full flex-col-reverse">
          <div className="gap-x-4 flex items-center">
            <p>Sort By: </p>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=oldest");}} className="bg-slate-600 text-white px-3 py-2 text-sm">Oldest</button>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=latest");}} className="bg-slate-600 text-white px-3 py-2 text-sm">Latest</button>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=lengthiest");}} className="bg-slate-600 text-white px-3 py-2 text-sm">Lenghtiest</button>
            <button onClick={() => {setPage(1);setposts([]); setquery("&sort=shortest");}} className="bg-slate-600 text-white px-3 py-2 text-sm">Shortest</button>
          </div>
          <div className="w-full flex justify-center">
            <input onChange={searchPosts} type="text" placeholder={`Search by ${searchType} here`} className="border-b focus:outline-none border-black p-2 w-full  lg:w-[70%]" name="" id="" />
            <button onClick={() => setSearchType(prevState => prevState === "title" ? "description" : "title")} className="bg-slate-600 px-3 py-1 rounded text-white capitalize ms-2">{searchType === "description" ? "title" : "description"}</button>
          </div>
         
        </div>
        <div className="grid grid-cols-3 gap-4 lg:gap-x-6">
        {posts.map(post => {
          return <PostCard key={post._id} {...post} />
        })}
        </div>
      </div>
      {loading  && hasMore &&<div className="flex justify-center scale-75">
        <Loading/>
      </div>}
    </div>
  );
}
