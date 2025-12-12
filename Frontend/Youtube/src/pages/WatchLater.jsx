import { PlayArrow } from '@mui/icons-material';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreatePlaylist, useGetPlaylistById, useGetUserPlaylists } from '../hooks/useApi';
import { useCurrentUser } from '../hooks/useAuth';

function WatchLater() {
  const { data: currentUser } = useCurrentUser();
  const { data: playlistsData, isLoading: isPlaylistsLoading } = useGetUserPlaylists(currentUser?._id);
  const createPlaylist = useCreatePlaylist();


  const [watchLaterId, setWatchLaterId] = useState(null);

  // Fetch full details of the Watch Later playlist (to get populated videos)
  const { data: watchLaterData, isLoading: isWatchLaterLoading } = useGetPlaylistById(watchLaterId);

  useEffect(() => {


    const playlists = playlistsData?.playlists || [];

    if (playlists.length > 0) {
      const found = playlists.find(p => p.name === "Watch Later");
      if (found) {
        setWatchLaterId(found._id);
      }
    }
  }, [playlistsData]);

  const handleCreateWatchLater = async () => {
    try {
      await createPlaylist.mutateAsync({
        name: "Watch Later",
        description: "Videos saved for later"
      });
      // The invalidation will refetch playlists, which triggers useEffect, which sets ID.
    } catch (err) {
      console.error("Failed to create Watch Later playlist", err);
    }
  };

  if (isPlaylistsLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;

  // We check if we found the ID. If not found (and not loading), show Create button.
  if (!watchLaterId) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <Typography variant="h5" className="text-white mb-4">You don't have a "Watch Later" playlist yet.</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateWatchLater}
          disabled={createPlaylist.isPending}
        >
          {createPlaylist.isPending ? "Creating..." : "Create 'Watch Later' Playlist"}
        </Button>
      </div>
    );
  }

  // If loading the specific playlist details
  if (isWatchLaterLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;

  // watchLaterData structure from getPlaylistById controller:
  // { playlist: {...}, videos: [...], pagination: {...} }
  const videos = watchLaterData?.videos || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Watch Later</h1>
        {videos.length > 0 && (
          <Link to={`/watch/${videos[0]._id}`}>
            <Button variant="contained" startIcon={<PlayArrow />} sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#e5e5e5' } }}>
              Play All
            </Button>
          </Link>
        )}
      </div>

      {videos.length === 0 ? (
        <div className="text-gray-400">No videos in your Watch Later list.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {videos.map((video) => (
            <div key={video._id} className="flex gap-4 bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition group">
              <Link to={`/watch/${video._id}`} className="shrink-0 relative aspect-video w-40 h-24">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </Link>
              <div className="flex flex-col">
                <Link to={`/watch/${video._id}`} className="no-underline">
                  <h3 className="font-bold text-lg text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition">{video.title}</h3>
                </Link>
                <Link to={`/c/${video.owner?.username}`} className="no-underline">
                  <p className="text-gray-400 text-sm hover:text-gray-300">{video.owner?.username}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchLater;
