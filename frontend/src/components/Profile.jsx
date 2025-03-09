// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { FaUserEdit, FaBell, FaCommentAlt, FaBookmark ,FaEdit} from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('profile'); // Default to 'profile'
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

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return (
          <div className="profile-details">
            <div className="profile-avatar">
              {initials}
            </div>
            <div className="profile-text">
              <p><span>Name:</span> {user.name}</p>
              <p><span>Email:</span> {user.email}</p>
            </div>
          </div>
        );
      case 'feedback':
        return (
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
        );
      case 'saved':
        return (
          <div>
            <h3>Saved Feedback</h3>
          </div>
        );
        case 'notifications':
        return (
          <div>
            <h3>Your Notifications</h3>
          </div>
        );
      default:
        return null; // Or a default content
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2> Profile</h2>
      </div>
      <div className="profile-layout">
        <div className="sidebar">
        <ul>
  <li onClick={() => handleSectionClick('profile')} className={selectedSection === 'profile' ? 'active' : ''}>
    <FaUserEdit style={{ marginRight: '10px' , fontSize:'20'}} /> Edit Profile 
  </li>
  <li onClick={() => handleSectionClick('notifications')} className={selectedSection === 'notifications' ? 'active' : ''}>
    <FaBell style={{ marginRight: '10px' }} /> Notifications
  </li>
  <li onClick={() => handleSectionClick('feedback')} className={selectedSection === 'feedback' ? 'active' : ''}>
    <FaCommentAlt style={{ marginRight: '10px' }} /> Posted Feedbacks
  </li>
  <li onClick={() => handleSectionClick('saved')} className={selectedSection === 'saved' ? 'active' : ''}>
    <FaBookmark style={{ marginRight: '10px' }} /> Saved Feedbacks
  </li>
</ul>
        </div>
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;