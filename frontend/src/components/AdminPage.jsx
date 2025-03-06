import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx library

const AdminPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [excelData, setExcelData] = useState([]); // State to store extracted Excel data
    const fileInputRef = useRef(null);  // Ref for file input

    const handleAddUser = async (e) => {
        e.preventDefault();
        setMessage(""); 

        try {
            const response = await axios.post("http://localhost:5000/api/admin/add-user", {
                name,
                email,
                password,
            });

            setMessage(response.data.message);
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Error adding user:", error);
            setMessage(error.response?.data?.message || "Error adding user. Please check your backend.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            readExcel(file);
        }
    };

    const readExcel = (file) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // Read the first sheet
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to JSON
            setExcelData(parsedData);
        };
    };

    return (
        <div>
            <h2>Admin Dashboard - Add User</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleAddUser}>
                <input
                    type="text"
                    placeholder="User Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="User Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Add User</button>
            </form>

            {/* Excel Upload Section */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => fileInputRef.current.click()}>Upload XL Sheet</button>
                <input
                    type="file"
                    accept=".xls,.xlsx"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                {selectedFile && <p>Selected File: {selectedFile.name}</p>}
            </div>

            {/* Display Excel Data */}
            {excelData.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Extracted Excel Data</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                {excelData[0].map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
