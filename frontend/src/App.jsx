import { useState } from 'react'
import './App.css'
import Player from './Player/Player'
import Navbar from './navbar/Navbar'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import Home from './Home/Home'
import Search from './Search/Search'
import Login from './auth/login/login'
import Registration from './auth/registration/registration'
import Marketing from './auth/Marketing/Marketing'
function Layout() {
  return (<>
    <Navbar />
    <div className='content'>
      <Outlet />
      <Player />
    </div>
  </>
  )
}
function AuthLayout(){
  return(
    <>
      <Marketing />
      <Outlet />
    </>
  )
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
