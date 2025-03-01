import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Navbar from "./Components/Navbar";
import AddDevice from "./Pages/AddDevice";

export default function Design() {
  return (
    <div>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/device" element={<AddDevice />} />
        </Routes>
      </Router>
    </div>
  );
}
