import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVideoById } from '../api/video.api';
// Using the custom helper from Home.jsx or similar for now to avoid installing date-fns if not present
// But I'll inline a simple one or duplicate the one from Home

const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await getVideoById(videoId);
        // Assuming standard ApiResponse structure: { data: videoObj, ... }
        // Fallback checks just in case
        setVideo(response.data || response);
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] text-white">
        <p>Video not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 text-white min-h-screen">
      {/* Main Content: Player + Info */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-[#272727]">
          <video
            src={video.videoFiles} // Based on schema
            poster={video.thumbnail}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold mt-4 mb-2">{video.title}</h1>

        {/* Channel & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#272727] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
              {video.owner?.avatar ? (
                <img src={video.owner.avatar?.url || video.owner.avatar} alt={video.owner.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-purple-600">
                  {video.owner?.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-base">{video.owner?.fullName || "Unknown Channel"}</h3>
              <p className="text-xs text-gray-400">1.2M subscribers</p>
            </div>
            <button className="ml-4 px-4 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
              <button className="px-4 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] flex items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-xl">thumb_up</span>
                <span className="text-sm font-medium">12K</span>
              </button>
              <button className="px-4 py-2 hover:bg-[#3f3f3f] flex items-center transition-colors">
                <span className="material-symbols-outlined text-xl">thumb_down</span>
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-xl">share</span> Share
            </button>
          </div>
        </div>

        {/* Description Box */}
        <div className="mt-4 bg-[#272727] rounded-xl p-3 text-sm hover:bg-[#3f3f3f] transition-colors cursor-pointer group">
          <div className="flex gap-2 font-bold mb-1">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="whitespace-pre-wrap text-gray-200">
            {video.description}
          </p>
        </div>
      </div>

      {/* Recommended Side (Placeholder) */}
      <div className="w-full lg:w-[350px] shrinking-0 flex flex-col gap-4">
        <h3 className="font-bold text-lg hidden lg:block">Recommended</h3>
        {/* Placeholders for sidebar videos */}
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-2 cursor-pointer group">
            <div className="w-[160px] h-[90px] bg-gray-800 rounded-lg overflow-hidden shrink-0">
              {/* Placeholder image */}
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-400">Sample Recommended Video {i}</div>
              <div className="text-xs text-gray-400">Channel Name</div>
              <div className="text-xs text-gray-400">10K views • 2 days ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetail;
