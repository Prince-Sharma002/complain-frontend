import React from "react";
import AdminPortal from "./Admin side/AdminPortal";
import ComplainPortal from "./components/ComplainPortal";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { } from "react-router-dom";
import Dashboard from "./Admin side/Dashboard";
import Progress from "./Admin side/Progress";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComplainPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
