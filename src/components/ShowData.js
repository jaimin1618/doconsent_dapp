import React, { useState, useEffect } from "react";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppBadIcon from "@mui/icons-material/GppBad";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";

import { toast } from "react-toastify";

import Contract from "./utilities/contract/contract";
import { ColorRing } from "react-loader-spinner";
import { InfinitySpin } from "react-loader-spinner";

const ShowData = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inProgress, setInProgress] = useState(false);

  const display_data = async (el) => {
    const cid = el.user_data_cid;
    const location = process.env.REACT_APP_IPFS_PUBLIC_GATEWAY + cid;
    window.location.href = location;
  };

  const delete_data = async (el) => {
    setInProgress(true);
    const id = el.user_data_id;
    // const cid = el.user_data_cid;

    const status = await Contract.removeUserData(id);
    if (status) {
      toast("Data deleted successfully");

      const _cards = cards.filter((el) => el.user_data_id !== id);
      setCards(_cards);
    } else {
      toast(
        "Data delete failed due to some error with blockchain network, Try again later"
      );
    }
    setInProgress(false);
  };

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getCurrentUserDataIndexes();
      const idx = raw.map((el) => parseInt(el, 10));
      return idx;
    };

    const get_consented_data_indexes = async () => {
      const raw = await Contract.userHasConsentIndexes();
      const idx = raw.map((el) => parseInt(el, 10));
      return idx;
    };

    const get_promises = async () => {
      const idx = await get_indexes();

      const _cards = await idx.map(async (el, index) => {
        return await Contract.getUserDataByID(el);
      });

      return await Promise.all(_cards);
    };

    const get_promises_for_consent_data = async () => {
      const idx = await get_consented_data_indexes();
      const _cards = await idx.map(async (el, index) => {
        return await Contract.getUserDataByID(el);
      });
      return await Promise.all(_cards);
    };

    const get_data = async () => {
      const results = await get_promises();
      const _results = await get_promises_for_consent_data();

      const user_data = results.map((el) => {
        return {
          ...el,
          isOwner: true,
        };
      });
      const consent_data = _results.map((el) => {
        return {
          ...el,
          isOwner: false,
        };
      });

      const data = [...user_data, ...consent_data];
      setCards(data);
      setIsLoading(false);
    };

    get_data();
  }, []);

  return (
    <div className="h-screen">
      <section
        className={`container px-6 py-4 mx-auto ${
          isLoading ? "" : "flex justify-center"
        }`}
      >
        <div
          className={` ${
            isLoading
              ? "h-screen w-full  flex justify-center items-start"
              : "w-full lg:w-2/3 flex justify-center items-center"
          }`}
        >
          {inProgress ? (
            <div className="absolute flex flex-col mt-5 justify-center items-center">
              Deleting data...
              {inProgress ? <InfinitySpin width="200" color="#4fa94d" /> : ""}
            </div>
          ) : (
            ""
          )}
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
            <div className={`flex flex-col w-full ${inProgress ? "opacity-25" : ""}`}>
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
                          <th
                            scope="col"
                            className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                          >
                            Verified
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cards.map((el, idx) => (
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
                                type="button"
                                className="inline-block mx-1 px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => delete_data(el)}
                                type="button"
                                className="inline-block mx-1 px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                Delete
                              </button>
                            </td>
                            <td className="text-sm text-gray-700 font-light px-6 py-4 whitespace-nowrap text-center">
                              {parseInt(el.data_verification_stage, 10) == 1 ? (
                                parseInt(el.issuer_verification_status, 10) ==
                                1 ? (
                                  <VerifiedUserIcon className="text-green-700" />
                                ) : (
                                  <GppBadIcon className="text-red-500" />
                                )
                              ) : (
                                <PendingActionsRoundedIcon />
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
      </section>
    </div>
  );
};

export default ShowData;
