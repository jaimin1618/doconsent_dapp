import { useState, useEffect } from "react";
import "./styles/sidebar.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderIcon from "@mui/icons-material/Folder";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FlakyIcon from "@mui/icons-material/Flaky";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useNavigate } from "react-router";
import { ROLES } from "../constants";

const Sidebar = ({ user_role, setIsMenuOpen }) => {
  const [navigation, setNavigation] = useState([]);
  const navigate = useNavigate();
  // console.log(user_role);

  useEffect(() => {
    const holderNavigation = [
      { path: "mydata", linkName: "My Files", element: <FolderIcon /> },

      {
        path: "document_upload",
        linkName: "Upload document",
        element: <CloudUploadIcon />,
      },
      {
        path: "issuer_requests",
        linkName: "Issuer requests",
        element: <SupervisorAccountIcon />,
      },
      {
        path: "give_consent",
        linkName: "Give consent",
        element: <HowToRegIcon />,
      },
      {
        path: "revoke_consent",
        linkName: "Check/Revoke consent",
        element: <FlakyIcon />,
      },
    ];

    const adminNavigation = [
      {
        path: "make_request",
        linkName: "Make Request",
        element: <ConnectWithoutContactIcon />,
      },
      {
        path: "fulfilled_requests",
        linkName: "Requests",
        element: <FactCheckIcon />,
      },
      {
        path: "create_remove_issuer",
        linkName: "Create/Remove Issuer",
        element: <AddBoxOutlinedIcon />,
      },
      // { path: "validate_data", linkName: "Validate-Data" },
    ];

    const issuerNavigation = [
      {
        path: "make_request",
        linkName: "Make Request",
        element: <ConnectWithoutContactIcon />,
      },
      {
        path: "fulfilled_requests",
        linkName: "Requests",
        element: <FactCheckIcon />,
      },
    ];

    if (user_role === ROLES.ADMIN) {
      setNavigation(adminNavigation);
    } else if (user_role === ROLES.ISSUER) {
      setNavigation(issuerNavigation);
    } else {
      setNavigation(holderNavigation);
    }
  }, [user_role]);

  return (
    <div className="absolute z-10">
      <div className="sidebar w-72 h-screen bg-slate-100">
        <div className="flex flex-col justify-between">
          <div>
            <h1
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center"
            ></h1>
            <ul className="mt-2 tracking-wide">
              {navigation.map((el, idx) => (
                <li className="" key={idx}>
                  <button
                    onClick={() => {
                      navigate(el.path);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-4 hover:underline hover:text-gray-400 underline-offset-8 px-4 py-2 text-black font-semibold font-sans"
                  >
                    {el.element}
                    <span className="-mr-1 font-semibold font-sans text-black">
                      {el.linkName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
