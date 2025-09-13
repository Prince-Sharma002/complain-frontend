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

  // Add event listeners for popup interactions
  useEffect(() => {
    // Handle image clicks
    const handleImageClick = (e) => {
      // Open image in new tab
      window.open(e.detail, '_blank');
    };

    // Handle close button clicks
    const handleClosePopup = (e) => {
      e.stopPropagation();
      if (popupRef.current) {
        popupRef.current.classList.remove('show');
      }
    };

    // Close popup when clicking outside
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        popupRef.current.classList.remove('show');
      }
    };

    document.addEventListener('imageClick', handleImageClick);
    document.addEventListener('closePopup', handleClosePopup);
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('imageClick', handleImageClick);
      document.removeEventListener('closePopup', handleClosePopup);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
              <div class="popup-content-inner">
                <div class="popup-header">
                  <h4>Complaint Details</h4>
                  <button class="popup-close" onclick="document.dispatchEvent(new CustomEvent('closePopup'))">
                    &times;
                  </button>
                </div>
                <div class="popup-body">
                  <p><strong>Pid:</strong> ${item._id}</p>
                  <p><strong>Name:</strong> ${item.name}</p>
                  <p><strong>Coordinates:</strong> ${item.address.join(', ')}</p>
                  <p><strong>Phone:</strong> ${item.phone}</p>
                  <p><strong>Email:</strong> ${item.email}</p>
                  <p><strong>Description:</strong> ${item.description || item.desciption || 'No description provided'}</p>
                </div>
              </div>
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

            // Click event for markers
            map.on('click', 'places', (e) => {
              map.getCanvas().style.cursor = 'pointer';
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              // Close popup if already open
              if (popupRef.current) {
                popupRef.current.classList.remove('show');
              }

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Set the content of the popup element
              if (popupRef.current) {
                const contentDiv = popupRef.current.querySelector('.popup-content');
                if (contentDiv) {
                  contentDiv.innerHTML = description;
                }
                
                // Position the popup above the marker
                const popup = popupRef.current;
                popup.style.display = 'block';
                const popupWidth = popup.offsetWidth;
                const popupHeight = popup.offsetHeight;
                
                // Get the pixel coordinates of the marker
                const point = map.project(coordinates);
                const mapContainer = mapContainerRef.current.getBoundingClientRect();
                
                // Calculate the top position to place the popup above the marker
                const top = point.y - popupHeight - 15; // 15px above the marker
                
                // Center the popup horizontally relative to the marker
                const left = point.x - (popupWidth / 2);
                
                // Ensure popup stays within map bounds
                const adjustedLeft = Math.max(10, Math.min(left, mapContainer.width - popupWidth - 10));
                const adjustedTop = Math.max(10, top);
                
                popup.style.left = `${adjustedLeft}px`;
                popup.style.top = `${adjustedTop}px`;
                popup.classList.add('show');
              }
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'places', () => {
              map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'places', () => {
              map.getCanvas().style.cursor = '';
            });

            // Close popup when clicking on the map
            map.on('click', (e) => {
              if (e.originalEvent && e.originalEvent.target === map.getCanvas()) {
                if (popupRef.current) {
                  popupRef.current.classList.remove('show');
                }
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

  // State for image modal
  const [modalImage, setModalImage] = useState(null);

  // Function to handle image click
  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Function to close modal
  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Close modal when clicking outside the image
  const handleModalClick = (e) => {
    if (e.target.classList.contains('image-modal')) {
      closeModal();
    }
  };

  // Add event listener for escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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

      {/* Image Modal */}
      <div 
        className={`image-modal ${modalImage ? 'show' : ''}`}
        onClick={handleModalClick}
      >
        {modalImage && (
          <>
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <img 
              src={modalImage} 
              alt="Full size complaint" 
              className="modal-image"
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;