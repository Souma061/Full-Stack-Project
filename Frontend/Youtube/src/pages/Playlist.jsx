// src/pages/Playlist.jsx
import { Delete, PlayArrow } from '@mui/icons-material';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDeletePlaylist, useGetPlaylistById, useRemoveVideoFromPlaylist } from '../hooks/useApi';
import { useCurrentUser } from '../hooks/useAuth';

function Playlist() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { data: playlist, isLoading, error } = useGetPlaylistById(playlistId);
  const { data: currentUser } = useCurrentUser();

  const deletePlaylist = useDeletePlaylist();
  const removeVideo = useRemoveVideoFromPlaylist();

  const isOwner = currentUser?._id === playlist?.owner?._id;

  const handleDeletePlaylist = async () => {
    if (window.confirm("Delete this playlist?")) {
      await deletePlaylist.mutateAsync(playlistId);
      navigate("/");
    }
  }

  const handleRemoveVideo = async (videoId) => {
    await removeVideo.mutateAsync({ videoId, playlistId });
  }

  if (isLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (error) return <div className="p-10 text-red-500">Playlist not found</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-[calc(100vh-80px)]">
      {/* Left Sidebar - Playlist Info */}
      <div className="w-full md:w-80 shrink-0 flex flex-col p-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl h-fit">
        {/* Using first video thumbnail as playlist cover if available */}
        <div className="aspect-video w-full bg-gray-700 rounded-lg mb-4 overflow-hidden relative group">
          {playlist.videos?.[0]?.thumbnail ? (
            <img src={playlist.videos[0].thumbnail} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No videos</div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
            <PlayArrow className="text-white text-5xl" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">{playlist.name}</h1>
        <p className="text-gray-400 text-sm mb-4">by {playlist.owner?.username}</p>

        <div className="flex gap-2 text-xs text-gray-500 mb-6">
          <span>{playlist.videos?.length || 0} videos</span>
          <span>•</span>
          <span>Last updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
        </div>

        <p className="text-gray-300 text-sm mb-6 whitespace-pre-wrap">{playlist.description}</p>

        {isOwner && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeletePlaylist}
          >
            Delete Playlist
          </Button>
        )}
      </div>

      {/* Right Side - Videos List */}
      <div className="flex-1 overflow-y-auto">
        {playlist.videos?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {playlist.videos.map((video, index) => (
              <div key={video._id} className="flex gap-4 p-3 hover:bg-gray-800 rounded-lg group transition">
                <span className="text-gray-500 font-mono w-6 flex items-center justify-center">{index + 1}</span>
                <Link to={`/watch/${video._id}`} className="shrink-0 w-40 aspect-video bg-gray-700 rounded overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/watch/${video._id}`} className="text-white font-bold mb-1 hover:underline line-clamp-1 block">
                    {video.title}
                  </Link>
                  <Link to={`/c/${video.owner?.username}`} className="text-gray-400 text-xs hover:text-white block mb-1">
                    {video.owner?.username}
                  </Link>
                  <div className="flex items-center text-xs text-gray-500">
                    {video.views} views • {video.duration}s
                  </div>
                </div>
                {isOwner && (
                  <IconButton
                    size="small"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 self-center"
                    onClick={() => handleRemoveVideo(video._id)}
                  >
                    <Delete />
                  </IconButton>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            This playlist has no videos yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist;
