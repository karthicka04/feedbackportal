import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";  // Import useNavigate

function Login() {  // Receive setUserData as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  async function login() {
    const user = { email, password };

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        user
      );
      console.log(data);
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(data));  // Store the response data

      toast.success("Login Successful!", { position: "top-right", autoClose: 2000 });

      //  Now use navigate to redirect
      navigate("/home");

    } catch (error) {
      setLoading(false);
      toast.error("Invalid Credentials", { position: "top-right", autoClose: 2000 });
      console.error("Login error:", error.response ? error.response.data : error.message); // Log the error
    }
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          <div className="bs">
            <h2>Login</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={login} disabled={loading}>  {/* Disable button while loading */}
              {loading ? "Logging in..." : "Login"}  {/* Show appropriate text */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
