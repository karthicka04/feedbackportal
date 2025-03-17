import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaFlag } from "react-icons/fa";
import "./ViewFeedback.css";

const ViewFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [likedFeedbacks, setLikedFeedbacks] = useState({});
    const [bookmarkedFeedbacks, setBookmarkedFeedbacks] = useState({});
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user || !user._id) {
            console.warn("User not logged in. Redirecting to login.");
            window.location.href = "/login";
            return;
        }
    }, [user]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/feedback");
                if (!response.ok) throw new Error("Failed to fetch feedback");
                
                const data = await response.json();
                setFeedbacks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const updateLikeOrSave = async (feedbackId, actionType) => {
        if (!user || !user._id) {
            console.warn("User not logged in.");
            return null;
        }

        const endpoint = `http://localhost:5000/api/feedback/${user._id}/${actionType}/${feedbackId}`;
        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${actionType}`);
            }

            const updatedUser = await response.json();
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error(`Error ${actionType}ing feedback:`, error.message);
            setError(error.message);
            return null;
        }
    };

    const toggleLike = async (feedbackId) => {
        const updatedUser = await updateLikeOrSave(feedbackId, "like");
        if (updatedUser) {
            setLikedFeedbacks((prev) => ({
                ...prev,
                [feedbackId]: !prev[feedbackId],
            }));
        }
    };

    const toggleBookmark = async (feedbackId) => {
        const updatedUser = await updateLikeOrSave(feedbackId, "save");
        if (updatedUser) {
            setBookmarkedFeedbacks((prev) => ({
                ...prev,
                [feedbackId]: !prev[feedbackId],
            }));
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
                        {/* Header: Profile & Student Info */}
                        <div className="feedback-header">
                            <div className="profile-icon">{feedback.name.charAt(0).toUpperCase()}</div>
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
                                {likedFeedbacks[feedback._id] ? <FaHeart color="red" /> : <FaRegHeart />}
                            </button>
                            <button onClick={() => toggleBookmark(feedback._id)}>
                                {bookmarkedFeedbacks[feedback._id] ? <FaBookmark color="gold" /> : <FaRegBookmark />}
                            </button>
                            <button>
                                <FaFlag />
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
