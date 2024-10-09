import React, { useEffect } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom" //routing context for your application
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice"; 
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []); //When page refreshes this will run

  return (
    <>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} /> {/*Renders Home page*/}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post/application/:jobId" element={<PostApplication />}/> {/*Renders PostApplication page by passing jobId*/}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" theme="dark" />
      </Router>
    </>
  )
}

export default App
