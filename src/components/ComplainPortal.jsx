import React, { useState , useEffect } from 'react';
import '../styles/userComplain.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const ComplainPortal = () => {
  const [userComplain, setUserComplain] = useState({
    name: "",
    desciption: "",
    address: [],
    image: "",
    phone: "",
    email: "",
  });


  useEffect(() => {
    const fetchIpAddressAndLocation = async () => {
      try {
        // Fetch the user's IP address
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;

        // Fetch the location data based on the IP address
        const locationResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=39129ebed6fc12`);
        const locationData = locationResponse.data;

        // Extract latitude and longitude from the location data
        const [latitude, longitude] = locationData.loc.split(',').map(coord => parseFloat(coord));
        


        // Update the userComplain state
        setUserComplain(prevState => ({
          ...prevState,
          address: [longitude,latitude]
        }));

        console.log(longitude, latitude);
      } catch (error) {
        console.error("Error fetching the IP address or location data", error);
      }
    };

    fetchIpAddressAndLocation();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if( name === "image"){
      setUserComplain({
        ...userComplain,
        [name]: "value"
      });
    }else{
      setUserComplain({
        ...userComplain,
        [name]: value
      });
    }

  };

  const submithandler = async (e) => {
    e.preventDefault();
    console.log("submit", userComplain);

    try{

        const response = fetch('https://complain-backend.onrender.com/complain' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userComplain)
        }
        )

    
    if (!response.ok) {
        // Handle non-2xx HTTP responses
        alert( "Comaplain Submitted Successfully" );
        return;
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    alert( "Registration successful" );

    }catch(e){
        console.log(e)
    }

  };


  return (
    <div className="complain-container">
      <div className="complain-card fade-in">
        <h1 className="complain-title">Complain Portal</h1>
        <form className="complain-form" onSubmit={submithandler}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="username">Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                id="username"
                onChange={handleChange}
                value={userComplain.name}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                className="form-input"
                type="text"
                name="phone"
                id="phone"
                onChange={handleChange}
                value={userComplain.phone}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={userComplain.email}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="desciption">Description</label>
            <input
              className="form-input"
              type="text"
              name="desciption"
              id="desciption"
              onChange={handleChange}
              value={userComplain.description}
              placeholder="Describe your complaint in detail"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="image">Upload Image (Optional)</label>
            <div className="file-input">
              <input
                type="file"
                name="image"
                accept="image/*"
                id="image"
                onChange={handleChange}
              />
              <label className="file-input-label" htmlFor="image">
                📷 Choose Image File
              </label>
            </div>
          </div>

          <button className="submit-btn" type="submit">
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplainPortal;
