import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

import ShowData from "./components/ShowData";
import GiveConsent from "./components/GiveConsent";
import VerifierStatus from "./components/VerifierStatus";
import MakeRequest from "./components/MakeRequest";
import IssuerRequests from "./components/IssuerRequests";
import FulfilledRequests from "./components/FulfilledRequests";
import VerifyAccessData from "./components/VerifyAccessData";
import Main from "./components/Main";
import CheckRevokeConsent from "./components/CheckRevokeConsent";
import PageNotFound from "./components/PageNotFound";

import { ROLES } from "./constants";
import Contract from "../src/components/utilities/contract/contract";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FileUpload from "./components/FileUpload";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import CreateRevokeIssuer from "./components/CreateRevokeIssuer";

const App = () => {
  const [role, setRole] = useState(ROLES.HOLDER);
  const [userAccount, setUserAccount] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const setUserRole = async () => {
      const user_address = await Contract.getAddress();
      setUserAccount(user_address);
      const isIssuer = await Contract.isCurrentUserIssuer(user_address);
      const contractAdmin = process.env.REACT_APP_CONTRACT_OWNER;

      if (user_address === contractAdmin) {
        setRole(ROLES.ADMIN);
      } else if (isIssuer) {
        setRole(ROLES.ISSUER);
      } else {
        setRole(ROLES.HOLDER);
      }
    };
    setUserRole();

    async function onAccountChange() {
      window.ethereum.on("accountsChanged", async function () {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setUserAccount(accounts[0]);
        setUserRole();
        window.location.href = "/";
      });
    }
    onAccountChange();
  }, []);

  return (
    <Router>
      <div className="">
        <Navbar  user_role={role}/>
        <ToastContainer />

        <div className="flex">
         
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Main />} />

              {/* HOLDER Routes  */}
              {role === ROLES.HOLDER ? (
                <>
                  <Route path="/table" element={<Table />} />
                  <Route path="/mydata" element={<ShowData />} />
                  <Route path="/issuer_requests" element={<IssuerRequests />} />
                  <Route path="/give_consent" element={<GiveConsent />} />
                  <Route
                    path="/revoke_consent"
                    element={<CheckRevokeConsent />}
                  />
                  <Route path="/verifier_status" element={<VerifierStatus />} />
                  <Route path="/document_upload" element={<FileUpload />} />
                </>
              ) : (
                <>
                  {/* ISSUER Routes  */}

                  <Route
                    path="/my_permissioned_data/:request_id"
                    element={<VerifyAccessData />}
                  />
                  <Route path="/make_request" element={<MakeRequest />} />
                  <Route
                    path="/fulfilled_requests"
                    element={<FulfilledRequests />}
                  />
                  <Route
                    path="/create_remove_issuer"
                    element={<CreateRevokeIssuer />}
                  />
                  <Route path="/*" element={<PageNotFound />} />
                </>
              )}
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
