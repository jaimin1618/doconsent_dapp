import React, { useState, useEffect } from "react";
import DataObjectIcon from "@mui/icons-material/DataObject";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";
import { InfinitySpin } from "react-loader-spinner";

import Contract from "./utilities/contract/contract";

const VerifyAccessData = () => {
  const [accessData, setAccessData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inProgress, setInProgress] = useState(true);
  const [action, setAction] = useState("");

  const display_data = async (el) => {
    const cid = el.user_data_cid;
    const location = process.env.REACT_APP_IPFS_PUBLIC_GATEWAY + cid;
    window.location.href = location;
  };

  const approve_data = async (el) => {
    setAction("APPROVE");
    setInProgress(true);
    const status = await Contract.issuerDataVerification(
      parseInt(el.user_data_id, 10),
      1
    );
    if (!status) {
      toast("Data approval failed due to some reasons, Try again later");
    } else {
      toast("Data approved successfully");
    }
    const results = accessData.filter(
      (item) => item.user_data_id !== el.user_data_id
    );
    setAccessData(results);
    setInProgress(false);
  };

  const reject_data = async (el) => {
    setAction("REJECT");
    setInProgress(true);
    const status = await Contract.issuerDataVerification(
      parseInt(el.user_data_id, 10),
      2
    );
    if (!status) {
      toast("Data rejection failed due to some reasons, Try again later");
    } else {
      toast("Data rejected successfully approved successfully");
    }
    setInProgress(false);
  };

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getRequestsMadeByCurrentUser();
      const idx = raw.map((el) => parseInt(el, 10));

      return idx;
    };

    const get_request_promises = async () => {
      const idx = await get_indexes();
      const _requestPromises = await idx.map(async (el, index) => {
        return await Contract.getRequestByID(el);
      });
      return await Promise.all(_requestPromises);
    };

    const get_data_indexes = async () => {
      const results = await get_request_promises();
      const filtered_requests = results.filter((el) => el.request_status === 1);
      const idx = filtered_requests.map((el) => el.requested_data_id);
      const data_indexes = idx.map((el) => parseInt(el, 10));

      const promises = data_indexes.map(async (el, index) => {
        const addr = await Contract.getAddress();
        const isConsent = await Contract.checkConsent(el, addr);
        if (isConsent === true) {
          return el;
        }
      });

      promises.filter((el) => el !== undefined);
      return Promise.all(promises);
    };

    const get_data_promises = async () => {
      const _data_indexes = await get_data_indexes();
      const _indexes = _data_indexes.filter((el) => el !== undefined);
      // requested_data_id
      const data = await _indexes.map(async (el, index) => {
        return await Contract.getUserDataByID(el);
      });

      return await Promise.all(data);
    };

    const getAccessData = async () => {
      const results = await get_data_promises();
      setAccessData(results);
      // console.log(results);
      setIsLoading(false);
    };

    getAccessData();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="my-6 font-bold underline underline-offset-4">
        <span>Data with Read & Verify Permission</span>
      </div>
      <section className="flex w-full justify-center items-cente">
        <div
          className={`${
            isLoading
              ? "h-screen w-full flex justify-center items-start"
              : "w-full lg:w-2/3 flex justify-center items-center"
          }`}
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
            <div
              className={`flex flex-col w-full justify-center ${
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
                        {accessData.map((el, idx) => (
                          <tr key={idx} className="bg-white border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-200">
                              {parseInt(el.user_data_id, 10)}
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                              {el.user_data_name}
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 py-4 whitespace-nowrap text-center flex justify-around">
                              <button
                                onClick={() => display_data(el)}
                                type="button"
                                className="inline-block mx-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                View
                              </button>

                              <button
                                onClick={() => approve_data(el)}
                                type="button"
                                class="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                Approve Verification
                              </button>
                              <button
                                onClick={() => reject_data(el)}
                                type="button"
                                className="inline-block mx-1 px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                Reject Verification
                              </button>
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 py-4 whitespace-nowrap text-center">
                              {/* {parseInt(el.data_verification_stage, 10) == 1 ? (
                                parseInt(el.issuer_verification_status, 10) ==
                                1 ? (
                                  <VerifiedUserIcon className="text-green-700" />
                                ) : (
                                  <GppBadIcon className="text-red-500" />
                                )
                              ) : (
                                <PendingActionsRoundedIcon />
                              )} */}
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

          {/* Show data */}

          {/* Show data */}
        </div>
      </section>
    </div>
  );
};

export default VerifyAccessData;

// {accessData.map((el, idx) => {
//   return (
//     <div
//       key={idx}
//       className="flex items-center p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 hover:bg-slate-2 hover:bg-slate-200"
//     >
//       <div className="p-3 mr-4 bg-blue-500  text-white rounded-full">
//         <DataObjectIcon />
//       </div>
//       <div className="w-full h-full flex justify-around items-center">
//         <p className="font-bold text-sm text-gray-900">
//           {el.user_data_name.split(0, 30)}
//         </p>
//         {/* <p className="text-sm font-normal text-gray-800">
//           {el.user_data_cid.substr(0, 30)}...
//         </p> */}
//         <button className="flex justify-around text-blue-800 bg-slate-100 p-2 rounded-sm">
//           <VisibilityIcon onClick={() => display_data(el)} />
//         </button>
//         <button className="flex justify-around text-green-900 bg-slate-100 p-2 rounded-sm">
//           <DoneOutlineIcon onClick={() => approve_data(el)} />
//         </button>
//         <button className="flex justify-around text-red-900 bg-slate-100 p-2 rounded-sm">
//           <CancelIcon onClick={() => reject_data(el)} />
//         </button>
//       </div>
//     </div>
//   );
// })}
