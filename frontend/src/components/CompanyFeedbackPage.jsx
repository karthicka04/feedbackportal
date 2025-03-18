import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ViewFeedback from "./ViewFeedback";
import Form from "./Form";
import "./CompanyFeedbackPage.css"; // Create this CSS file

const CompanyFeedbackPage = () => {
    const { companyId } = useParams();
    const [activeTab, setActiveTab] = useState("view"); // "view" or "post"
    const [companyName, setCompanyName] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/recruiters/company/${companyId}`); // Create new backend route

                if (response.status !== 200) {
                    throw new Error("Failed to fetch company data");
                }

                const company = response.data;
                setCompanyName(company.name);
                setCompanyLocation(company.location);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching company data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyId]);

    if (loading) return <p>Loading company data...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="company-feedback-page">
            <div className="tab-buttons">
                <button
                    className={activeTab === "view" ? "active" : ""}
                    onClick={() => setActiveTab("view")}
                >
                    View Feedback
                </button>
                <button
                    className={activeTab === "post" ? "active" : ""}
                    onClick={() => setActiveTab("post")}
                >
                    Post Feedback
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "view" ? (
                    <ViewFeedback companyId={companyId} />
                ) : (
                    <Form companyId={companyId} initialCompanyName={companyName} initialCompanyLocation={companyLocation} />
                )}
            </div>
        </div>
    );
};

export default CompanyFeedbackPage;