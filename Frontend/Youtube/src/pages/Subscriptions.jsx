import { Avatar, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetSubscribedChannels, useToggleSubscription } from '../hooks/useApi';
import { useCurrentUser } from '../hooks/useAuth';

function Subscriptions() {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, error, refetch } = useGetSubscribedChannels(currentUser?._id);
  const channels = data?.channels || [];
  const toggleSubscription = useToggleSubscription();
  const [unsubscribingId, setUnsubscribingId] = useState(null);
  const [toggleError, setToggleError] = useState('');

  const handleUnsubscribe = async (channelId) => {
    setUnsubscribingId(channelId);
    setToggleError('');
    try {
      await toggleSubscription.mutateAsync(channelId);
      // Invalidation is handled in useApi.js, but we can verify it works
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
      setToggleError('Failed to unsubscribe. Please try again.');
    } finally {
      setUnsubscribingId(null);
    }
  }

  if (isLoading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (error) return <div className="p-10 text-red-500">Error loading subscriptions</div>;

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Subscriptions</h1>

      {toggleError && (
        <div className='mb-4 bg-red-900/50 text-red-200 p-3 rounded'>
          {toggleError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {channels?.map((channel) => (
          <div key={channel._id} className="flex items-center justify-between bg-[#1e1e1e] p-4 rounded-xl hover:bg-[#2d2d2d] transition-colors group">
            <Link to={`/c/${channel.username}`} className="flex items-center gap-4 text-decoration-none flex-1">
              <Avatar
                src={channel.avatar}
                alt={channel.username}
                sx={{ width: 60, height: 60 }}
                className="border border-[#333]"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors">{channel.fullName}</h3>
                <p className="text-gray-400 text-sm">@{channel.username}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {/* Placeholder for subscriber count if available in future */}
                </div>
              </div>
            </Link>

            <button
              onClick={() => handleUnsubscribe(channel._id)}
              disabled={unsubscribingId === channel._id}
              className={`
                px-4 py-2 rounded-full font-medium text-sm transition-all
                ${unsubscribingId === channel._id
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed is-loading'
                  : 'bg-[#272727] text-gray-200 hover:bg-[#3f3f3f] hover:text-white border border-[#3f3f3f]'}
              `}
            >
              {unsubscribingId === channel._id ? 'Unsubscribing...' : 'Subscribed'}
            </button>
          </div>
        ))}

        {channels?.length === 0 && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <div className="text-lg mb-2">No subscriptions yet?</div>
            <div className="text-sm">Explore trending videos to find something you like!</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscriptions;
