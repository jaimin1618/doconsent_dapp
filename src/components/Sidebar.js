import { useState, useEffect } from "react";
import "./styles/sidebar.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderIcon from "@mui/icons-material/Folder";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FlakyIcon from "@mui/icons-material/Flaky";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import { useNavigate } from "react-router";
import { ROLES } from "../constants";
import Logo from "../media/Logo.png";

const Sidebar = ({ user_role }) => {
  const [navigation, setNavigation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const holderNavigation = [
      {
        path: "document_upload",
        linkName: "Upload document",
        element: <CloudUploadIcon />,
      },
      { path: "mydata", linkName: "My Files", element: <FolderIcon /> },
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
      {
        path: "my_permissioned_data",
        linkName: "Permissioned data",
        element: <FolderSpecialIcon />,
      },
      // { path: "validate_data", linkName: "Validate-Data" },
    ];

    user_role === ROLES.ISSUER
      ? setNavigation(issuerNavigation)
      : setNavigation(holderNavigation);
  }, [user_role]);

  return (
    <div className="fixed z-10 bg-gray-300">
      <div className="sidebar w-[3.35rem] overflow-hidden border-r hover:w-72 hover:bg-cyan-900 hover:shadow-lg">
        <div className="flex h-screen flex-col justify-between pb-0">
          <div>
            <h1
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center"
            >
              <button className="w-full">
                {/* <img className="bg-white rounded-md" src={Logo} /> */}
                <img className="p-3 bg-yellow-500" alt="logo" src={Logo} />
              </button>
            </h1>
            <ul className="mt-2 space-y-2 tracking-wide">
              {navigation.map((el, idx) => (
                <li className="min-w-max" key={idx}>
                  <button
                    onClick={() => navigate(el.path)}
                    className="bg group flex items-center space-x-4 hover:underline hover:text-gray-400 underline-offset-8 px-4 py-2 text-black font-semibold font-sans"
                  >
                    {el.element}
                    <span className="-mr-1 font-semibold font-sans text-white">
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
