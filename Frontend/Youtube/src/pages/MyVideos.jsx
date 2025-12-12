import { Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import { Card, CircularProgress, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDeleteVideo, useGetChannelStats, useGetChannelVideos, useTogglePublishStatus } from '../hooks/useApi';

function MyVideos() {
  const { data: stats, isLoading: statsLoading } = useGetChannelStats();
  const { data: videos, isLoading: videosLoading } = useGetChannelVideos();

  const deleteVideo = useDeleteVideo();
  const togglePublish = useTogglePublishStatus();

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      await deleteVideo.mutateAsync(videoId);
    }
  };

  const handleTogglePublish = async (videoId) => {
    await togglePublish.mutateAsync(videoId);
  }

  if (statsLoading || videosLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Channel Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Views", value: stats?.totalViews || 0 },
          { label: "Subscribers", value: stats?.totalSubscribers || 0 },
          { label: "Total Videos", value: stats?.totalVideos || 0 },
          { label: "Total Likes", value: stats?.totalLikes || 0 },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6 bg-gray-900 text-white border border-gray-800">
            <Typography variant="h4" className="font-bold mb-2">{stat.value}</Typography>
            <Typography variant="body2" className="text-gray-400 uppercase tracking-wider">{stat.label}</Typography>
          </Card>
        ))}
      </div>

      {/* Videos List */}
      <h2 className="text-2xl font-bold mb-4 text-white">Content</h2>
      <TableContainer component={Paper} className="bg-gray-900 border border-gray-800">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="text-gray-400">Video</TableCell>
              <TableCell align="center" className="text-gray-400">Visibility</TableCell>
              <TableCell align="right" className="text-gray-400">Date</TableCell>
              <TableCell align="right" className="text-gray-400">Views</TableCell>
              <TableCell align="right" className="text-gray-400">Comments</TableCell>
              <TableCell align="right" className="text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos?.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className="hover:bg-gray-800 transition"
              >
                <TableCell component="th" scope="row">
                  <div className="flex gap-4 items-center">
                    <img src={row.thumbnail} alt={row.title} className="w-24 h-14 object-cover rounded" />
                    <div>
                      <Link to={`/watch/${row._id}`} className="font-bold text-white hover:underline line-clamp-1">
                        {row.title}
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-1">{row.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div className="flex flex-col items-center">
                    {row.isPublished ? (
                      <div className="flex items-center text-green-500 text-xs"><Visibility className="mr-1 text-xs" /> Public</div>
                    ) : (
                      <div className="flex items-center text-gray-500 text-xs"><VisibilityOff className="mr-1 text-xs" /> Private</div>
                    )}
                    <Switch
                      checked={row.isPublished}
                      onChange={() => handleTogglePublish(row._id)}
                      size="small"
                    />
                  </div>
                </TableCell>
                <TableCell align="right" className="text-gray-300">
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right" className="text-gray-300">{row.views}</TableCell>
                <TableCell align="right" className="text-gray-300">{0}</TableCell> {/* Backend videos list might not include comments count directly, showing 0 for now */}
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(row._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    {/* Edit functionality would go here */}
                    <Tooltip title="Edit (Coming Soon)">
                      <IconButton className="text-gray-400">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {videos?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" className="py-8 text-gray-500">
                  No videos found. Upload your first video!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MyVideos;
