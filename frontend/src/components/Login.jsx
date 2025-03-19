import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    const user = { email, password };

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        user
      );
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(data)); // Store the whole data object including the token
      toast.success("Login Successful!", { position: "top-right", autoClose: 2000 });

      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (error) {
      setLoading(false);
     toast.error("Invalid Credentials");
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
            <button className="btn btn-primary mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;