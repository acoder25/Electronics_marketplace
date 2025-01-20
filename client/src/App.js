import './App.css';
import React, { useState, useEffect } from 'react';
import CreateAccount from './Createacc';
import Login_sell from './Login_seller';
import Logo from './Login';
import { Routes, Route,Link } from 'react-router-dom';
import Crt_sell from './Create_sellacc';
import Main from './Smainpg1';
import List from './Bucketlst';
import Add from './Add_items';



function App() {
  const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api')
            .then(response => response.json())
            .then(data => setMessage(data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
  return (
    
      <Routes>
      
        <Route
          path="/"
          element={
            <div>
              <div className="App">
              <header className="App-header">
              <Welcome />
            
                
              </header>
              </div>
              {/* Home Content */}
              <Link to="/Login">
                <div className="Buyer">
                  <p>BUYER</p>
                </div>
              </Link>
              <Link to="/Login_seller">
              <div className="Seller">
              <p>SELLER</p>
              
              </div>
              </Link>
            </div>
          }
        />
        <Route path="/Add_items" element={<Add/>}/>
        <Route path="/Bucketlst" element={<List/>}/>
        <Route path="/Smainpg1" element={<Main/>}/>
        <Route path="/Login_seller" element={<Login_sell/>}/>
        <Route path="/Create_sellacc" element={<Crt_sell/>}/>
        <Route path="/Login" element={<Logo />} />
        <Route path="/Createacc" element={<CreateAccount />} />
        </Routes>
      
      
    
  );
}
function Welcome(){
  return <p>Smart Marketplace</p>
}

export default App;
