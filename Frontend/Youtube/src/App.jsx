// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import History from './pages/History'
import Home from './pages/Home'
import LikedVideos from './pages/LikedVideos'
import MyVideos from './pages/MyVideos'
import NotFound from './pages/NotFound'
import Playlist from './pages/Playlist'
import Playlists from './pages/Playlists'
import Search from './pages/Search'
import Subscriptions from './pages/Subscriptions'
import UserChannel from './pages/UserChannel'
import WatchLater from './pages/WatchLater'
import WatchVideo from './pages/WatchVideo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:videoId" element={<WatchVideo />} />
          <Route path="/search" element={<Search />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/history" element={<History />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<Playlist />} />
          <Route path="/liked" element={<LikedVideos />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="/c/:username" element={<UserChannel />} />
          <Route path="/my-videos" element={<MyVideos />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
