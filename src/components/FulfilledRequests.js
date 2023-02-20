import React, { useState, useEffect } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { ColorRing } from "react-loader-spinner";

import { DropDown } from "./DropDown";
import Contract from "./utilities/contract/contract";
import { RequestFilter, RequestFilterIndex } from "../constants";
import FilterDropDown from "./FilterDropDown";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppBadIcon from "@mui/icons-material/GppBad";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";

// getIssuerFulfilledRequests
const FulfilledRequests = () => {
  const [filter, setFilter] = useState(RequestFilter.ALL);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const get_datetime = (time) => {
    const d = new Date(0);
    d.setUTCSeconds(time);
    const result = d.toLocaleDateString() + " " + d.toLocaleTimeString();
    return result;
  };

  const displayStatusIcon = (status) => {
    if (status === 0) {
      return (
        <span className="font-semibold text-sm uppercase">
          <PendingActionsIcon className="text-blue-700" />
          &nbsp;Pending
        </span>
      );
    } else if (status === 1) {
      return (
        <span className="font-semibold text-sm uppercase">
          <CheckBoxIcon className="text-green-700" />
          &nbsp;Approved
        </span>
      );
    } else if (status === 2) {
      return (
        <span className="font-semibold text-sm uppercase">
          <CancelIcon className="text-red-700" />
          &nbsp;Rejected
        </span>
      );
    }
  };

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getRequestsMadeByCurrentUser();
      const idx = raw.map((el) => parseInt(el, 10));
      return idx;
    };

    const get_promises = async () => {
      const idx = await get_indexes();
      const _requestPromises = await idx.map(async (el, index) => {
        return await Contract.getRequestByID(el);
      });
      return await Promise.all(_requestPromises);
    };

    const get_requests = async () => {
      const results = await get_promises();
      setRequests(results);
      setIsLoading(false);
    };

    get_requests();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const get_indexes = async () => {
      const raw = await Contract.getRequestsMadeByCurrentUser();
      const idx = raw.map((el) => parseInt(el, 10));
      return idx;
    };

    const get_promises = async () => {
      const idx = await get_indexes();
      const _requestPromises = await idx.map(async (el, index) => {
        return await Contract.getRequestByID(el);
      });
      return await Promise.all(_requestPromises);
    };

    const get_requests = async () => {
      const results = await get_promises();
      var filtered_results = [];
      if (filter === RequestFilter.ALL) {
        filtered_results = results;
        // setRequests(results);
      } else if (filter === RequestFilter.ACCEPTED_OR_REJECTED) {
        filtered_results = results.filter(
          (el) =>
            el.request_status === RequestFilterIndex[RequestFilter.ACCEPTED] ||
            el.request_status === RequestFilterIndex[RequestFilter.REJECTED]
        );
        // console.log(filtered_results);
        // setRequests(filtered_results);
      } else {
        filtered_results = results.filter(
          (el) => el.request_status === RequestFilterIndex[filter]
        );
        // console.log(filtered_results);
        // setRequests(filtered_results);
      }
      setTimeout(() => {
        setIsLoading(false);
        setRequests(filtered_results);
      }, 1000);
    };

    get_requests();
  }, [filter]);

  return (
    <div className="">
      {/* <DropDown filter={filter} setFilter={setFilter} /> */}
      <FilterDropDown filter={filter} setFilter={setFilter} />
      <div
        className={
          isLoading
            ? "h-screen flex justify-center items-start"
            : "flex justify-center items-center w-full"
        }
      >
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
          <div className="w-full">
            <div className="flex items-start justify-center min-h-screen p-3 my-3">
              <div className="flex flex-col border-gray-300 bg-white divide-y rounded-lg flex-none w-full md:w-2/3 lg:w-2/3">
                <div className="flex flex-col space-y-2 divide-y">
                  {/* SHOW REQUESTS */}

                  <div className="flex flex-col w-full">
                    {/* <div
                  className={`flex flex-col w-full ${
                    inProgress ? "opacity-25" : ""
                  }`}
                > */}
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
                                  {/* request ID */}#
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                                >
                                  {/* requested data name */}
                                  Data name
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm text-center font-semibold text-gray-200 px-6 py-4"
                                >
                                  {/* request to (public address) */}
                                  Requested to
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                                >
                                  {/* request status (is approved by HOLDER or NOT or pending) */}
                                  request status
                                </th>

                                <th
                                  scope="col"
                                  className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                                >
                                  {/* request created time */}
                                  datetime created
                                </th>

                                <th
                                  scope="col"
                                  className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                                >
                                  {/* request approved time */}
                                  datetime approved
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                                >
                                  {/* button to view approved data name */}
                                  View Access
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
                                    {el.request_to}
                                  </td>
                                  <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                                    {displayStatusIcon(el.request_status)}
                                    {/* {el.request_status === 0
                                    ? "PENDING"
                                    : el.request_status === 1
                                    ? "ACCPTED"
                                    : "REJECTED"} */}
                                  </td>
                                  <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                                    {get_datetime(
                                      parseInt(el.created_datetime, 10)
                                    )}
                                  </td>
                                  <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                                    {get_datetime(
                                      parseInt(el.approved_datetime, 10)
                                    )}
                                  </td>
                                  <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                                    {el.request_status === 1 ? (
                                      <button
                                        type="button"
                                        className="inline-block mx-1 px-6 py-2.5 bg-green-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-900 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                                      >
                                        View
                                      </button>
                                    ) : (
                                      <button
                                        disabled
                                        type="button"
                                        className="inline-block opacity-50 mx-1 px-6 py-2.5 bg-green-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-900 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                                      >
                                        View
                                      </button>
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulfilledRequests;
