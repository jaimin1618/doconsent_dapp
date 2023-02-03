import React, { useState } from "react";
import { toast } from "react-toastify";

import Contract from "./utilities/contract/contract";

const MakeRequest = () => {
  const [dataName, setDataName] = useState("");
  const [dataId, setDataId] = useState(0);

  const make_request = async () => {
    const status = await Contract.makeIssuerRequest(parseInt(dataId, 10));
    if (status) {
      toast("Request made successfully, wait for user approval");
    } else {
      toast("Request failed, there was some error. Try again later");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-2xl mx-auto">
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
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"></div>
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
        <button
          onClick={() => make_request()}
          className="block mt-5 uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
        >
          make a issuer data request
        </button>
      </div>
    </div>
  );
};

export default MakeRequest;
