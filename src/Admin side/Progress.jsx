import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Progress.css';

const Progress = () => {
    const [data, setData] = useState([]);
    const [pid, setPid] = useState(''); // State to store user input
    const [progress, setProgress] = useState(null); // State to store the progress for the given PID

    //  https://complain-backend.onrender.com/getdata
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
            setData(responseData);
            console.log("data", responseData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    // Function to handle input change
    const handleInputChange = (e) => {
        setPid(e.target.value);
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedData = data.find(item => item._id === pid);
        if (selectedData) {
            setProgress(selectedData.progress);
        } else {
            setProgress(null); // Reset progress if PID is not found
        }
    };


    return (
        <div className="progress-container">
            <div className="progress-nav">
                <NavLink className="nav-btn" to="/">
                    🏠 Complain Portal
                </NavLink>
            </div>

            <div className="progress-card fade-in">
                <h2 className="progress-title">Progress Tracker</h2>
                
                <form className="search-form" onSubmit={handleSubmit}>
                    <input
                        className="search-input"
                        type="text"
                        value={pid}
                        onChange={handleInputChange}
                        placeholder="Enter your PID to track progress"
                        required
                    />
                    <button className="search-btn" type="submit">
                        🔍 Check Progress
                    </button>
                </form>

                {progress !== null ? (
                    <div className="progress-bar-container">
                        <div className="progress-stages">
                            <div className="progress-line">
                                <div 
                                    className="progress-line-fill" 
                                    style={{ width: `${(progress / 4) * 100}%` }}
                                ></div>
                            </div>
                            
                            <div className={`progress-stage ${progress >= 1 ? 'completed' : ''} ${progress === 1 ? 'current' : ''}`}>
                                <div className="stage-icon">{progress >= 1 ? '✓' : '1'}</div>
                                <div className={`stage-label ${progress >= 1 ? 'completed' : ''}`}>Complaint Sent</div>
                            </div>
                            
                            <div className={`progress-stage ${progress >= 2 ? 'completed' : ''} ${progress === 2 ? 'current' : ''}`}>
                                <div className="stage-icon">{progress >= 2 ? '✓' : '2'}</div>
                                <div className={`stage-label ${progress >= 2 ? 'completed' : ''}`}>Complaint Accepted</div>
                            </div>
                            
                            <div className={`progress-stage ${progress >= 3 ? 'completed' : ''} ${progress === 3 ? 'current' : ''}`}>
                                <div className="stage-icon">{progress >= 3 ? '✓' : '3'}</div>
                                <div className={`stage-label ${progress >= 3 ? 'completed' : ''}`}>In Progress</div>
                            </div>
                            
                            <div className={`progress-stage ${progress >= 4 ? 'completed' : ''} ${progress === 4 ? 'current' : ''}`}>
                                <div className="stage-icon">{progress >= 4 ? '✓' : '4'}</div>
                                <div className={`stage-label ${progress >= 4 ? 'completed' : ''}`}>Resolved</div>
                            </div>
                        </div>

                        <div className="progress-details">
                            <h3>📄 Complaint Details</h3>
                            {data.find(item => item._id === pid) && (
                                <>
                                    <div className="detail-item">
                                        <span className="detail-label">PID:</span>
                                        <span className="detail-value">{pid}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status:</span>
                                        <span className="detail-value">
                                            {progress === 1 && 'Sent'}
                                            {progress === 2 && 'Accepted'}
                                            {progress === 3 && 'In Progress'}
                                            {progress === 4 && 'Resolved'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Progress:</span>
                                        <span className="detail-value">{progress}/4 stages completed</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : pid && (
                    <div className="no-progress">
                        <div className="no-progress-icon">🔍</div>
                        <div className="no-progress-message">No complaint found</div>
                        <div className="no-progress-subtitle">Please check your PID and try again</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Progress;

