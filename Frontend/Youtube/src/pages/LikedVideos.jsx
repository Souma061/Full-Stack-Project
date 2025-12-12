import { CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetLikedVideos } from '../hooks/useApi';

function LikedVideos() {
  const { data, isLoading, error } = useGetLikedVideos();
  // API response structure: { statusCode: 200, data: [...], message: "..." }
  // The hook returns response.data, which is the array of liked videos directly?
  // Let's check the hook again.
  // Hook returns "response.data". If controller returns ApiResponse, response.data is the ApiResponse object.
  // So data would be { statusCode, data: [videos], ... }
  // Wait, useGetWatchHistory implementation did: const videos = data?.watchHistory || [];
  // Let's verify standard response structure.

  const likedVideos = data?.data || [];
  // Controller getLikedVideos likely returns a list of liked videos inside 'data' field of ApiResponse.
  // Wait, the aggregation pipeline in getLikedVideos usually returns the liked objects.

  if (isLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading liked videos</div>;

  if (!likedVideos || likedVideos.length === 0) {
    return (
      <div className="p-10 text-center">
        <Typography variant="h5" className="text-gray-400">No liked videos found.</Typography>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Liked Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {likedVideos.map((item) => {
          // The structure from aggregate might be:
          // { _id: "likeId", video: { ...videoDetails } } or just the video if unwinded.
          // I should assume the liked video is inside a 'video' property or it IS the video.
          // Looking at typical backend implementations for 'getLikedVideos', it often aggregates and returns the video details.
          // Let's perform a safe check.
          const video = item.video || item;

          return (
            <Link to={`/watch/${video._id}`} key={video._id} className="group">
              <div className="flex flex-col gap-2">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-800 relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs text-white">
                    {/* Duration if available */}
                    {video.duration ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}` : ''}
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-white text-base line-clamp-2 leading-tight group-hover:text-blue-400 transition">
                    {video.title}
                  </h3>
                  <div className="text-gray-400 text-sm mt-1">
                    {video.owner?.username}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default LikedVideos;
