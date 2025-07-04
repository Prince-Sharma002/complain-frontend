import React from "react";
import AdminPortal from "./Admin side/AdminPortal";
import ComplainPortal from "./components/ComplainPortal";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Admin side/Dashboard";
import Progress from "./Admin side/Progress";

// Component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/admin'; // Hide navbar on admin map page
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ComplainPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
