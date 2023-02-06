import React, { useState, useEffect } from "react";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Contract from "./utilities/contract/contract";
import { toast } from "react-toastify";

import CheckConsent from "./CheckConsent";

const CheckRevokeConcent = () => {
  const [consents, setConsents] = useState([]);

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
        (el) => parseInt(el.data_verification_stage, 10) != 1
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
      // console.log(data);
      setConsents(data);
    };

    get_user_data_with_consent_addresses();
  }, []);

  return (
    <div className="h-screen">
      <section className="container px-6 py-4 mx-auto">
        <div className="grid gap-6 mb-8">
          <CheckConsent />

          {consents.map((el, idx) => {
            return (
              <div key={idx} className="w-full p-4">
                <div className="p-8 rounded-xl shadow-md bg-white">
                  <span className="text-2xl mb-3">
                    <i>data name:</i> «
                    <span className="text-3xl font-bold">
                      {el.user_data.user_data_name}
                    </span>
                    »
                  </span>
                  <br />
                  {/* <p className="text-base">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Accusantium alias minima rerum. Soluta assumenda eveniet
                    obcaecati maxime temporibus qui ab voluptas doloremque illo,
                    odio optio ex, atque numquam tempore quis.
                  </p> */}
                  <hr className="my-4" />

                  {el.consent_addresses.map((address, _idx) => (
                    <div
                      className="flex items-center justify-items-end"
                      key={_idx}
                    >
                      <div className="flex  w-2/3 items-center justify-start">
                        <img
                          className="h-12 rounded-full"
                          alt="Use any sample image here..."
                          src="https://tailwindcomponents.com/storage/avatars/baG0wMQUtoTOZOOmStaUBVQsa7LAwc5HjiGZMjdB.png"
                        />
                        <p className="mx-2 text-gray-500 text-sm">{address}</p>
                      </div>
                      <div className="items-center w-1/4 bg-red-500 rounded-sm justify-center h-full justify-items-end">
                        <button
                          onClick={() =>
                            revoke_access(el.user_data.user_data_id, address)
                          }
                          className="flex justify-around w-full text-red-800 p-4 font-bold rounded-sm"
                        >
                          <span className="text-black">REVOKE ACCESS</span>
                          <RemoveCircleIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Show data */}
        </div>
      </section>
    </div>
  );
};

export default CheckRevokeConcent;
