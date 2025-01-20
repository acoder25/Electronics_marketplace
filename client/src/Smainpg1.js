import React from 'react';
import './Smain1.css';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

const Main=()=>{
  
 
  return (
    <>
    
    <div className="navbar">
    <div className="web-name">
    <i className="bi bi-display"></i>Gadget Flip
    </div>
    <div className="nav-items">
      <div className="items">
        <Link to="/Bucketlst" >Seller's Shelf</Link>
      </div>
      <div className="items">
       Profile
      </div>
    </div>
  </div>
    
    </>
  )
}
export default Main;