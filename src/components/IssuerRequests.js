import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Contract from "./utilities/contract/contract";
import { ColorRing } from "react-loader-spinner";
import { InfinitySpin } from "react-loader-spinner";

import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";

const IssuerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [action, setAction] = useState(null);

  const approve_request = async (request_id) => {
    setInProgress(true);
    setAction("APPROVE");
    const status = await Contract.fulfillIssuerRequest(request_id, 1);
    if (!status) {
      toast("Request fulfillment failed due to some error, Try again later");
    } else {
      toast(
        "Request fulfillment successfully, wait for issuer to verify this data"
      );
    }
    setInProgress(false);
    setAction(null);
  };

  const reject_request = async (request_id) => {
    setAction("REJECT");
    setInProgress(true);
    const status = await Contract.fulfillIssuerRequest(request_id, 0);
    if (!status) {
      toast("Request fulfillment failed due to some error, Try again later");
    } else {
      toast(
        "Request fulfillment successfully, You have rejected issuer verification"
      );
    }
    setInProgress(false);
    setAction(null);
  };

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getRequestIndexes();
      const idx = raw.map((el) => parseInt(el, 10));
      return idx;
    };

    const get_promises = async () => {
      const idx = await get_indexes();
      // console.log(idx);
      const _requests = await idx.map(async (el, index) => {
        return await Contract.getRequestByID(el);
      });
      return await Promise.all(_requests);
    };

    const get_requests = async () => {
      const results = await get_promises();
      console.log(results);
      setRequests(results);
      setIsLoading(false);
    };

    get_requests();
  }, [inProgress]);

  return (
    <div>
      <div className="flex items-start justify-center bg-sky-100 h-screen p-6">
        <div
          className={`${
            isLoading ? "" : "lg:w-2/3 w-full flex justify-center items-center"
          }`}
        >
          {inProgress ? (
            <div className="absolute flex flex-col mt-5 justify-center items-center">
              {action === "APPROVE"
                ? "approving"
                : action === "REJECT"
                ? "rejecting"
                : ""}
              &nbsp; issuer request...
              {inProgress ? <InfinitySpin width="200" color="#4fa94d" /> : ""}
            </div>
          ) : (
            ""
          )}

          {isLoading ? (
            <ColorRing
              className="w-full h-full bg-blue-600"
              visible={true}
              height="130"
              width="130"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
            <div className={`flex flex-col ${inProgress ? "opacity-25" : ""}`}>
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
                            Requested data
                          </th>
                          <th
                            scope="col"
                            className="text-sm text-center font-semibold text-gray-200 px-6 py-4"
                          >
                            Request from
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((el, idx) => (
                          <tr key={idx} className="bg-white border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-200">
                              {parseInt(el.request_id, 10)}
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                              {el.requested_data_name}
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                              {el.request_from}
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 py-4 whitespace-nowrap text-center flex justify-around">
                              {el.isCompleted ? (
                                <button
                                  disabled
                                  type="button"
                                  className={
                                    el.request_status === 1
                                      ? "opacity-50 inline-block mx-1 px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                                      : "opacity-50 inline-block mx-1 px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                                  }
                                >
                                  {el.request_status === 1 ? (
                                    <>
                                      Approved <ThumbUpAltRoundedIcon />
                                    </>
                                  ) : (
                                    <>
                                      Rejected <ThumbDownAltRoundedIcon />
                                    </>
                                  )}
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      approve_request(el.request_id)
                                    }
                                    type="button"
                                    className="inline-block mx-1 px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      reject_request(el.request_id)
                                    }
                                    type="button"
                                    className="inline-block mx-1 px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
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
      </div>
    </div>
  );
};

export default IssuerRequests;
