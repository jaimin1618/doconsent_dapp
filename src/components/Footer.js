import { Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer-center p-3 shadow-lg bg-black-200 text-black" style={{ backgroundColor: "#282930" }}>
      <div className="text-center">
       <Typography sx={{color:"white" , fontSize:"16px"}}>
       Copyright © 2023 -&nbsp;
          <a
            className="font-semibold"
            href="mailto:jaimin.chokhawala@gmail.com"
          >
            Jaimin Chokhawala
          </a>
       </Typography>
      </div>
    </footer>
  );
};

export default Footer;
