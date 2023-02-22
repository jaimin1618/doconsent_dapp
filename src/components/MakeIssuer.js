import React, { useState } from "react";
import Contract from "../components/utilities/contract/contract";
import { toast } from "react-toastify";

const MakeIssuer = () => {
  const [issuerAddress, setIssuerAddress] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const makeIssuer = async () => {
    setInProgress(true);
    const status = await Contract.makeIssuer(issuerAddress);
    if (status) {
      toast("New Issuer created successfully");
    } else {
      toast(
        "Creating new Issuer failed, due to some internal issue, Try again later"
      );
    }
    setInProgress(false);
  };

  return (
    <div className="w-full mx-auto my-4 lg:w-2/3 text-center">
      <div className="">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Search
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"></div>
          <input
            type="search"
            id="default-search"
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="e.g. 0x90F79bf6EB2c4f..."
            required
            onChange={(e) => setIssuerAddress(e.target.value)}
          />
          <button
            onClick={() => makeIssuer()}
            className="text-white absolute uppercase right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Make Issuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeIssuer;
