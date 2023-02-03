import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Upload from "./components/Upload";
import ShowData from "./components/ShowData";
import GiveConsent from "./components/GiveConsent";

import { ROLES } from "./constants";
import Contract from "../src/components/utilities/contract/contract";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MakeRequest from "./components/MakeRequest";
import IssuerRequests from "./components/IssuerRequests";
import FulfilledRequests from "./components/FulfilledRequests";
import VerifyAccessData from "./components/VerifyAccessData";
import Main from "./components/Main";

const App = () => {
  const [role, setRole] = useState(ROLES.HOLDER);

  useEffect(() => {
    const get_address = async () => {
      const user_address = await Contract.getAddress();

      const isIssuer = await Contract.isCurrentUserIssuer(user_address);
      isIssuer ? setRole(ROLES.ISSUER) : setRole(ROLES.HOLDER);
    };
    get_address();
  }, []);

  return (
    <Router>
      <div>
        <Header user_role={role} />
        <ToastContainer />
        <Routes>
          {/* HOLDER Routes  */}
          <Route path="/" element={<Main />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/mydata" element={<ShowData />} />
          <Route path="/issuer_requests" element={<IssuerRequests />} />
          <Route path="/give_consent" element={<GiveConsent />} />

          {/* ISSUER Routes  */}
          <Route path="/my_permissioned_data" element={<VerifyAccessData />} />
          <Route path="/make_request" element={<MakeRequest />} />
          <Route path="/fulfilled_requests" element={<FulfilledRequests />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
