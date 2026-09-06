import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SellPen from './pages/SellPen'
import PenDetails from './pages/PenDetails'
import MyListings from './pages/MyListings'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellPen />
            </ProtectedRoute>
          }
        />
        <Route path="/pens/:id" element={<PenDetails />} />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
