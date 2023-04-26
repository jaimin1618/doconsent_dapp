import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderIcon from "@mui/icons-material/Folder";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FlakyIcon from "@mui/icons-material/Flaky";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { ROLES } from "../constants";
import Contract from "./utilities/contract/contract";

const Navbar = ({ user_role }) => {
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState([]);
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
    <nav className="bg-gray-800 shadow-lg w-full flex items-center justify-around h-14">
      <div className=" flex my-3 lg:my-auto">
        <a href="#" onClick={() => navigate("/")} rel="home">
          <Typography
            style={{
              background: "linear-gradient(to right, #8A2BE2, #DA70D6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
              opacity: "0.8",
              letterSpacing: ".2rem",
              fontSize: "1 rem",
              fontWeight: "bold",
            }}
          >
            DOCONSENTWEB3
          </Typography>
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-around">
        {navigation.map((el, idx) => (
          <button
            onClick={() => {
              navigate(el.path);
              
            }}
            className="flex items-center space-x-4 hover:underline hover:text-gray-400 underline-offset-8 px-4 py-2 text-black font-semibold font-sans"
          >
            <Typography sx={{ color: "gray" }}>{el.linkName}</Typography>
          </button>
        ))}
      </div>

      <div>
        <Button
          endIcon={<KeyboardDoubleArrowRightIcon />}
          onClick={() => Contract.requestAccounts()}
          sx={{
            borderRadius: 2.5,
            color: "whitesmoke",
            backgroundColor: "#242428",
            bordercolor: "gray",
            border: "1px solid gray",
          }}
        >
          Connect Metamask &nbsp;
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
