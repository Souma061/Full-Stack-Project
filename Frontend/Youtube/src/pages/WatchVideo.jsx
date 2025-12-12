import { BookmarkBorderOutlined, MoreHoriz, ReplyOutlined, ThumbDownOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Alert, Avatar, Box, CircularProgress, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAddComment, useAddVideoToPlaylist, useCreatePlaylist, useGetComments, useGetUserChannelProfile, useGetUserPlaylists, useGetVideoById, useToggleLike, useToggleSubscription } from '../hooks/useApi';
import { useCurrentUser } from '../hooks/useAuth';

// Helper for time ago
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  return `${Math.floor(days / 365)} years ago`;
};

const CommentItem = ({ comment }) => (
  <div className="flex gap-4 mb-6">
    <Link to={`/c/${comment.owner?.username}`}>
      <Avatar
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        sx={{ width: 40, height: 40 }}
      />
    </Link>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-white">@{comment.owner?.username}</span>
        <span className="text-gray-400 text-xs">{formatTimeAgo(comment.createdAt)}</span>
      </div>
      <p className="text-sm text-gray-200">{comment.content}</p>
      <div className="flex items-center gap-4 mt-1">
        <button className="flex items-center gap-1 text-gray-400 hover:text-white">
          <ThumbUpOutlined fontSize="small" sx={{ fontSize: 16 }} />
        </button>
        <button className="flex items-center gap-1 text-gray-400 hover:text-white">
          <ThumbDownOutlined fontSize="small" sx={{ fontSize: 16 }} />
        </button>
        <button className="text-gray-400 hover:text-white text-xs font-medium">Reply</button>
      </div>
    </div>
  </div>
);

const SubscribeButton = ({ isSubscribed, isLoading, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      style={{
        backgroundColor: isSubscribed ? '#272727' : '#ffffff',
        color: isSubscribed ? '#ffffff' : '#000000'
      }}
      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 border-none hover:opacity-90 ml-4`}
    >
      {isLoading ? '...' : (isSubscribed ? 'Subscribed' : 'Subscribe')}
    </button>
  );
};

function WatchVideo() {
  const { videoId } = useParams();
  const { data: video, isLoading, error } = useGetVideoById(videoId);
  const { data: currentUser } = useCurrentUser();

  // We need to fetch channel profile here to get the subscriber count efficiently
  // and pass the subscription state down
  const { data: channelProfile, isLoading: isProfileLoading } = useGetUserChannelProfile(video?.owner?.username);

  const toggleSubscription = useToggleSubscription();
  const addCommentMutation = useAddComment();

  const { data: commentsData, isLoading: isCommentsLoading } = useGetComments(videoId);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [optimisticIsSubscribed, setOptimisticIsSubscribed] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser) {
      setSnackbar({ open: true, message: "Please login to comment", severity: "info" });
      return;
    }

    try {
      await addCommentMutation.mutateAsync({ videoId, content: newComment });
      setNewComment('');
      setSnackbar({ open: true, message: "Comment added", severity: "success" });
    } catch (error) {
      console.error("Error adding comment", error);
      setSnackbar({ open: true, message: "Failed to add comment", severity: "error" });
    }
  };

  useEffect(() => {
    if (channelProfile?.isSubscribed !== undefined) {
      setOptimisticIsSubscribed(channelProfile.isSubscribed);
    }
  }, [channelProfile?.isSubscribed]);

  const handleToggleSubscription = async () => {
    if (!currentUser) {
      setSnackbar({ open: true, message: "Please login to subscribe", severity: "info" });
      return;
    }

    const previousState = optimisticIsSubscribed;
    setOptimisticIsSubscribed(!previousState);

    try {
      await toggleSubscription.mutateAsync(video.owner._id);
      const newMessage = !previousState ? "Subscribed successfully" : "Unsubscribed successfully";
      setSnackbar({ open: true, message: newMessage, severity: "success" });
    } catch (error) {
      console.error("Error toggling subscription", error);
      setOptimisticIsSubscribed(previousState);
      setSnackbar({ open: true, message: "Error toggling subscription", severity: "error" });
    }
  };

  // Like logic
  const toggleLikeMutation = useToggleLike();
  const [optimisticLike, setOptimisticLike] = useState({ isLiked: false, count: 0 });

  useEffect(() => {
    if (video) {
      setOptimisticLike({
        isLiked: video.isLiked || false,
        count: video.likesCount || 0
      })
    }
  }, [video]);

  const handleToggleLike = async () => {
    if (!currentUser) {
      setSnackbar({ open: true, message: "Please login to like", severity: "info" });
      return;
    }

    const wasLiked = optimisticLike.isLiked;
    setOptimisticLike(prev => ({
      isLiked: !prev.isLiked,
      count: prev.isLiked ? prev.count - 1 : prev.count + 1
    }));

    try {
      await toggleLikeMutation.mutateAsync({ videoId });
    } catch (error) {
      console.error("Error toggling like", error);
      setOptimisticLike({ isLiked: wasLiked, count: wasLiked ? optimisticLike.count : optimisticLike.count }); // Revert
      setSnackbar({ open: true, message: "Error toggling like", severity: "error" });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({ open: true, message: "Link copied to clipboard", severity: "success" });
  };

  // Save logic
  const { data: playlists } = useGetUserPlaylists(currentUser?._id);
  const createPlaylistMutation = useCreatePlaylist();
  const addVideoToPlaylistMutation = useAddVideoToPlaylist();

  const handleSave = async () => {
    if (!currentUser) {
      setSnackbar({ open: true, message: "Please login to save", severity: "info" });
      return;
    }

    try {
      const playlistArray = playlists?.playlists || (Array.isArray(playlists) ? playlists : []);
      let watchLater = playlistArray.find(p => p.name === "Watch Later");

      if (!watchLater) {
        // Create "Watch Later" if it doesn't exist
        const response = await createPlaylistMutation.mutateAsync({
          name: "Watch Later",
          description: "Videos saved for later"
        });
        // Handle response structure depending on backend
        watchLater = response.data || response;
      }

      if (watchLater) {
        await addVideoToPlaylistMutation.mutateAsync({
          videoId: video._id,
          playlistId: watchLater._id
        });
        setSnackbar({ open: true, message: "Saved to Watch Later", severity: "success" });
      }
    } catch (error) {
      console.error("Error saving to watch later", error);
      const errorMessage = error.response?.data?.message || "Failed to save video";

      // If the error is that the video is already in the playlist, show it as info/success
      if (errorMessage.toLowerCase().includes("already in playlist")) {
        setSnackbar({ open: true, message: "Video already in Watch Later", severity: "info" });
      } else {
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    }
  };

  // ... existing close snackbar logic ...
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (isLoading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <div className="text-white">Error loading video</div>;
  if (!video) return <div className="text-white">Video not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Video Player */}
      <div className="mb-4 bg-black rounded-xl aspect-video shadow-lg overflow-hidden">
        <video
          src={video.videoFile}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      </div>

      {/* Video Title */}
      <h1 className="text-xl font-bold mb-3">{video.title}</h1>

      {/* Channel & Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">

        {/* Left: Channel Info */}
        <div className="flex items-center gap-3">
          <Link to={`/c/${video.owner?.username}`}>
            <img
              src={video.owner?.avatar}
              alt={video.owner?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <Link to={`/c/${video.owner?.username}`} className="font-semibold text-base leading-tight hover:text-gray-300">
              {video.owner?.fullName || video.owner?.username}
            </Link>
            <span className="text-xs text-gray-400">
              {channelProfile?.subscribersCount || 0} subscribers
            </span>
          </div>

          <SubscribeButton
            isSubscribed={optimisticIsSubscribed}
            isLoading={isProfileLoading}
            onToggle={handleToggleSubscription}
          />
        </div>

        {/* Right: Actions (Like, Share, etc.) */}
        <div className="flex items-center gap-2">
          {/* Like/Dislike Pill */}
          <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
            <button
              onClick={handleToggleLike}
              className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] transition-colors"
            >
              <ThumbUpOutlined fontSize="small" sx={{ color: optimisticLike.isLiked ? 'white' : 'inherit' }} />
              <span className="text-sm font-medium">{optimisticLike.count}</span>
            </button>
            <button className="px-4 py-2 hover:bg-[#3f3f3f] transition-colors">
              <ThumbDownOutlined fontSize="small" />
            </button>
          </div>

          {/* Share Pill */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors"
          >
            <ReplyOutlined fontSize="small" className="transform scale-x-[-1]" />
            <span className="text-sm font-medium">Share</span>
          </button>

          {/* Save Pill */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors hidden sm:flex"
          >
            <BookmarkBorderOutlined fontSize="small" />
            <span className="text-sm font-medium">Save</span>
          </button>

          <button className="p-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors">
            <MoreHoriz />
          </button>
        </div>
      </div>

      {/* Description Box */}
      <div className="bg-[#272727] p-3 rounded-xl cursor-pointer hover:bg-[#3f3f3f] transition-colors">
        <div className="flex gap-2 text-sm font-bold mb-1">
          <span>{video.views} views</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-200 whitespace-pre-wrap">
          {video.description}
        </p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-6">{commentsData?.pagination?.totalDocs || 0} Comments</h2>

        {/* Add Comment Input */}
        <div className="flex gap-4 mb-8">
          {currentUser ? (
            <Avatar src={currentUser.avatar} alt={currentUser.username} sx={{ width: 40, height: 40 }} />
          ) : (
            <Avatar sx={{ width: 40, height: 40 }} />
          )}
          <form onSubmit={handleAddComment} className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none pb-1 text-sm text-white mb-2 transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewComment('')}
                className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#272727] text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim() || addCommentMutation.isPending}
                className={`px-4 py-2 rounded-full text-sm font-semibold text-black transition-colors ${newComment.trim() ? 'bg-[#3ea6ff] hover:bg-[#65b8ff]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {addCommentMutation.isPending ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {isCommentsLoading ? (
            <div className="flex justify-center py-10"><CircularProgress size={30} /></div>
          ) : commentsData?.comments?.length > 0 ? (
            commentsData.comments.map(comment => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No comments yet. Be the first to start the discussion!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WatchVideo;
