import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import Navbar from "./compo/Navbar";
import Form from "./components/Form";
import Profile from "./components/Profile";
import EditFeedback from "./components/EditFeedback";
import ViewFeedback from "./components/ViewFeedback";
import FeedbackDetails from "./components/FeedbackDetails";
import { ToastContainer } from "react-toastify";
import Recruiters from "./components/Recruiter";
//import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer closeButton={false}/>  {/* Ensuring ToastContainer is included for notifications */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/post" element={<Form />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editfeedback/:feedbackId" element={<EditFeedback />} />
        <Route path="/view" element={<ViewFeedback />} />
        <Route path="/feedback/:id" element={<FeedbackDetails />} /> 
        <Route path="/recruiters" element={<Recruiters/>} />
      </Routes>
    </Router>
  );
}

export default App;
