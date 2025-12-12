import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f0f0f' }}>
      <CssBaseline />

      {/* Header (Fixed) */}
      <Header toggleSidebar={handleDrawerToggle} />

      {/* Sidebar (Responsive) */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` }, // Adjust width based on sidebar
          ml: { md: 0 }, // Sidebar is fixed in drawer, but layout handles spacing via flex or separate approach.
          // With simplified Drawer approach, 'permanent' drawer in sidebar component takes space.
          // But for simple "YouTube" layout, let's keep it clean.
          color: 'white'
        }}
      >
        <Toolbar /> {/* Spacer for fixed Header */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
