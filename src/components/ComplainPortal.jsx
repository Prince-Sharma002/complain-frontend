import React, { useState , useEffect } from 'react';
import '../styles/userComplain.css';
import axios from 'axios';

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

        const response = fetch('http://localhost:5000/complain' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userComplain)
        }
        )

    
    if (!response.ok) {
        // Handle non-2xx HTTP responses
        alert( "unable to register" );
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
    <div className="container">
      <form onSubmit={submithandler}>
        <label htmlFor="username">Name</label>
        <input
          type="text"
          name="name"
          id="username"
          onChange={handleChange}
          value={userComplain.name}
        />

        <label htmlFor="desciption">Description</label>
        <input
          type="text"
          name="desciption"
          id="desciption"
          onChange={handleChange}
          value={userComplain.description}
        />

        <label htmlFor="image">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          id="image"
          onChange={handleChange}
   
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          onChange={handleChange}
          value={userComplain.phone}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChange}
          value={userComplain.email}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ComplainPortal;
