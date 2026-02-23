import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(user => user.email === email);

    if (userExists) {
      setMessage("User already registered!");
      return;
    }

    // ⭐ AUTO ROLE DETECTION
    const role = email.includes("@gmail.com")
      ? "student"
      : "admin";

    users.push({ email, password, role });

    localStorage.setItem("users", JSON.stringify(users));

    setMessage(`Registered successfully as ${role.toUpperCase()}!`);

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>

        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <label>Admin Name or Student Gmail</label>
            <input
              type="text"   /* ⭐ IMPORTANT CHANGE */
              placeholder="Enter admin name or student@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button">Register</button>
        </form>

        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;