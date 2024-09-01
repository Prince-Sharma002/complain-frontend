import React, { useEffect, useState } from 'react';


const Dashboard = () => {
    const [data, setData] = useState([]);

    const getdata = async () => {
        try {
            const response = await fetch('http://localhost:5000/getdata', {
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

    const sendEmail = async(email)=>{
        
    try{

        const response = fetch('http://localhost:5000/sendemail' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({to : email , subject : "Leakage data get" , text : "thanks for email sent" })
        }
        )

    
    if (!response.ok) {
        // Handle non-2xx HTTP responses
        alert( "cant sent" );
        return;
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    alert( "sent successful" );

    }catch(e){
        console.log(e)
    }
    }


    const deleteComapain = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/getdata/delete/${id}`, {
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
        <div>
            <h1>Data Dashboard</h1>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Address</th>
                        <th>Image</th>
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
                            <td>{item.image}</td>
                            <td>{item.phone}</td>
                            <td>{item.email}</td>
                            <td> <button onClick={ ()=>  deleteComapain(item._id)}> DELETE </button> </td>
                            <td> <button onClick={() =>  sendEmail(item.email)}> Send Email </button> </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
