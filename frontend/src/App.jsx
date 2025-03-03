import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import Navbar from "./compo/Navbar";

function App() {
  return (

    <Router>
       <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin" element={<AdminPage />} />
      

      </Routes>
    </Router>
  
  );
}

export default App;