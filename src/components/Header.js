import React, { useState, useEffect } from "react";
import Logo from "../media/Logo.png";
import { ROLES } from "../constants";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router";

const Header = ({ user_role }) => {
  const [navigation, setNavigation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const holderNavigation = [
      { path: "document_upload", linkName: "Upload document" },
      { path: "mydata", linkName: "My Data" },
      { path: "issuer_requests", linkName: "Issuer requests" },
      { path: "give_consent", linkName: "Give consent" },
      { path: "remoke_consent", linkName: "Check/Revoke consent" },
    ];

    const issuerNavigation = [
      { path: "make_request", linkName: "Make Request" },
      { path: "fulfilled_requests", linkName: "Requests" },
      { path: "my_permissioned_data", linkName: "Permissioned data" },
      // { path: "validate_data", linkName: "Validate-Data" },
    ];

    user_role === ROLES.ISSUER
      ? setNavigation(issuerNavigation)
      : setNavigation(holderNavigation);
  }, [user_role]);

  return (
    <header className="z-10 header w-full sticky top-0 bg-sky-800 text-white shadow-sm flex items-center justify-between px-8 py-02">
      <h1 onClick={() => navigate("/")} className="w-4/12 mx-5">
        <button className="w-full">
          <img className="bg-white rounded-md m-2" src={Logo} />
        </button>
      </h1>

      <nav className="nav font-semibold text-sm underline underline-offset-4">
        <ul className="flex items-center">
          {navigation.map((el, index) => (
            <li
              onClick={() => navigate(el.path)}
              key={index}
              className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer"
            >
              <a>{el.linkName}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="w-3/12 flex justify-end items-center">
        <a
          href="verifier_status"
          className="text-lg font-bold flex items-center px-5"
        >
          {user_role === ROLES.ISSUER ? (
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
