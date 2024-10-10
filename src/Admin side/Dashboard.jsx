import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";

const Dashboard = () => {
    const [data, setData] = useState([]);

    const getdata = async () => {
        try {
            const response = await fetch('https://complain-backend.onrender.com/getdata', {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.log("Error fetching data");
                return;
            }

            const responseData = await response.json();
            setData(responseData); // Corrected here
            console.log("data", responseData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const sendEmail = async(email , id , progress)=>{
    try{
        const response = fetch('https://complain-backend.onrender.com/sendemail' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({to : email , subject : "Complain Alert" , text : `Your complain is regsitered! your pid is : ${id}` })
        }
    )

    
    if (!response.ok) {
        // Handle non-2xx HTTP responses
        alert( "email sent" );
        const newProgress = progress + 1;
        updateProgress(id, newProgress);
        return;
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    alert( "sent successful" );

    }catch(e){
        console.log(e)
    }
    }

    const updateProgress = async (id, newProgress) => {
        try {
          const response = await fetch('https://complain-backend.onrender.com/updateprogress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id :  id, progress: newProgress }),
          });
      
          if (!response.ok) {
            const errorData = await response.json(); 
            console.error(`Failed to update progress: ${response.status} - ${response.statusText}`, errorData);
        
            return;
          }
      
          const data = await response.json();
          console.log("Progress updated:", data);
      
        } catch (e) {
          console.error("Error updating progress:", e);

        }
      };


    const deleteComapain = async (id) => {
        try {
            const response = await fetch(`https://complain-backend.onrender.com/getdata/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }) 

            if( response.ok){
                getdata();
            }

        }
        catch(err){
            console.log(err)
        }
    }

    return (
        <div style={{display : "flex" , flexDirection: "column" , padding : "2rem"   }}>
            <button style={{ position : "absolute" , right : "2rem" , top : "3rem" }}> <NavLink style={{color : "white", textDecoration : "none" }} to={"/admin"}> Admin Map </NavLink> </button>

            <h1 style={{textAlign : "center"}}>Data Dashboard</h1>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Address</th>
                        {/* <th>Image</th> */}
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Delete</th>
                        <th>Sent</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.desciption}</td>
                            <td>{item.address.join(', ')}</td>
                            {/* <td>{item.image}</td> */}
                            <td>{item.phone}</td>
                            <td>{item.email}</td>
                            <td> <button style={{width : "100%" , height : "100%"}} onClick={ ()=>  deleteComapain(item._id)}> DELETE </button> </td>
                            <td> <button style={{width : "100%" , height : "100%"}} onClick={() =>  sendEmail(item.email , item._id , item.progress )}> Send Email </button> </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;



