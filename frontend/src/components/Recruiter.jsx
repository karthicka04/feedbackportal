import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Recruiters.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Recruiters = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        axios.get("http://localhost:5000/api/recruiters")
            .then(response => {
                console.log("Fetched companies:", response.data);
                setCompanies(response.data);
            })
            .catch(error => console.log("❌Error fetching companies:", error));
    }, []);

    const handleCompanyClick = (companyId) => {
        navigate(`/company/${companyId}`); // Navigate to the company's page
    };

    return (
        <div className="recruiters-container">
            <h2 className="title">Recruiters</h2>
             <input
                type="text"
                className="search-bar"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="company-list">
                {companies
                    .filter(company => company.name.toLowerCase().includes(search.toLowerCase()))
                    .map(company => (
                        <div
                            key={company._id}
                            className="company-card"
                            onClick={() => handleCompanyClick(company._id)} // Add onClick handler
                            style={{ cursor: "pointer" }} // Change cursor for better UX
                        >
                            <img
                                src={company.logo || "https://via.placeholder.com/100"}
                                alt={company.name}
                                className="company-logo"
                            />
                            <h3>{company.name}</h3>
                            <p>{company.location}</p>
                        </div>
                    ))
                }
            </div>

        </div>
    );
};

export default Recruiters;