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
import CompanyFeedbackPage from "./components/CompanyFeedbackPage"; // Import the new component

function App() {
    return (
        <Router>
            <Navbar />
            <ToastContainer closeButton={false} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPage />} />
               
                <Route path="/profile" element={<Profile />} />
                <Route path="/editfeedback/:feedbackId" element={<EditFeedback />} />
                <Route path="/company/:companyId" element={<CompanyFeedbackPage />} /> {/* Update this route */}
                <Route path="/feedback/:id" element={<FeedbackDetails />} />
                <Route path="/recruiters" element={<Recruiters />} />
            </Routes>
        </Router>
    );
}

export default App;