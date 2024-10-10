// import React, { useEffect, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import { Link, NavLink, Navigate } from "react-router-dom";

// mapboxgl.accessToken = "pk.eyJ1IjoiYWlzaGNoYW1hcnRoaSIsImEiOiJjbHB1Yjk2djcwajBlMmluenJvdGlucG54In0.1nBG1ilIoMJlD1xJ4mzIoA";

// const AdminPortal = () => {
//   const [data, setData] = useState([]);
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/getdata', {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json"
//           }
//         });

//         if (!response.ok) {
//           console.log("Error fetching data");
//           return;
//         }

//         const responseData = await response.json();
//         console.log(responseData);

//         // Create features array from responseData
//         const features = responseData.map(item => ({
//           type: "Feature",
//           properties: {
//             description: `<strong>SensorId: ${item._id} <br>Status: ${item.desciption} <br> Coordinates: ${item.address.join(', ')} </strong>`,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: item.address,
//           },
//         }));

//         const map = new mapboxgl.Map({
//           container: "map",
//           style: "mapbox://styles/mapbox/streets-v12",
//           center: [77.2315, 28.6519],
//           zoom: 5,
//         });

//         map.on("load", () => {
//           map.addSource("places", {
//             type: "geojson",
//             data: {
//               type: "FeatureCollection",
//               features: features,
//             },
//           });

//           map.addLayer({
//             id: "places",
//             type: "circle",
//             source: "places",
//             paint: {
//               "circle-color": "#4264fb",
//               "circle-radius": 6,
//               "circle-stroke-width": 2,
//               "circle-stroke-color": "#ffffff",
//             },
//           });

//           const popup = new mapboxgl.Popup({
//             closeButton: false,
//             closeOnClick: false,
//           });

//           map.on("mouseenter", "places", (e) => {
//             map.getCanvas().style.cursor = "pointer";
//             const coordinates = e.features[0].geometry.coordinates.slice();
//             const description = e.features[0].properties.description;
//             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//               coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//             }
//             popup.setLngLat(coordinates).setHTML(description).addTo(map);
//           });

//           map.on("mouseleave", "places", () => {
//             map.getCanvas().style.cursor = "";
//             popup.remove();
//           });
//         });
        
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     getData();
//   }, []);

//   return (
//     <div id="mapDiv">
//       <div id="map" style={{ width: "100%", height: "900px" }}></div>
//       <div id="sidebar"></div>
//       <button> <NavLink to={"/dashboard"}> dashboard </NavLink> </button>
//     </div>
//   );
// };

// export default AdminPortal;



// import React, { useEffect, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import { NavLink } from "react-router-dom";

// mapboxgl.accessToken = "pk.eyJ1IjoiYWlzaGNoYW1hcnRoaSIsImEiOiJjbHB1Yjk2djcwajBlMmluenJvdGlucG54In0.1nBG1ilIoMJlD1xJ4mzIoA";

// const AdminPortal = () => {
//   const [data, setData] = useState([]);
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/getdata', {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json"
//           }
//         });

//         if (!response.ok) {
//           console.log("Error fetching data");
//           return;
//         }

//         const responseData = await response.json();
//         setData( responseData );
//         console.log(responseData);

//         const features = responseData.map(item => ({
//           type: "Feature",
//           properties: {
//             description: `
//               <strong>SensorId: ${item._id}</strong><br>
//               <strong>Status: ${item.desciption}</strong><br>
//               <strong>User: ${item.user}</strong><br>
//               <strong>Coordinates: ${item.address.join(', ')}</strong>
//             `,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: item.address,
//           },
//         }));

//         const map = new mapboxgl.Map({
//           container: "map",
//           style: "mapbox://styles/mapbox/streets-v12",
//           center: [77.2315, 28.6519],
//           zoom: 5,
//         });

//         map.on("load", () => {
//           map.addSource("places", {
//             type: "geojson",
//             data: {
//               type: "FeatureCollection",
//               features: features,
//             },
//           });

//           map.addLayer({
//             id: "places",
//             type: "circle",
//             source: "places",
//             paint: {
//               "circle-color": "#4264fb",
//               "circle-radius": 6,
//               "circle-stroke-width": 2,
//               "circle-stroke-color": "#ffffff",
//             },
//           });

//           const popup = new mapboxgl.Popup({
//             closeButton: false,
//             closeOnClick: false,
//           });

//           map.on("mouseenter", "places", (e) => {
//             map.getCanvas().style.cursor = "pointer";
//             const coordinates = e.features[0].geometry.coordinates.slice();
//             const description = e.features[0].properties.description;
//             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//               coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//             }
//             popup.setLngLat(coordinates).setHTML(description).addTo(map);
//           });

//           map.on("mouseleave", "places", () => {
//             map.getCanvas().style.cursor = "";
//             popup.remove();
//           });
//         });
        
//       } catch (e) {
//         console.log(e);
//       }
//     };

//     getData();
//   }, []);

//   return (
//     <div id="mapDiv">
//       <button style={{ position : "absolute" , right : "2rem" , top : "3rem" }}> <NavLink style={{color : "white", textDecoration : "none" }} to={"/dashboard"}> Dashboard </NavLink> </button>
//       <div id="map" style={{ width: "100%", height: "900px" }}></div>
//       <div id="sidebar"></div>
//     </div>
//   );
// };

// export default AdminPortal;

import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { NavLink } from "react-router-dom";

mapboxgl.accessToken = "pk.eyJ1IjoiYWlzaGNoYW1hcnRoaSIsImEiOiJjbHB1Yjk2djcwajBlMmluenJvdGlucG54In0.1nBG1ilIoMJlD1xJ4mzIoA";

const AdminPortal = () => {
  const [data, setData] = useState([]);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null); // Track if map has been initialized
  const popupRef = useRef(null); // Reference to the popup element

  useEffect(() => {
    const getData = async () => {
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
        console.log(responseData);

        const features = responseData.map(item => ({
          type: "Feature",
          properties: {
            description: `
              <strong>Pid:</strong> ${item._id}<br>
              <strong>Name: </strong> ${item.name}<br>
              <strong>Coordinates: </strong> ${item.address.join(', ')}<br>
              <strong>Phone: </strong> ${item.phone}<br>
              <strong>Email: </strong> ${item.email}<br>
              <strong>Description: </strong> ${item.desciption}<br>
              `,
          },
          geometry: {
            type: "Point",
            coordinates: item.address,
          },
        }));

        if (!mapInstanceRef.current) {
          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [77.2315, 28.6519],
            zoom: 5,
          });

          map.on("load", () => {
            map.addSource("places", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features,
              },
            });

            map.addLayer({
              id: "places",
              type: "circle",
              source: "places",
              paint: {
                "circle-color": "#4264fb",
                "circle-radius": 6,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              },
            });

            map.on("mouseenter", "places", (e) => {
              map.getCanvas().style.cursor = "pointer";
              const description = e.features[0].properties.description;

              // Set the content of the popup element
              if (popupRef.current) {
                popupRef.current.innerHTML = description;
                popupRef.current.style.display = "block";
              }
            });

            map.on("mouseleave", "places", () => {
              map.getCanvas().style.cursor = "";
              if (popupRef.current) {
                popupRef.current.style.display = "none";
              }
            });

            mapInstanceRef.current = map; // Store the map instance
          });
        }
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  return (
    <div id="mapDiv">
      <button style={{ position: "absolute", right: "2rem", top: "3rem" }}>
        <NavLink style={{ color: "white", textDecoration: "none" }} to={"/dashboard"}>Dashboard</NavLink>
      </button>
      <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "900px" }}></div>
      <div id="sidebar"></div>
      <div 
        ref={popupRef} 
        style={{
          position: "fixed",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          display: "none",
          zIndex: 1000,
        }}
      ></div>
    </div>
  );
};

export default AdminPortal;

