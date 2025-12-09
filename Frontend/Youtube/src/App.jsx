// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import WatchVideo from './pages/WatchVideo'
import Search from './pages/Search'
import NotFound from './pages/NotFound'

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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
