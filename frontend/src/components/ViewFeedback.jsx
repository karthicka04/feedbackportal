import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaFlag } from "react-icons/fa"; // Import icons
import "./ViewFeedback.css"; // Import CSS

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [likedFeedbacks, setLikedFeedbacks] = useState({});
  const [bookmarkedFeedbacks, setBookmarkedFeedbacks] = useState({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch feedback");
        }
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const toggleLike = (id) => {
    setLikedFeedbacks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleBookmark = (id) => {
    setBookmarkedFeedbacks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p className="loading">Loading feedbacks...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="feed-container">
      <h1 className="feed-title">Placement Feedback</h1>
      <div className="feed-list">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="feedback-card">
            {/* Header: Profile & Student Info */}
            <div className="feedback-header">
              <div className="profile-icon">
                {feedback.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <p className="user-name">{feedback.name}</p>
                <p className="user-details">
                  {feedback.rollNumber} | {feedback.department}
                </p>
              </div>
            </div>

            {/* Company Details */}
            <div className="company-info">
              <p>
                <strong>🏢 Company:</strong> {feedback.companyName}
              </p>
              <p>
                <strong>📍 Location:</strong> {feedback.companyLocation}
              </p>
            </div>

            {/* Actions: Like, Bookmark, Report */}
            <div className="feedback-actions">
              <button onClick={() => toggleLike(feedback._id)}>
                {likedFeedbacks[feedback._id] ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <button onClick={() => toggleBookmark(feedback._id)}>
                {bookmarkedFeedbacks[feedback._id] ? (
                  <FaBookmark color="gold" />
                ) : (
                  <FaRegBookmark />
                )}
              </button>
              <button>
                <FaFlag />
              </button>
            </div>

            {/* View Full Feedback Button */}
            <button
              onClick={() => navigate(`/feedback/${feedback._id}`)}
              className="view-feedback-btn"
            >
              View Full Feedback →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewFeedback;
