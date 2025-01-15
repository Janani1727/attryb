import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MarketPlace from "../pages/MarketPlace";
import Oem from "../pages/Oem";
import Authentication from "../pages/Authentication";
import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component

const AllRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MarketPlace />} /> {/* Public route for the marketplace */}
      <Route path="/auth" element={<Authentication   />} />
      {/* Authentication route */}
      {/* <Route path="/auth" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} /> Only authentication */}

      {/* Private routes */}
      <Route
        path="/oem"
        element={
          // <PrivateRoute isAuthenticated={isAuthenticated}>
            <Oem />
          // </PrivateRoute>
        }
      />
      
      {/* Another private route */}
      <Route
        path="/market"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <MarketPlace />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
