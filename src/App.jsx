import React from 'react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { Outlet } from 'react-router-dom' 
import Loader from './components/loader/Loader'


function App() { 

  return (
    <>
      <div>
        <Header />
        <Outlet /> 
        <Footer />
      </div>
    </>
  )
}

export default App
