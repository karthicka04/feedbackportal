import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import Navbar from "./compo/Navbar";
import Form from "./components/Form";
import Profile from './components/Profile';
import EditFeedback from './components/EditFeedback';
import ViewFeedback from './components/ViewFeedback';
import FeedbackDetails from './components/FeedbackDetails';

function App() {
  return (

    <Router>
       <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/post" element={<Form/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/editfeedback/:feedbackId" element={<EditFeedback />} /> 
       <Route path="/view" element={<ViewFeedback />} />
       <Route path="/feedback/:id" element={<FeedbackDetails />} />  {/* Route for details page */}

      </Routes>
    </Router>

  );
}

export default App;
