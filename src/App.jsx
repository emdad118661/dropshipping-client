import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './CommonComponents/Footer'
import Navbar from './CommonComponents/Navbar'

function App() {

  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  )
}

export default App
