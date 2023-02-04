import React, { useState, useEffect } from "react";
import Logo from "../media/Logo.png";
import { ROLES } from "../constants";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import Contract from "./utilities/contract/contract";

const Header = ({ user_role }) => {
  const [navigation, setNavigation] = useState([]);
  const holderNavigation = [
    { path: "upload", linkName: "Upload" },
    { path: "mydata", linkName: "MyData" },
    { path: "issuer_requests", linkName: "Issuer-Requests" },
    { path: "give_consent", linkName: "Give-Consent" },
    { path: "remoke_consent", linkName: "Revoke-Consent" },
  ];

  const issuerNavigation = [
    { path: "make_request", linkName: "Make-Request" },
    { path: "fulfilled_requests", linkName: "Fulfilled-Requests" },
    { path: "my_permissioned_data", linkName: "Access-Data" },
    // { path: "validate_data", linkName: "Validate-Data" },
  ];

  useEffect(() => {
    user_role == ROLES.ISSUER
      ? setNavigation(issuerNavigation)
      : setNavigation(holderNavigation);
  }, [user_role]);

  return (
    <header className="header sticky top-0 bg-sky-800 text-white shadow-sm flex items-center justify-between px-8 py-02">
      <h1 className="w-3/12">
        <a href="/">
          <img className="bg-white rounded-md m-2" src={Logo} />
        </a>
      </h1>

      <nav className="nav font-semibold text-sm">
        <ul className="flex items-center">
          {navigation.map((el, index) => (
            <li
              key={index}
              className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer"
            >
              <a href={el.path}>{el.linkName}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="w-3/12 flex justify-end items-center">
        <a
          href="verifier_status"
          className="text-lg font-bold flex items-center px-5"
        >
          {user_role == ROLES.ISSUER ? (
            <AdminPanelSettingsIcon className="mx-1" />
          ) : (
            <PersonIcon className="mx-1" />
          )}
          <p>{user_role}</p>
        </a>
      </div>
    </header>
  );
};

export default Header;
