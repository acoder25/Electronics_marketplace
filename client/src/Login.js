import React, { useState, useEffect } from 'react';
import { Routes, Route,Link } from 'react-router-dom';
import './Login.css'; // Optional: Add a separate CSS file for styling

const Logo= () => {
  
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('Login successful!');
      // Optionally, you can redirect the user or store the token
    } else {
      setMessage(data.error);
    }
  };


  const validateEmail = (email) => {
    // Basic regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (event) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    
    // Validate email on each change
    if (!validateEmail(inputEmail)) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
    }
  };
  return (
    
    <>
    <div className="App">
    <header className="App-header">
    <Welcome />
  
      
    </header>
    </div>
    <div className="login-container">
      <h1 className="login-heading">Welcome Back!</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <br></br>
          <input type="email" id="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder="Enter your password"  onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <div className='extra'>
        <div className='create'>
        <Link to="/Createacc">CREATE ACCOUNT</Link>
        </div>
        <div className='forgot'>
            <a href="">FORGOT PASSWORD</a>
        </div>
        </div>
        <button type="submit" className="login-button">SIGN IN</button>
        {message && <p>{message}</p>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </>
    
  );
};
function Welcome(){
  return <p>Login to your Smart Marketplace</p>
}

export default Logo;
