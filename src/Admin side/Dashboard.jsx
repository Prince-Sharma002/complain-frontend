import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    
    const getStatusText = (progress) => {
        switch(progress) {
            case 1: return 'New';
            case 2: return 'In Progress';
            case 3: return 'Under Review';
            case 4: return 'Resolved';
            default: return 'Pending';
        }
    };

    const getdata = async () => {
        try {
            const response = await fetch('http://localhost:4000/getdata', {
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
        const response = fetch('http://localhost:4000/sendemail' , {
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
          const response = await fetch('http://localhost:4000/updateprogress', {
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
            const response = await fetch(`http://localhost:4000/getdata/delete/${id}`, {
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
                                <th>Email</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((complaint) => (
                                <tr key={complaint._id}>
                                    <td>{complaint.name}</td>
                                    <td>{complaint.email || 'N/A'}</td>
                                    <td>{complaint.description || complaint.desciption || 'No description'}</td>
                                    <td>
                                        {complaint.image && (
                                            <div className="complaint-image">
                                                <img 
                                                    src={complaint.image.startsWith('http') ? complaint.image : `http://localhost:4000${complaint.image}`} 
                                                    alt="Complaint evidence"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const imageUrl = complaint.image.startsWith('http') 
                                                            ? complaint.image 
                                                            : `http://localhost:4000${complaint.image}`;
                                                        window.open(imageUrl, '_blank');
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/100?text=Image+Not+Found';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${
                                            complaint.progress === 1 ? 'status-new' :
                                            complaint.progress === 2 ? 'status-in-progress' :
                                            complaint.progress === 3 ? 'status-under-review' :
                                            'status-resolved'
                                        }`}>
                                            {getStatusText(complaint.progress)}
                                        </span>
                                    </td>
                                    <td className="action-buttons">
                                        <button 
                                            onClick={() => sendEmail(complaint.email, complaint._id, complaint.progress)}
                                            disabled={complaint.progress > 1}
                                            className="action-btn email-btn"
                                        >
                                            ✉️
                                        </button>
                                        <button 
                                            onClick={() => deleteComapain(complaint._id)}
                                            className="action-btn delete-btn"
                                        >
                                            🗑️
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



