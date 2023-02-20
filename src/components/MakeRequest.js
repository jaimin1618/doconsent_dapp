import React, { useState } from "react";
import { toast } from "react-toastify";
import { ProgressBar } from "react-loader-spinner";

import Contract from "./utilities/contract/contract";

const MakeRequest = () => {
  const [dataName, setDataName] = useState("");
  const [dataId, setDataId] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const make_request = async () => {
    setInProgress(true);
    const status = await Contract.makeIssuerRequest(parseInt(dataId, 10));
    if (status) {
      toast("Request made successfully, wait for user approval");
    } else {
      toast("Request failed, there was some error. Try again later");
    }
    setInProgress(false);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      {inProgress ? (
        <div className="absolute flex flex-col justify-center items-center">
          Requesting...
          <ProgressBar
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor="#F4442E"
            barColor="#51E5FF"
          />
        </div>
      ) : (
        ""
      )}
      <div
        className={`lg:w-1/3 w-full shadow-md p-6 mx-3 flex flex-col justify-center ${
          inProgress ? "opacity-20" : ""
        }`}
      >
        <div className="font-bold mb-4 underline w-full text-lg">
          Provide Request details
        </div>
        <label
          htmlFor="input-group-1"
          className="font-semibold block mb-2 text-sm  text-gray-900 dark:text-gray-300"
        >
          Data name
        </label>
        <div className="relative mb-6">
          <input
            value={dataName}
            onChange={(e) => setDataName(e.target.value)}
            type="text"
            id="input-group-1"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="e.g. Personal data"
          />
        </div>
        <label
          htmlFor="website-admin"
          className="block mb-1 text-sm font-semibold text-gray-900 dark:text-gray-300 rounded"
        >
          Data id
        </label>
        <div className="flex">
          <input
            value={dataId}
            onChange={(e) => setDataId(e.target.value)}
            type="number"
            id="website-admin"
            className="rounded p-3 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="e.g. 297"
          />
        </div>
        {/* <button className="block mt-5 uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded">
          make a issuer data request
        </button> */}
        <div className="flex justify-center items-center">
          <button
            onClick={() => make_request()}
            type="button"
            className="flex justify-center items-center mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Make a issuer data request
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeRequest;
