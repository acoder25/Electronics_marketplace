import React, { useState } from 'react';
import './Login.css'; 

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  
  

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();

    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!username) {
      setUsernameError('Username is required.');
      isValid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    const response = await fetch('http://localhost:5000/api/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    const d=await response.json();
    
    if (response.ok) {
      setMessage('Account created successfully!');
    } else {
      setMessage(d.error);
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
      <h1 className="login-heading">Create Account</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <br />
          <input
            type="text"
            id="username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            
          />
          {usernameError && <p style={{ color: 'red', fontSize: '0.9em' }}>{usernameError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            
          />
          {emailError && <p style={{ color: 'red', fontSize: '0.9em' }}>{emailError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            
          />
          {passwordError && <p style={{ color: 'red', fontSize: '0.9em' }}>{passwordError}</p>}
        </div>
        <button type="submit" className="login-button">Sign Up</button>
        {message && <p>{message}</p>}
      </form>
      
    </div>
    </>
  );
};
function Welcome(){
  return <p>Create Account at our Smart Marketplace</p>
}

export default CreateAccount;
