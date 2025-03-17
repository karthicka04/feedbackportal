import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Recruiters.css";
import "./Form.jsx"
const Recruiters = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("view");
    useEffect(() => {
        axios.get("http://localhost:5000/api/recruiters")
            .then(response => {
                console.log("Fetched companies:", response.data);
                setCompanies(response.data);
            })
            .catch(error => console.log("❌Error fetching companies:", error));
    }, []);
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

            
            <div className="tabs">
                <button 
                    className={activeTab === "view" ? "active" : ""}
                    onClick={() => setActiveTab("view")}
                >
                    View
                </button>
                <button 
                    className={activeTab === "post" ? "active" : ""}
                    onClick={() => setActiveTab("post")}
                >
                    Post
                </button>
            </div>

           
            {activeTab === "view" ? (
                <div className="company-list">
                    {companies
                        .filter(company => company.name.toLowerCase().includes(search.toLowerCase()))
                        .map(company => (
                            <div key={company._id} className="company-card">
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
            ) : (
                <div className="company-list">
                    {companies
                        .filter(company => company.name.toLowerCase().includes(search.toLowerCase()))
                        .map(company => (
                            <div key={company._id} className="company-card">
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
            )}
        </div>
    );
};
export default Recruiters;