import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "./AdminPage.css";

const AdminPage = () => {
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
  
  const fileInputRef = useRef(null);

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
      console.log("hi");

      try {
        const response = await axios.post("http://localhost:5000/api/attendees/upload-attendees", {
          companyId: selectedCompany,
          attendees: data,
        });

        if (response.status === 201) {
          toast.success("Attendees uploaded successfully!");
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
      </aside>
      <main className="content">
        {activeSection === "dashboard" && <h2>Welcome to Admin Dashboard 🎉</h2>}
        {activeSection === "addUser" && (
          <form onSubmit={handleAddUser}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Add User</button>
          </form>
        )}
        {activeSection === "addCompany" && (
          <form onSubmit={handleAddCompany}>
            <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <button type="submit">Add Company</button>
          </form>
        )}
        {activeSection === "bulkUpload" && (
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} ref={fileInputRef} />
        )}
        {activeSection === "AttendiesUpload" && (
          <>
            <select value={selectedCompany} onChange={handleCompanyChange}>
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange1} />
            <button onClick={handleUpload}>Upload</button>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
