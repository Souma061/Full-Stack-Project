import { Avatar, Box, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllVideos } from '../hooks/useApi';

// Format time relative (e.g. "2 days ago")
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

// Format duration (e.g. 125 -> 2:05)
const formatDuration = (duration) => {
  if (!duration) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function Home() {
  const [filters] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortType: 'desc',
  })

  // Filter out empty values before sending to API
  const apiParams = {
    page: filters.page,
    limit: filters.limit,
    ...(filters.query && { query: filters.query }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortType && { sortType: filters.sortType }),
  };

  const { data, isLoading, error } = useGetAllVideos(apiParams)

  if (isLoading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
  if (error) return <div className="text-white text-center mt-10">Error loading videos</div>

  return (
    <div className="w-full pb-8">
      {/* Categories */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar px-2">
        {['All', 'Music', 'Gaming', 'Mixes', 'Live', 'News', 'Computer Programming', 'Podcasts', 'Recently Uploaded'].map(cat => (
          <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${cat === 'All' ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#272727] text-white hover:bg-[#3f3f3f] hover:text-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {data?.data?.map((video) => (
          <Link to={`/watch/${video._id}`} key={video._id} className="group flex flex-col gap-3 cursor-pointer">
            {/* Thumbnail Container */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-[#202020] shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                loading="lazy"
              />
              {/* Duration Badge */}
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Video Info */}
            <div className="flex gap-3 items-start px-1">
              {/* Avatar */}
              <Link to={`/c/${video.owner?.username}`} className="shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
                <Avatar
                  src={video.owner?.avatar}
                  alt={video.owner?.username}
                  sx={{ width: 36, height: 36 }}
                />
              </Link>

              {/* Text Details */}
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-white font-bold text-base leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors" title={video.title}>
                  {video.title}
                </h3>
                <div className="text-[#aaaaaa] text-sm mt-1 flex flex-col">
                  <Link to={`/c/${video.owner?.username}`} className="hover:text-white transition-colors truncate" onClick={(e) => e.stopPropagation()}>
                    {video.owner?.username || "Unknown Channel"}
                  </Link>
                  <div className="flex items-center">
                    <span>{video.views} views</span>
                    <span className="mx-1">•</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home;
