import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Add_items.css'; 
import myImage from './catalogue.avif';

const Add = () => {
    const user = useSelector((state) => state.user);
    const email=user.email;

    const [message,setMessage]=useState('');

    const [deviceData, setDeviceData] = useState({
        deviceType: '',
        model: '',
        year: '',
        storage: '',
        ram: '',
        screenCondition: '',
        batteryHealth: '',
        physicalCondition: '',
        price:'',
        accessoriesIncluded: false,
        image: null, 
    });

    

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            // Handle file input
            setDeviceData((prevState) => ({
                ...prevState,
                [name]: files[0], // Store the first file
            }));
        } else {
            setDeviceData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    

    const handleSubmit =async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('type', deviceData.deviceType);
        formData.append('model', deviceData.model);
        formData.append('year', deviceData.year);
        formData.append('storage', deviceData.storage);
        formData.append('ram', deviceData.ram);
        formData.append('screenCondition', deviceData.screenCondition);
        formData.append('batteryHealth', deviceData.batteryHealth);
        formData.append('physicalCondition', deviceData.physicalCondition);
        formData.append('price', deviceData.price);
        formData.append('accessoriesIncluded', deviceData.accessoriesIncluded);
        formData.append('image', deviceData.image);

        const response = await fetch('http://localhost:5000/api/add_items', {
            method: 'POST',
            body: formData,
        });

        const data=await response.json();

        if(response.ok){
            setMessage('Item Added to your Catalogue');

        }
        else{
            setMessage(data.error);
        }

    };

    return (
      <>
      <div className='head'>
        Add Items To Your Catalogue
      </div>
        <div className="price-calculator-container">
            <div className='image-container'>
               <img src={myImage} alt="catalogue" className='image'/>
            </div>
            <h1>Enter Details Of Your Product</h1>
            <form onSubmit={handleSubmit} className="price-calculator-form">
                <div className="form-group">
                    <label>Device Type:</label>
                    <select name="deviceType" onChange={handleChange}>
                        <option value="phone">Phone</option>
                        <option value="laptop">Laptop</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Model:</label>
                    <input
                        type="text"
                        name="model"
                        value={deviceData.model}
                        onChange={handleChange}
                        placeholder="Enter device model"
                    />
                </div>

                <div className="form-group">
                    <label>Year of Manufacture:</label>
                    <input
                        type="number"
                        name="year"
                        value={deviceData.year}
                        onChange={handleChange}
                        placeholder="Enter year"
                    />
                </div>

                <div className="form-group">
                    <label>Storage Size:</label>
                    <input
                        type="number"
                        name="storage"
                        value={deviceData.storage}
                        onChange={handleChange}
                        placeholder="Enter storage size (GB)"
                    />
                </div>

                <div className="form-group">
                    <label>RAM Size:</label>
                    <input
                        type="number"
                        name="ram"
                        value={deviceData.ram}
                        onChange={handleChange}
                        placeholder="Enter RAM size (GB)"
                    />
                </div>

                <div className="form-group">
                    <label>Screen Condition:</label>
                    <select name="screenCondition" onChange={handleChange}>
                        <option value="good">Good</option>
                        <option value="cracked">Cracked</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Battery Health:</label>
                    <select name="batteryHealth" onChange={handleChange}>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Physical Condition:</label>
                    <select name="physicalCondition" onChange={handleChange}>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="damaged">Damaged</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="text"
                        name="price"
                        value={deviceData.price}
                        onChange={handleChange}
                        placeholder="Enter expected selling price"
                    />
                </div>

                <div className="form-group">
                    <label>Accessories Included:</label>
                    <input
                        type="checkbox"
                        name="accessoriesIncluded"
                        checked={deviceData.accessoriesIncluded}
                        onChange={() => setDeviceData({ ...deviceData, accessoriesIncluded: !deviceData.accessoriesIncluded })}
                    />
                </div>

                <div className="form-group">
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                 <button type="submit" className="add">Add</button>
                 <div className="msg">
                    <p>{message}</p>
                 </div>
            </form>

            
        </div>
        </>
    );
};
export default Add;