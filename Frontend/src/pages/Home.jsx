import { useEffect, useState } from 'react';
import { getAllVideos } from '../api/video.api';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Fetch videos (page 1, limit 12, etc.)
        const response = await getAllVideos(1, 12);
        // Adjust depending on your API response structure.
        // If your API returns { data: { docs: [...] } }, use response.data.docs
        // If your API returns { data: [...] }, use response.data
        // Based on typical express-paginate or aggregation:
        setVideos(response.data?.docs || response.data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Helper function to format duration (seconds -> MM:SS)
  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  // Helper for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className='bg-[#0f0f0f] text-white p-4 min-h-full'>
      {/* Categories */}
      <div className='sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm z-10 w-full mb-4 py-2 border-b border-[#272727] flex gap-3 overflow-x-auto scrollbar-hide'>
        {['All', 'Gaming', 'Music', 'Live', 'Mixes', 'Programming', 'Podcasts', 'News', 'Tech', 'Recent'].map((category, index) => (
          <button
            key={index}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
               ${index === 0 ? 'bg-white text-black' : 'bg-[#272727] hover:bg-[#3f3f3f] text-white'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='flex flex-col gap-2'>
              <div className='w-full aspect-video bg-[#272727] rounded-xl animate-pulse'></div>
              <div className='flex gap-3 mt-1'>
                <div className='w-9 h-9 bg-[#272727] rounded-full animate-pulse'></div>
                <div className='flex flex-col flex-1 gap-1'>
                  <div className='h-4 bg-[#272727] rounded w-3/4 animate-pulse'></div>
                  <div className='h-3 bg-[#272727] rounded w-1/2 animate-pulse'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-[60vh] text-gray-400'>
          <div className='text-6xl mb-4'>📹</div>
          <p className='text-lg'>No videos found</p>
          <p className='text-sm mt-2'>Upload a video to get started!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4'>
          {videos.map((video) => (
            <div key={video._id} className='flex flex-col gap-2 cursor-pointer group'>
              <div className='relative w-full aspect-video rounded-xl overflow-hidden bg-[#1f1f1f]'>
                <img src={video.thumbnail?.url || video.thumbnail || "https://via.placeholder.com/320x180"} alt={video.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200' />
                <span className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded'>
                  {formatDuration(video.duration)}
                </span>
              </div>

              <div className='flex gap-3 mt-1'>
                <img src={video.owner?.avatar?.url || video.owner?.avatar || "https://via.placeholder.com/150"} alt="Avatar" className='w-9 h-9 rounded-full object-cover bg-gray-700' />
                <div className='flex flex-col'>
                  <h3 className='text-base font-semibold line-clamp-2 leading-tight group-hover:text-blue-400 decoration-transparent transition-colors'>
                    {video.title}
                  </h3>
                  <p className='text-sm text-[#aaaaaa] mt-1 hover:text-white transition-colors'>{video.owner?.fullName || "Unknown Channel"}</p>
                  <p className='text-sm text-[#aaaaaa]'>
                    {video.views} views • {formatDate(video.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
