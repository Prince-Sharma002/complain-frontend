import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Progress = () => {
    const [data, setData] = useState([]);
    const [pid, setPid] = useState(''); // State to store user input
    const [progress, setProgress] = useState(null); // State to store the progress for the given PID

    //  https://complain-backend.onrender.com/getdata
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

    // Inline styles for the progress bar
    const progressBarStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px'
    };

    const stageStyle = (isCompleted) => ({
        padding: '10px 20px',
        backgroundColor: isCompleted ? 'green' : 'lightgray',
        borderRadius: '5px',
        color: isCompleted ? 'white' : 'black',
        textAlign: 'center',
        flex: 1,
        margin: '0 5px'
    });

    return (
        <div style={{padding:"10rem"}}>
                <button style={{ position: "absolute", right: "2rem", top: "3rem" }}>

                    <NavLink style={{ color: "white", textDecoration: "none" }} to={"/"}>Complain Portal</NavLink>
                </button>
            <h2 style={{textAlign : "center"}}>Progress Tracker</h2>
            <form onSubmit={handleSubmit} style={{ display : "flex" , alignItems : "center"}}>
                <input
                    type="text"
                    value={pid}
                    onChange={handleInputChange}
                    placeholder="Enter your PID"
                    style={{width : "50%" , textAlign : "center"  }}
                />
                <button type="submit">Check Progress</button>
            </form>

            {progress !== null && (
                <div style={progressBarStyle}>
                    <div style={stageStyle(progress >= 1)}>
                        Complain Sent
                    </div>
                    <div style={stageStyle(progress >= 2)}>
                        Complain Accept
                    </div>
                    <div style={stageStyle(progress >= 3)}>
                        In Progress
                    </div>
                    <div style={stageStyle(progress >= 4)}>
                        Resolved
                    </div>
                </div>
            )}
        </div>
    );
}

export default Progress;

