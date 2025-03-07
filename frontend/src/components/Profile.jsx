// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!loggedInUser) {
      window.location.href = '/login';
      return;
    }
    setUser(loggedInUser);

    const fetchUserFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/feedback?userId=${loggedInUser._id}`);
        setFeedbackList(response.data || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchUserFeedback();
  }, []);

  if (!user) return <div>Loading...</div>;

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(2, nameParts.length); i++) {  // Get up to 2 initials
      initials += nameParts[i].charAt(0).toUpperCase();
    }
    return initials;
  };

  const initials = getInitials(user.name);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
      </div>
      <div className="profile-details">
        <div className="profile-avatar">
          {initials}
        </div>
       <div className="profile-text">
        <p><span>Name:</span> {user.name}</p>
        <p><span>Email:</span> {user.email}</p>
        </div>
      </div>
      <div className="feedback-section">
        <h3>Your Feedback:</h3>
        {feedbackList.length > 0 ? (
          <ul className="feedback-list">
            {feedbackList.map((feedback) => (
              <li key={feedback._id}>
                <div className="feedback-text">
                  <span className="company">{feedback.companyName}</span>
                  <span className="role">{feedback.role}</span>
                </div>
                <FaEdit className="edit-icon" onClick={() => navigate(`/editfeedback/${feedback._id}`)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-feedback">No feedback submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;