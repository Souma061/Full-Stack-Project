import { Avatar, Button, CircularProgress, Grid, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllVideos, useGetUserChannelProfile, useToggleSubscription } from '../hooks/useApi';
import { useCurrentUser } from '../hooks/useAuth';

function UserChannel() {
  const { username } = useParams();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetUserChannelProfile(username);
  const { data: currentUser } = useCurrentUser();
  const toggleSubscription = useToggleSubscription();

  // Use state for tab
  const [tabValue, setTabValue] = useState(0);

  // Fetch videos ONLY if we have a profile ID
  const { data: videosData, isLoading: isVideosLoading } = useGetAllVideos(
    profile?._id ? { userId: profile._id, limit: 50 } : null
  );

  const handleSubscribe = async () => {
    if (profile?._id) {
      await toggleSubscription.mutateAsync(profile._id);
      // Ideally we should invalidate queries, but the hook handles that
    }
  };

  if (isProfileLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (profileError) return <div className="p-10 text-red-500">Channel not found</div>;

  const isOwner = currentUser?._id === profile._id;

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="h-40 md:h-60 w-full bg-gray-800 overflow-hidden">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">No Cover Image</div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Channel Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-gray-700 pb-8">
          <Avatar
            src={profile.avatar}
            alt={profile.username}
            sx={{ width: 120, height: 120 }}
            className="border-4 border-gray-900"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-gray-400">@{profile.username} • {profile.subscribersCount} subscribers • {profile.channelsSubscribedToCount} subscribed</p>
          </div>
          {!isOwner && (
            <Button
              variant={profile.isSubscribed ? "secondary" : "contained"}
              color={profile.isSubscribed ? "inherit" : "primary"}
              onClick={handleSubscribe}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {profile.isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
          {isOwner && (
            <Link to="/my-videos">
              <Button variant="outlined" color="primary">Manage Videos</Button>
            </Link>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} textColor="inherit" indicatorColor="primary" className="mb-6">
          <Tab label="Videos" />
          <Tab label="About" />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <div>
            {isVideosLoading ? <CircularProgress /> : (
              <Grid container spacing={2}>
                {videosData?.length > 0 ? videosData.map((video) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                    <Link to={`/watch/${video._id}`} style={{ textDecoration: 'none' }}>
                      <div className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg cursor-pointer hover:bg-gray-800 transition">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="font-bold text-white truncate">{video.title}</h3>
                          <p className="text-gray-500 text-xs">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  </Grid>
                )) : (
                  <div className="w-full text-center text-gray-500 py-10">This channel has no videos.</div>
                )}
              </Grid>
            )}
          </div>
        )}

        {tabValue === 1 && (
          <div className="text-gray-300">
            <p><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default UserChannel;
