import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/Register.css';

const url = import.meta.env.VITE_URL;

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [focus, setFocus] = useState("none");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { firstname, lastname, username, password };

    try {
      const response = await fetch(`${url}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate("/login");
        setFirstname("");
        setLastname("");
        setUsername("");
        setPassword("");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="form-heading" style={{marginTop:'-10px'}}>Register</h2>
        <form onSubmit={handleSubmit} style={{marginTop:'-20px'}}>
          <div className="input-group">
            <label className="input-label">First Name</label>
            <input
              className="input-field"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Last Name</label>
            <input
              className="input-field"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email (Username)</label>
            <input
              className="input-field"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onFocus={() => setFocus("block")}
              onBlur={() => setFocus("none")}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                const isValidPassword = /^(?=.*\d)(?=.*[\W_])(?=.*[A-Z])(?=.*[a-z]).{8,}$/.test(newPassword);
                setIsValid(isValidPassword && newPassword.length >= 8);
              }}
              required
              style={{ borderColor: isValid === false ? "red" : "" }}
            />
            <ul className="validation-list" style={{ display: "flex" }}>
              <li style={{ color: password.length >= 8 ? "greenyellow" : "white" }}>At least 8 characters</li>
              <li style={{ color: /[A-Z]/.test(password) ? "greenyellow" : "white" }}>At least 1 uppercase</li>
              <li style={{ color: /[a-z]/.test(password) ? "greenyellow" : "white" }}>At least 1 lowercase</li>
              <li style={{ color: /\d/.test(password) ? "greenyellow" : "white" }}>At least 1 number</li>
              <li style={{ color: /[\W_]/.test(password) ? "greenyellow" : "white" }}>At least 1 special char</li>
            </ul>
          </div>
          <button className="submit-button" type="submit" disabled={!isValid}>Register</button>
        </form>
        <p className="login-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
