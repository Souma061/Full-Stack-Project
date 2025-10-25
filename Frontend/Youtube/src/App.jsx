import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from '@mui/material';
import Homeicon from '@mui/icons-material/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1 className="text-amber-50 " >Youtube Clone</h1>
    <Homeicon />
    <Button variant="contained" color="primary">
      Hello World
    </Button>
    </>
  )
}

export default App
