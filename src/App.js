import React from "react";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Requests from "./components/Requests";
import Upload from "./components/Upload";
import ShowData from "./components/ShowData";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/upload" element={<Upload />} />
          {/* <Route path="/read" element={<Read />} /> */}
          <Route path="/read" element={<ShowData />} />
          <Route path="/requests" element={<Requests />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
