import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import '../styles/Dashboard.css';

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
        <div className="dashboard-container">
            <div className="dashboard-nav">
                <NavLink className="nav-btn" to="/admin">
                    🗺️ Admin Map
                </NavLink>
            </div>

            <div className="dashboard-header fade-in">
                <h1 className="dashboard-title">Data Dashboard</h1>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-number">{data.length}</div>
                    <div className="stat-label">Total Complaints</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{data.filter(item => item.progress >= 2).length}</div>
                    <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{data.filter(item => item.progress >= 4).length}</div>
                    <div className="stat-label">Resolved</div>
                </div>
            </div>

            <div className="dashboard-table-container fade-in">
                {data.length > 0 ? (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className="data-cell name">{item.name}</td>
                                    <td className="data-cell description" title={item.desciption}>{item.desciption}</td>
                                    <td className="data-cell address">{item.address.join(', ')}</td>
                                    <td className="data-cell contact">{item.phone}</td>
                                    <td className="data-cell contact">{item.email}</td>
                                    <td>
                                        <button 
                                            className="action-btn btn-email" 
                                            onClick={() => sendEmail(item.email, item._id, item.progress)}
                                        >
                                            📧 Send Email
                                        </button>
                                        <button 
                                            className="action-btn btn-delete" 
                                            onClick={() => deleteComapain(item._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <div className="empty-message">No complaints found</div>
                        <div className="empty-subtitle">Complaints will appear here when users submit them</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;



