import React, { useState, useEffect } from "react";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import Contract from "./utilities/contract/contract";
import { toast } from "react-toastify";

import CheckConsent from "./CheckConsent";
import { ColorRing } from "react-loader-spinner";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";

const CheckRevokeConcent = () => {
  const [consents, setConsents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inProgress, setInProgress] = useState(false);

  const revoke_access = async (id, recipient_address) => {
    const status = await Contract.removeConsent(
      parseInt(id, 10),
      recipient_address
    );
    if (!status) {
      toast("Revoking access failed due to some error, Try again later");
    } else {
      toast("Access revoked successfully");
    }
  };

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getCurrentUserDataIndexes();
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

    const get_data = async () => {
      const _results = await get_promises();
      const results = _results.filter(
        (el) => parseInt(el.data_verification_stage, 10) !== 1
      );
      return results;
    };

    const getConsentAddressesWithData = async () => {
      const _data = await get_data();
      // console.log(_data);
      const _consent = await _data.map(async (el, index) => {
        const consent_addresses = await Contract.getConsentGivenListByDataId(
          el.user_data_id
        );
        return {
          user_data: el,
          consent_addresses,
        };
      });

      return await Promise.all(_consent);
    };

    const get_consent_promises = async () => {
      const results = await getConsentAddressesWithData();
      return results;
    };

    const get_user_data_with_consent_addresses = async () => {
      const data = await get_consent_promises();
      const results = data.filter((el) => el.consent_addresses.length > 0);
      setConsents(results);
      setIsLoading(false);
    };

    get_user_data_with_consent_addresses();
  }, []);

  return (
    <div className="h-screen">
      <section className="container px-6 py-4 mx-auto flex flex-col justify-center">
        <CheckConsent />

        <div
          className={` ${
            isLoading
              ? "h-screen w-full  flex justify-center items-start"
              : "w-full flex justify-center items-center"
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
            <div className="flex flex-col w-full">
              {consents.map((el, idx) => {
                console.log(el);
                return (
                  <div key={idx} className="w-full p-4">
                    <div className="p-8 rounded-xl shadow-sm bg-white">
                      <span className="text-2xl mb-3">
                        <i>data name:</i> «
                        <span className="text-3xl font-bold">
                          {el.user_data.user_data_name}
                        </span>
                        »
                      </span>
                      <br />
                      <hr className="my-4" />

                      <div
                        className={`flex flex-col w-full ${
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
                                      Recipient address
                                    </th>
                                    {/* <th
                                      scope="col"
                                      className="text-sm text-center font-semibold text-gray-200 px-6 py-4"
                                    >
                                      Request from
                                    </th> */}
                                    <th
                                      scope="col"
                                      className="text-sm font-semibold text-gray-200 px-6 py-4 text-center"
                                    >
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {el.consent_addresses.map((address, _idx) => (
                                    <tr key={idx} className="bg-white border-b">
                                      <td className="text-sm text-gray-700 font-light px-6 text-center py-4 whitespace-nowrap">
                                        {address}
                                      </td>

                                      <td className="text-sm text-gray-700 font-light px-6 py-4 whitespace-nowrap text-center flex justify-around">
                                        <button
                                          onClick={() =>
                                            revoke_access(
                                              el.user_data_id,
                                              address
                                            )
                                          }
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show data */}
        </div>
      </section>
    </div>
  );
};

export default CheckRevokeConcent;
