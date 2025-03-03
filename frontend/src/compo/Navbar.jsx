import React, { useState } from 'react';
import necLogo from "../assets/nec_logo.png";
import "../components/Home.css"

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1,setDropdownOpen1]=useState(false);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }

    return (
        <div>
            <nav className="navbar">
                <img className="logo" src={necLogo} alt="NEC Logo" />
                <div className="nav-links">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/recruiters">Recruiters</a></li>
                        <li 
                            className="dropdown"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <a href="#" className="dropdown-toggle">Placement Details ▾</a>
                            {dropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><a href="/placement/2020-2021">2020-2021</a></li>
                                    <li><a href="/placement/2021-2022">2021-2022</a></li>
                                    <li><a href="/placement/2022-2023">2022-2023</a></li>
                                    <li><a href="/placement/2023-2024">2023-2024</a></li>
                                    <li><a href="/placement/2024-2025">2024-2025</a></li>
                                </ul>
                            )}
                        </li>

                        {user ? (
                            <li className="nav-item dropdown">
                                <div 
                                    className="profile-circle"
                                    onClick={() => setDropdownOpen1(!dropdownOpen1)}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                {dropdownOpen1 && (
                                   <div className="dropdown-menu1">
                                   <a 
                                       className="dropdown-item" 
                                       href="/profile" 
                                       style={{ color: "black", backgroundColor: "white", padding: "8px", display: "block" }}
                                       onMouseOver={(e) =>  e.target.style.Color = "blue"}
                                       onMouseOut={(e) =>  e.target.style.color = "black"}
                                   >
                                       Profile
                                   </a>
                                   <a 
                                       className="dropdown-item" 
                                       href="#" 
                                       onClick={logout} 
                                       style={{ color: "black", backgroundColor: "white", padding: "8px", display: "block" }}
                                       onMouseOver={(e) => e.target.style.Color = "blue"}
                                       onMouseOut={(e) => e.target.style.color = "black"}
                                   >
                                       LogOut
                                   </a>
                               </div>
                               
                                )}
                            </li>
                        ) : (
                            <li><a href="/login" className="login-btn">Login</a></li>
                        )}
                    </ul>
                </div>
            </nav>

            <style>
                {`
                .profile-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: white;
                    color: blue;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    border: 2px solid blue;
                }
                .dropdown-menu {
                    position: absolute;
                    background: white;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    padding: 10px;
                }
                `}
            </style>
        </div>
    );
}

export default Navbar;
