import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "./AdminPage.css";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // User States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  

  // File Upload & Message States
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const fileInputRef = useRef(null);

  // **Handle User Addition**
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-user", {
        name,
        email,
        password,
      });
      toast.success("User added successfully ✅");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Error adding user ❌");
    }
  };

  // **Handle Company Addition**
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
      toast.error("Error adding company ❌");
    }
  };

  // **Handle Bulk Upload**
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
  // **Handle File Selection**
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      readExcel(file);
    }
  };

  // **Read Excel File**
  const readExcel = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Validate Data Format
      if (parsedData.length === 0) {
        toast.error("Excel file is empty ❌");
        return;
      }

      const validData = parsedData.map((row) => ({
        name: row["Name"] || "",
        email: row["Email"] || "",
        password: row["Password"] || "",
      }));

      setExcelData(validData);
    };
  };

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveSection("addUser")}>Add Users</button>
        <button onClick={() => setActiveSection("addCompany")}>Add Company</button>
        <button onClick={() => setActiveSection("bulkUpload")}>Bulk Upload</button>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Dashboard */}
        {activeSection === "dashboard" && <h2>Welcome to Admin Dashboard 🎉</h2>}

        {/* Add User Section */}
        {activeSection === "addUser" && (
          <>
            <h2>Add User</h2>
            <form onSubmit={handleAddUser}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Add User</button>
            </form>
          </>
        )}

        {/* Add Company Section */}
        {activeSection === "addCompany" && (
          <>
            <h2>Add Company</h2>
            <form onSubmit={handleAddCompany}>
              <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              <input type="text" placeholder="Location" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} required />
              <input type="text" placeholder="Logo URL" value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} required />
              
              <button type="submit">Add Company</button>
            </form>
          </>
        )}

        {/* Bulk Upload Section */}
        {activeSection === "bulkUpload" && (
          <>
            <h2>Bulk Upload</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} ref={fileInputRef} />
            <button onClick={() => handleBulkUpload("user")}>Upload Users</button>
            <button onClick={() => handleBulkUpload("company")}>Upload Companies</button>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
