import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Contract from "./utilities/contract/contract";
import { ColorRing } from "react-loader-spinner";
import { InfinitySpin } from "react-loader-spinner";

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
      // console.log(results);
      setRequests(results);
      setIsLoading(false);
    };

    get_requests();
  }, [inProgress]);

  return (
    <div>
      <div className="flex items-start justify-center bg-sky-100 h-screen  p-6">
        <div className="flex flex-col items-center justify-center divide-y w-full">
          {inProgress ? (
            <div className="absolute h-full flex flex-col justify-center items-center">
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
            <div className="flex flex-col space-y-2 divide-y">
              {/* SHOW REQUESTS */}
              {requests.map((el, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between space-x-3 items-center p-3 ${
                    el.isCompleted ? " outline-green-700 outline-3 outline" : ""
                  } ${inProgress ? "opacity-20" : ""}`}
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
                  <div
                    className={`${
                      el.isCompleted ? "hidden" : ""
                    } w-1/3 bg-blue-0 h-full flex justify-around`}
                  >
                    <button
                      onClick={() => approve_request(el.request_id)}
                      className="w-1/2 border rounded-md px-2 py-2 mx-1 bg-green-500 text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject_request(el.request_id)}
                      className="w-1/2 border rounded-md px-2 py-2 mx-1 bg-red-500 text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {/* SHOW REQUESTS */}
            </div>
          )}

          {/* <div className="p-4">
            <button className="w-full border p-2 rounded-md hover:opacity-60 transition">
              View all
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default IssuerRequests;
