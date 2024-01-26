import React from 'react'

const PostCard = ({_id,imageKey,title,tags,createdAt}:any) => {
  return (
    <div>
        <img src={"https://idea-usher-post-images.s3.ap-south-1.amazonaws.com/"+imageKey} className="w-full h-[180px]" />
        <div className="bg-[#0375FF14] p-4">
        <p className="mb-3 font-medium">{title.slice(0,75)}{title.length > 75 ? '....' : ''}</p>
        <p className="mb-2">Tags: {tags.map((tag:string,index:number) => {
            return <span key={index}><a className="underline" href={"/blog/"+tag}>{tag}</a>&nbsp;</span>
        })}</p>
        <p className="font-light text-sm">Published on:  {createdAt.slice(0,10)}</p>
        <a href={"/blog/read/"+_id}>
            <button className="bg-blue-600 text-white px-3 py-2 rounded mt-3">View Post</button>
        </a>
        </div>
    </div>
  )
}

export default PostCard