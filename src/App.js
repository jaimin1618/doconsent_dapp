import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Upload from "./components/Upload";
import ShowData from "./components/ShowData";
import GiveConsent from "./components/GiveConsent";
import VerifierStatus from "./components/VerifierStatus";
import MakeRequest from "./components/MakeRequest";
import IssuerRequests from "./components/IssuerRequests";
import FulfilledRequests from "./components/FulfilledRequests";
import VerifyAccessData from "./components/VerifyAccessData";
import Main from "./components/Main";
import CheckRevokeConsent from "./components/CheckRevokeConsent";

import { ROLES } from "./constants";
import Contract from "../src/components/utilities/contract/contract";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [role, setRole] = useState(ROLES.HOLDER);
  const [userAccount, setUserAccount] = useState("");

  useEffect(() => {
    const setUserRole = async () => {
      const user_address = await Contract.getAddress();
      setUserAccount(userAccount);
      const isIssuer = await Contract.isCurrentUserIssuer(user_address);
      isIssuer ? setRole(ROLES.ISSUER) : setRole(ROLES.HOLDER);
    };
    setUserRole();
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
          <Route path="/remoke_consent" element={<CheckRevokeConsent />} />
          <Route path="/verifier_status" element={<VerifierStatus />} />

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
