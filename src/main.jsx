import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ToastContainer } from 'react-toastify'

// LAYOUTS
import WebLayout from './layout/weblayout.jsx'

// PAGES
import HomePage from './pages/home.jsx'
import SignUp from './pages/auth/siginup.jsx'
import LoginPage from './pages/auth/signin.jsx'
import Dashboard from './pages/dashboard.jsx'
import CleanerForm from './pages/becomecleaner.jsx'

import BookingPage from './pages/book.jsx'
import BookingSuccess from './pages/booking/success.jsx'
import BookingFailure from './pages/booking/failure.jsx'


const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <StrictMode>
    <ToastContainer />

     <BrowserRouter>
      <Routes>
        {/* Web Layout */}
        <Route path="/" element={<WebLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/book-cleaning" element={<BookingPage />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/booking/failure" element={<BookingFailure />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/membership" element={<CleanerForm />} />
        </Route>
      </Routes>
    </BrowserRouter>

  </StrictMode>
)
