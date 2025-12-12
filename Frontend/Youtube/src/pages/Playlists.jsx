import { Add, PlaylistPlay } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreatePlaylist, useGetUserPlaylists } from '../hooks/useApi';
import { useCurrentUser } from '../hooks/useAuth';

function Playlists() {
  const { data: currentUser } = useCurrentUser();
  const { data: playlists, isLoading, error } = useGetUserPlaylists(currentUser?._id);
  const createPlaylist = useCreatePlaylist();

  const [open, setOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const handleCreate = async () => {
    if (!newPlaylistName) return;
    await createPlaylist.mutateAsync({ name: newPlaylistName, description: newPlaylistDesc });
    setOpen(false);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
  }

  if (isLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading playlists</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
        >
          New Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists?.map((playlist) => (
          <Link to={`/playlists/${playlist._id}`} key={playlist._id} className="group">
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition border border-gray-800 h-full flex flex-col">
              <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                {playlist.videos?.[0]?.thumbnail ? (
                  <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="w-full h-full object-cover" />
                ) : (
                  <PlaylistPlay className="text-gray-600 text-6xl" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-xs flex justify-between items-center">
                  <PlaylistPlay />
                  <span>{playlist.videos?.length || 0} videos</span>
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-red-500 transition line-clamp-1">{playlist.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
              </div>
            </div>
          </Link>
        ))}
        {playlists?.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            You haven't created any playlists yet.
          </div>
        )}
      </div>

      {/* Create Playlist Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newPlaylistDesc}
            onChange={(e) => setNewPlaylistDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={createPlaylist.isLoading}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Playlists;
