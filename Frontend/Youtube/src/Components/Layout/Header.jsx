import { AccountCircle, Menu, Notifications, Search, VideoCall } from '@mui/icons-material';
import { AppBar, Avatar, Badge, Button, IconButton, InputBase, Toolbar, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useLogout } from '../../hooks/useAuth';

function Header({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#0f0f0f',
        boxShadow: 'none',
        borderBottom: '1px solid #3f3f3f' // Subtle border
      }}
    >
      <Toolbar className="justify-between min-h-[56px]">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4">
          <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
            <Menu />
          </IconButton>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-red-600 text-white rounded-lg p-1">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[10px] border-l-white border-b-[5px] border-b-transparent ml-[2px]"></div>
            </div>
            <span className="text-white text-xl font-bold tracking-tighter font-sans">YouTube</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-1 ml-10 focus-within:border-[#1c62b9] group">
              <div className="hidden group-focus-within:block mr-2 text-white">
                <Search fontSize="small" />
              </div>
              <InputBase
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-white"
                sx={{ color: 'white', ml: 1, flex: 1 }}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '0 24px 24px 0',
                backgroundColor: '#222222',
                border: '1px solid #303030',
                borderLeft: 'none',
                color: 'gray',
                minWidth: '64px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#303030',
                  boxShadow: 'none',
                }
              }}
            >
              <Search />
            </Button>
          </form>
        </div>

        {/* Right: Icons & Profile */}
        <div className="flex items-center gap-2">
          <Tooltip title="Create">
            <IconButton sx={{ color: 'white' }}>
              <VideoCall />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ color: 'white' }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          {user ? (
            <div className="ml-2">
              <Tooltip title="Account">
                <IconButton onClick={handleLogout}>
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <Button
              variant="outlined"
              startIcon={<AccountCircle />}
              onClick={() => navigate('/login')}
              sx={{
                color: '#3ea6ff',
                borderColor: '#3ea6ff',
                borderRadius: '18px',
                textTransform: 'none',
                fontWeight: '500'
              }}
            >
              Sign in
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
