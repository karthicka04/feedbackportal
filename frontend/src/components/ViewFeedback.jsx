import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaFlag } from "react-icons/fa";
import "./ViewFeedback.css";

const ViewFeedback = ({ companyId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [likedFeedbacks, setLikedFeedbacks] = useState({});
  const [bookmarkedFeedbacks, setBookmarkedFeedbacks] = useState({});
  const [FlagedFeedbacks, setFlagedFeedbacks] = useState({});


  const user = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;

  useEffect(() => {
    if (!user || !user._id) {
      console.warn("User not logged in. Redirecting to login.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!companyId) {
        setError("Invalid company ID.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching feedback for companyId:", companyId);
        const response = await fetch(
          `http://localhost:5000/api/feedback?companyId=${companyId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            navigate("/recruiters");
            return;
          }
          throw new Error(`Failed to fetch feedback: ${response.status}`);
        }

        const data = await response.json();
        setFeedbacks(data);
        console.log("Fetched feedback data:", data);

        initializeLikeBookmarkStatus(data);

      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [companyId, navigate]);

  const initializeLikeBookmarkStatus = (feedbacks) => {
    if (!user || !user._id) return;

    const initialLiked = {};
    const initialBookmarked = {};
    const initialFlaged = {};


    feedbacks.forEach((feedback) => {
      initialLiked[feedback._id] = Array.isArray(feedback.likes)
        ? feedback.likes.includes(user._id)
        : false;
      initialBookmarked[feedback._id] = Array.isArray(feedback.savedBy)
        ? feedback.savedBy.includes(user._id)
        : false;
      initialFlaged[feedback._id] = Array.isArray(feedback.flagedBy)
        ? feedback.flagedBy.includes(user._id)  // Corrected typo here
        : false;

    });

    setLikedFeedbacks(initialLiked);
    setBookmarkedFeedbacks(initialBookmarked);
    setFlagedFeedbacks(initialFlaged)
  };

  const toggleLike = async (feedbackId) => {
    // Optimistically update the UI
    setLikedFeedbacks((prev) => ({
      ...prev,
      [feedbackId]: !prev[feedbackId],
    }));

    try {
      const response = await fetch(
        `http://localhost:5000/api/viewFeedback/like`, // Corrected endpoint here
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, feedbackId: feedbackId }),
        }
      );

      if (!response.ok) {
        // Revert the optimistic update if the server returns an error
        setLikedFeedbacks((prev) => ({
          ...prev,
          [feedbackId]: !prev[feedbackId],
        }));
        throw new Error(`Failed to toggle like: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setError(error.message);
    }
  };
  const toggleFlag = async (feedbackId) => {
    setFlagedFeedbacks((prev) => ({
      ...prev,
      [feedbackId]: !prev[feedbackId],
    }));

    try {
      const response = await fetch(
        `http://localhost:5000/api/viewFeedback/flag`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, feedbackId: feedbackId }),
        }
      );

      if (!response.ok) {

        setFlagedFeedbacks((prev) => ({
          ...prev,
          [feedbackId]: !prev[feedbackId],
        }));
        throw new Error(`Failed to toggle flag: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling flag:", error);
      setError(error.message);
    }
  };

  const toggleBookmark = async (feedbackId) => {
    setBookmarkedFeedbacks((prev) => ({
      ...prev,
      [feedbackId]: !prev[feedbackId],
    }));

    try {
      const response = await fetch(
        `http://localhost:5000/api/viewFeedback/bookmark`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, feedbackId: feedbackId }),
        }
      );

      if (!response.ok) {
        // Revert the optimistic update if the server returns an error
        setBookmarkedFeedbacks((prev) => ({
          ...prev,
          [feedbackId]: !prev[feedbackId],
        }));
        throw new Error(`Failed to toggle bookmark: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setError(error.message);
    }
  };

  if (loading) return <p className="loading">Loading feedbacks...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="feed-container">
      <h1 className="feed-title">Placement Feedback</h1>
      <div className="feed-list">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="feedback-card">
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

            <div className="company-info">
              <p>
                <strong>🏢 Company:</strong> {feedback.companyName}
              </p>
              <p>
                <strong>📍 Location:</strong> {feedback.companyLocation}
              </p>
            </div>

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
              <button onClick={() => toggleFlag(feedback._id)}>
                {FlagedFeedbacks[feedback._id] ? (
                  <FaFlag color="black" />
                ) : (
                  <FaFlag />
                )}
              </button>
            </div>

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