import { useState } from 'react'
import './App.css'
import Player from './Player/Player'
import Navbar from './navbar/Navbar'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import Home from './Home/Home'
import Search from './Search/Search'

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <div className='content'>
        <Outlet />
        <Player />
      </div>
    </div>
  )
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
