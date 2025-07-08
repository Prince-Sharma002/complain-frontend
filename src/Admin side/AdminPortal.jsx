import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { NavLink } from "react-router-dom";
import '../styles/AdminPortal.css';

mapboxgl.accessToken = "pk.eyJ1IjoiYWlzaGNoYW1hcnRoaSIsImEiOiJjbHB1Yjk2djcwajBlMmluenJvdGlucG54In0.1nBG1ilIoMJlD1xJ4mzIoA";

const AdminPortal = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null); // Track if map has been initialized
  const popupRef = useRef(null); // Reference to the popup element

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('https://complain-backend.onrender.com/getdata', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          console.log("Error fetching data");
          setIsLoading(false);
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

        if (!mapInstanceRef.current && mapContainerRef.current) {
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
                const contentDiv = popupRef.current.querySelector('.popup-content');
                if (contentDiv) {
                  contentDiv.innerHTML = description;
                }
                popupRef.current.classList.add('show');
              }
            });

            map.on("mouseleave", "places", () => {
              map.getCanvas().style.cursor = "";
              if (popupRef.current) {
                popupRef.current.classList.remove('show');
              }
            });

            mapInstanceRef.current = map; // Store the map instance
            setIsLoading(false); // Hide loader once map is fully loaded
          });
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false); // Hide loader on error
      }
    };

    getData();

    // Cleanup function to remove map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="admin-portal-container">
      <div className="admin-header">
        <h1 className="admin-title">🗺️ Admin Portal - Live Complaints Map</h1>
        <NavLink className="admin-nav-btn" to="/dashboard">
          📋 Dashboard
        </NavLink>
      </div>
      
      <div className="map-container-wrapper">
        <div ref={mapContainerRef} className="admin-map"></div>
        
        {isLoading && (
          <div className="map-loader">
            <div className="loader-spinner"></div>
            <p>Loading map and complaint data...</p>
          </div>
        )}
      </div>
      
      <div className="map-legend">
        <div className="legend-title">Legend</div>
        <div className="legend-item">
          <div className="legend-color"></div>
          <span>Active Complaints</span>
        </div>
      </div>
      
      <div 
        ref={popupRef} 
        className="map-popup"
      >
        <div className="popup-content"></div>
      </div>
    </div>
  );
};

export default AdminPortal;