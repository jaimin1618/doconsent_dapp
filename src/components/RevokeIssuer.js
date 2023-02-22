import React, { useState, useEffect } from "react";
import Contract from "../components/utilities/contract/contract";

import { ColorRing } from "react-loader-spinner";
import { InfinitySpin } from "react-loader-spinner";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { toast } from "react-toastify";

const RevokeIssuer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [issuers, setIssuers] = useState([]);
  const [inProgress, setInProgress] = useState(false);

  const removeIssuerOnClick = async (isser_address) => {
    setInProgress(true);
    const status = await Contract.removeIssuer(isser_address);
    if (status) {
      toast("User removed from Issuer role successfully");
    } else {
      toast("There was some internal error, while revoking issuer status");
    }
    setInProgress(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const get_issuers = async () => {
      const data = await Contract.getIssuerAdmins();
      setIssuers(data);
    };

    setInterval(() => {
      get_issuers();
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="h-screen flex justify-center">
      <div className="absolute">
        {inProgress ? <InfinitySpin width="200" color="#4fa94d" /> : ""}
      </div>
      {isLoading ? (
        <ColorRing
          className="w-full h-full"
          visible={true}
          height="130"
          width="130"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      ) : (
        <div
          className={`flex flex-col lg:w-2/3 w-full mx-4 ${
            inProgress ? "opacity-25" : ""
          }`}
        >
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b bg-gray-800 ">
                    <tr className="">
                      <th
                        scope="col"
                        className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                      >
                        Data name
                      </th>
                      <th
                        scope="col"
                        className="text-sm text-center font-semibold text-gray-200 px-6 py-4"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuers.map((el, idx) => (
                      <tr key={idx} className="bg-white border-b">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-200">
                          {idx + 1}
                        </td>
                        <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                          {el}
                        </td>
                        <td className="text-sm text-gray-700 font-light px-6 py-4 whitespace-nowrap text-center flex justify-around">
                          <button
                            onClick={() => removeIssuerOnClick(el)}
                            type="button"
                            className="flex justify-center items-center px-6 py-2.5 bg-yellow-500 text-white text-xs leading-tight uppercase font-semibold rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out"
                          >
                            <DoNotDisturbIcon />
                            &nbsp;Revoke Access
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevokeIssuer;
