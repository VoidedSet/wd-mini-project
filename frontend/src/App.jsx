import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Headers from './Components/Headers.jsx';
import Search from './Components/Search.jsx';
import Footer from './Components/Footers.jsx';
import Portfolio from './Components/Portfolio.jsx';
import './App.css'
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
// Import other components as needed

function RedirectToSearchHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/search/home');
  }, [navigate]);
  return null; // Or a loading indicator
}

function App() {
  return (
    <>
      <Router>
        <Headers />
        <br />
        <Routes>
          <Route path="/" element={<RedirectToSearchHome />} />
          <Route path="/search/home" element={<Search ticker_name=""/>} />
          <Route path="/search/:ticker" element={<Search ticker_name="" />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Add other routes as needed */}
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
