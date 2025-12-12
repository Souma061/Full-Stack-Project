import { CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetWatchHistory } from '../hooks/useApi';

function History() {
  const { data, isLoading, error } = useGetWatchHistory();
  const videos = data?.watchHistory || [];

  if (isLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading history: {error.message}</div>;

  if (!videos || videos.length === 0) {
    return (
      <div className="p-10 text-center">
        <Typography variant="h5" className="text-gray-400">No watch history found.</Typography>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Watch History</h1>
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <div key={video._id} className="flex gap-4 bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition">
            <Link to={`/watch/${video._id}`} className="shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-40 h-24 object-cover rounded-md"
              />
            </Link>
            <div className="flex flex-col">
              <Link to={`/watch/${video._id}`} className="no-underline">
                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{video.title}</h3>
              </Link>
              <Link to={`/c/${video.owner?.username}`} className="no-underline">
                <p className="text-gray-400 text-sm hover:text-gray-300">{video.owner?.username}</p>
              </Link>
              <p className="text-gray-500 text-xs mt-1">
                {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2 md:line-clamp-1">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
