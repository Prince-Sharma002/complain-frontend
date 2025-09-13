import React, { useState , useEffect } from 'react';
import '../styles/userComplain.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const ComplainPortal = () => {
  const [userComplain, setUserComplain] = useState({
    name: "",
    description: "",
    address: [],
    image: null,
    phone: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState("");


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
    const { name, value, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setUserComplain({
        ...userComplain,
        [name]: file
      });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUserComplain({
        ...userComplain,
        [name]: value
      });
    }
  };

  const submithandler = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', userComplain.name);
      formData.append('description', userComplain.description);
      formData.append('address', JSON.stringify(userComplain.address));
      formData.append('phone', userComplain.phone);
      formData.append('email', userComplain.email);
      
      if (userComplain.image) {
        formData.append('image', userComplain.image);
      }

      const response = await fetch('https://complain-backend.onrender.com/complain', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the correct boundary
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit complaint');
      }
      
      console.log("Response data:", data);
      alert("Complaint submitted successfully!");
      
      // Reset form
      setUserComplain({
        name: "",
        description: "",
        address: [],
        image: null,
        phone: "",
        email: "",
      });
      setPreviewImage("");
      
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert(error.message || "Failed to submit complaint. Please try again.");
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
                value={userComplain.name}
                onChange={handleChange}
                placeholder="Enter your name"
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
            <label className="form-label" htmlFor="description">Description</label>
            <input
              className="form-input"
              type="text"
              name="description"
              id="description"
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

