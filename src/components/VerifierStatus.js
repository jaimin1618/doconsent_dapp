import React, { useState, useEffect } from "react";
import "./styles/toggle.css";

const VerifierStatus = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        />
        <label
          htmlFor="toggle"
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
        ></label>
      </div>
      <label htmlFor="toggle" className="text-md text-gray-700 font-extrabold">
        Are you a Verifier
      </label>
    </div>
  );
};

export default VerifierStatus;
