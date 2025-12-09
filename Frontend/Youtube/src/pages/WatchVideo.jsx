import React from 'react'
import { useGetVideoById } from '../hooks/useApi'
import { useParams } from 'react-router-dom'
import { CircularProgress,Box } from '@mui/material'


function WatchVideo() {
  const { videoId } = useParams();
  const {data:video, isLoading, error} = useGetVideoById(videoId)
  const currentUser = null; // Replace with actual user data from context or API hook

  if(isLoading) return <CircularProgress />
  if(error) return <div>Error loading video</div>
  if(!video) return <div>Video not found</div>



  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Video Player */}
      <div className="mb-6 bg-black rounded-lg aspect-video">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full"
        />
      </div>

      {/* Video Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-400">{video.views} views</p>
      </div>

      {/* Channel Info */}
      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={video.owner?.avatar}
              alt={video.owner?.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-bold">{video.owner?.username}</p>
              <p className="text-gray-400 text-sm">{video.owner?.subscribersCount} subscribers</p>
            </div>
          </div>
          <button className="bg-red-600 text-white px-6 py-2 rounded">
            Subscribe
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Description</h3>
        <p className="text-gray-300">{video.description}</p>
      </div>
      <div className="mt-8 border-t border-gray-800 pt-6">
        <h2 className="text-2xl font-bold mb-4">Discussion ({video.comments?.length || 0})</h2>
        {/* 1. Add 'Post a Tweet/Comment' Input here */}
        {currentUser && (
          <div className="mb-6 flex gap-4">
            <img src={currentUser?.avatar} className="w-10 h-10 rounded-full" />
            <input
              type="text"
              placeholder="Post a reply..."
              className="w-full bg-transparent border-b border-gray-700 focus:border-blue-500 outline-none pb-2"
            />
          </div>
        )}

        {/* 2. Map through comments/tweets here */}
        <div className="space-y-4">
          {/* You can reuse your TweetCard component here! */}
        </div>
      </div>
    </div>
  )
}

export default WatchVideo;
