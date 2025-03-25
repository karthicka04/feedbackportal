import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaEdit } from 'react-icons/fa';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  // User state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");

  // Company state
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [file, setFile] = useState(null);
  
  // Flagged Feedback state
  const [flaggedFeedbacks, setFlaggedFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/recruiters");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch flagged feedbacks
  useEffect(() => {
    if (activeSection === "flaggedFeedbacks") {
      fetchFlaggedFeedbacks();
    }
  }, [activeSection]);

  const fetchFlaggedFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/flagged-feedbacks");
      setFlaggedFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching flagged feedbacks:", error);
      toast.error("Error loading flagged feedbacks ❌");
    }
  };

  const fetchFeedbackDetails = async (feedbackId) => {
    setIsLoadingFeedback(true);
    try {
      console.log("hi");
      const response = await axios.get(`http://localhost:5000/api/feedback/${feedbackId}`);
      setFeedbackDetails(response.data);
      setSelectedFeedback(feedbackId);
    } catch (error) {
      console.error("Error fetching feedback details:", error);
      toast.error("Failed to load feedback details ❌");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-user", {
        name,
        email,
        password,
        registerNo,
        department,
        batch,
      });
      toast.success("User added successfully ✅");
      setName("");
      setEmail("");
      setPassword("");
      setRegisterNo("");
      setDepartment("");
      setBatch("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Error adding user ❌");
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-company", {
        name: companyName,
        location: companyLocation,
        logo: companyLogo,
      });
      toast.success("Company added successfully ✅");
      setCompanyName("");
      setCompanyLocation("");
      setCompanyLogo("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Error adding company ❌");
    }
  };

  const handleBulkUpload = async (type) => {
    if (!selectedFile) {
      toast.error("Please select a file first ❗");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`http://localhost:5000/api/admin/bulk-upload/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Bulk ${type} upload successful ✅`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Error uploading ${type} file ❌`);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileChange1 = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !selectedCompany) {
      toast.error("Please select a company and upload an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      try {
        const response = await axios.post("http://localhost:5000/api/attendees/upload-attendees", {
          companyId: selectedCompany,
          attendees: data,
        });

        if (response.status === 201) {
          toast.success("Attendees uploaded successfully!");
          setFile(null);
          setSelectedCompany("");
        }
      } catch (error) {
        console.error("Error uploading attendees:", error);
        toast.error("Failed to upload attendees.");
      }
    };
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveSection("addUser")}>Add Users</button>
        <button onClick={() => setActiveSection("addCompany")}>Add Company</button>
        <button onClick={() => setActiveSection("bulkUpload")}>Bulk Upload</button>
        <button onClick={() => setActiveSection("AttendiesUpload")}>Attendees Upload</button>
        <button onClick={() => setActiveSection("flaggedFeedbacks")}>Flagged Feedbacks</button>
      </aside>
      <main className="content">
        {activeSection === "dashboard" && <h2>Welcome to Admin Dashboard 🎉</h2>}

        {activeSection === "addUser" && (
          <form onSubmit={handleAddUser} className="admin-form">
            <h2>Add New User</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="text" placeholder="Register Number" value={registerNo} onChange={(e) => setRegisterNo(e.target.value)} required />
            <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            <input type="text" placeholder="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} required />
            <button type="submit">Add User</button>
          </form>
        )}

        {activeSection === "addCompany" && (
          <form onSubmit={handleAddCompany} className="admin-form">
            <h2>Add New Company</h2>
            <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <input type="text" placeholder="Location" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} />
            <input type="text" placeholder="Logo URL" value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} />
            <button type="submit">Add Company</button>
          </form>
        )}

        {activeSection === "bulkUpload" && (
          <div className="bulk-upload-container">
            <h2>Bulk Upload</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} ref={fileInputRef} />
            <div className="upload-buttons">
              <button onClick={() => handleBulkUpload("users")}>Upload Users</button>
              <button onClick={() => handleBulkUpload("companies")}>Upload Companies</button>
            </div>
          </div>
        )}

        {activeSection === "AttendiesUpload" && (
          <div className="attendees-upload-container">
            <h2>Upload Attendees</h2>
            <select value={selectedCompany} onChange={handleCompanyChange} className="company-select">
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange1} className="file-input" />
            <button onClick={handleUpload} className="upload-button">Upload Attendees</button>
          </div>
        )}

        {activeSection === "flaggedFeedbacks" && (
          <div className="flagged-feedbacks-container">
            <h2>Flagged Feedbacks</h2>
            {flaggedFeedbacks.length === 0 ? (
              <p>No flagged feedbacks found</p>
            ) : (
              <div className="feedback-list-container">
                <ul className="feedback-list">
                  {flaggedFeedbacks.map((feedback) => (
                    <li 
                      key={feedback.feedbackId} 
                      className={`feedback-item ${selectedFeedback === feedback.feedbackId ? 'active' : ''}`}
                      onClick={() => fetchFeedbackDetails(feedback.feedbackId)}
                    >
                      <div className="feedback-header">
                        <span className="feedback-id">Feedback ID: {feedback.feedbackId}</span>
                        <span className="user-id">User ID: {feedback.userId}</span>
                      </div>
                      <FaEdit 
                        className="edit-icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/feedback/${feedback.feedbackId}`);
                        }} 
                      />
                    </li>
                  ))}
                </ul>
                
                {selectedFeedback && (
                  <div className="feedback-details">
                    {isLoadingFeedback ? (
                      <p>Loading feedback details...</p>
                    ) : feedbackDetails ? (
                      <>
                        <h3>Feedback Details</h3>
                        <div className="detail-item">
                          <strong>Company:</strong> {feedbackDetails.companyId?.name || 'N/A'}
                        </div>
                        <div className="detail-item">
                          <strong>User:</strong> {feedbackDetails.userId?.name || feedbackDetails.userId || 'N/A'}
                        </div>
                        <div className="detail-item">
                          <strong>Rating:</strong> {feedbackDetails.rating || 'N/A'}
                        </div>
                        <div className="detail-item">
                          <strong>Comments:</strong> 
                          <p>{feedbackDetails.comments || 'No comments provided'}</p>
                        </div>
                        <div className="detail-item">
                          <strong>Created At:</strong> 
                          {new Date(feedbackDetails.createdAt).toLocaleString()}
                        </div>
                        <div className="detail-item">
                          <strong>Status:</strong> 
                          <span className={`status-${feedbackDetails.status || 'pending'}`}>
                            {feedbackDetails.status || 'pending'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p>No details available for this feedback</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;