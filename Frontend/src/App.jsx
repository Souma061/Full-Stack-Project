
import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'


import Home from './pages/Home.jsx'
function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
    </Routes>
  )
}

export default App
