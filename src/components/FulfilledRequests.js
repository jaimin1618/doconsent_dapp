import React, { useState, useEffect } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { DropDown } from "./DropDown";
import Contract from "./utilities/contract/contract";
import { RequestFilter, RequestFilterIndex } from "../constants";

// getIssuerFulfilledRequests
const FulfilledRequests = () => {
  const [filter, setFilter] = useState(RequestFilter.ALL);
  const [requests, setRequests] = useState([]);

  const displayStatusIcon = (status) => {
    if (status == 0) {
      return <PendingActionsIcon className="text-blue-600" />;
    } else if (status == 1) {
      return <CheckBoxIcon className="text-green-700" />;
    } else if (status == 2) {
      return <CancelIcon className="text-red-500" />;
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
    };

    get_requests();
  }, []);

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
      if (filter == RequestFilter.ALL) {
        setRequests(results);
      } else if (filter == RequestFilter.ACCEPTED_OR_REJECTED) {
        const filtered_results = results.filter(
          (el) =>
            el.request_status == RequestFilterIndex[RequestFilter.ACCEPTED] ||
            el.request_status == RequestFilterIndex[RequestFilter.REJECTED]
        );
        console.log(filtered_results);
        setRequests(filtered_results);
      } else {
        const filtered_results = results.filter(
          (el) => el.request_status == RequestFilterIndex[filter]
        );
        console.log(filtered_results);
        setRequests(filtered_results);
      }
    };

    get_requests();
  }, [filter]);

  return (
    <div className="">
      <DropDown filter={filter} setFilter={setFilter} />
      <div>
        <div className="flex items-start justify-center min-h-screen p-6">
          <div className="flex flex-col border-gray-300 border bg-white divide-y rounded-lg flex-none w-full md:w-1/2 lg:w-1/2">
            <div className="flex flex-col space-y-2 divide-y">
              {/* SHOW REQUESTS */}
              {requests.map((el, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between space-x-3 items-center p-3 ${
                    el.isCompleted ? " outline-green-700 outline-3 outline" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                      className="rounded-full h-14 w-20"
                      alt=""
                    />
                    <div className="flex flex-col space-y-3 text-sm w-full">
                      <p>
                        Requested for:&nbsp;
                        <span className="font-semibold">
                          {el.requested_data_name.substr(0, 30)}
                        </span>
                      </p>
                      <p>
                        Requested by:&nbsp;
                        <span className="font-semibold">
                          {el.request_from.substr(0, 30)}...
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>{displayStatusIcon(el.request_status)}</div>
                </div>
              ))}
              {/* SHOW REQUESTS */}
            </div>
            {/* <div className="p-4">
            <button className="w-full border p-2 rounded-md hover:opacity-60 transition">
              View all
            </button>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FulfilledRequests;
