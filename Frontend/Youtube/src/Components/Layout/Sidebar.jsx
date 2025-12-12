import { AccessTime, History, Home, PlaylistPlay, Subscriptions, ThumbUp, VideoLibrary } from '@mui/icons-material';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useAuth';

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();

  const isSelected = (path) => location.pathname === path;

  // Reusable List Item
  const SidebarItem = ({ icon, label, path, onClick }) => (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={() => {
          if (onClick) onClick();
          if (path) navigate(path);
        }}
        selected={isSelected(path)}
        sx={{
          minHeight: 48,
          justifyContent: 'initial',
          px: 2.5,
          borderRadius: 2,
          mx: 1.5,
          mb: 0.5,
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: 'center',
            color: isSelected(path) ? 'white' : '#aaa', // Highlight icon if selected
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: isSelected(path) ? 500 : 400,
            color: 'white'
          }}
        />
      </ListItemButton>
    </ListItem>
  );

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <List>
        <SidebarItem icon={<Home />} label="Home" path="/" />
        {/* Shorts (Placeholder) */}
        {/* <SidebarItem icon={<Whatshot />} label="Shorts" path="#" /> */}
        <SidebarItem icon={<Subscriptions />} label="Subscriptions" path="/subscriptions" />
      </List>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />

      <Box sx={{ px: 3, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#aaaaaa' }}>
          You &gt;
        </Typography>
      </Box>

      <List>
        <SidebarItem icon={<History />} label="History" path="/history" />
        <SidebarItem icon={<VideoLibrary />} label="Your Videos" path="/my-videos" />
        <SidebarItem icon={<PlaylistPlay />} label="Playlists" path="/playlists" />
        <SidebarItem icon={<AccessTime />} label="Watch Later" path="/watch-later" />
        <SidebarItem icon={<ThumbUp />} label="Liked Videos" path="/liked" />
      </List>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />

      {!user && (
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="white" sx={{ mb: 2 }}>
            Sign in to like videos, comment, and subscribe.
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        bgcolor: '#0f0f0f' // Match background
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#0f0f0f',
            color: 'white',
            borderRight: '1px solid #2d2d2d'
          },
        }}
      >
        <Toolbar /> {/* Spacer for Header */}
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#0f0f0f',
            color: 'white',
            borderRight: 'none', // Remove heavy border for cleaner look
            height: 'calc(100% - 64px)', // Adjust height to be below header
            top: 64, // Push down by header height
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
