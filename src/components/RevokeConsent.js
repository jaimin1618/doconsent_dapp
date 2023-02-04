import React, { useState, useEffect } from "react";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
import DesktopAccessDisabledIcon from "@mui/icons-material/DesktopAccessDisabled";
import DataObjectIcon from "@mui/icons-material/DataObject";

import Contract from "./utilities/contract/contract";

const RevokeConsent = () => {
  const [consents, setConsents] = useState([]);

  const revoke_access = async (id) => {
    console.log(id);
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
      const results = await get_promises();
      console.log(results);
      return results;
    };

    const get_consent_promises = async () => {
      const _data = await get_data();
      const _consent = await _data.map(async (el, index) => {
        const consent_addresses = await Contract.getConsentGivenListByDataId(
          el.user_data_id
        );
        console.log(consent_addresses);
        const obj = {
          data_id: parseInt(el.user_data_id, 10),
          data_name: el.user_data_name,
          data_cid: el.user_data_cid,
          data_access: consent_addresses,
        };
        return obj;
      });

      return Promise.all(_consent);
    };

    const get_approved_consents = async () => {
      const data = await get_consent_promises();
      const addresses = data.consent_addresses;
      setConsents(data);
    };

    get_approved_consents();
  }, []);

  return (
    <div className="h-screen">
      <section className="container px-6 py-4 mx-auto">
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Show data */}
          {consents.map((el, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 hover:bg-slate-2 hover:bg-slate-200"
              >
                <div className="p-3 mr-4 bg-blue-500  text-white rounded-full">
                  <DataObjectIcon />
                </div>
                <div className="w-full h-full flex justify-around items-center">
                  <p className="font-bold text-sm text-gray-900">
                    {el.data_name}
                  </p>

                  <button
                    onClick={() => revoke_access(el.data_id)}
                    className="flex justify-around text-red-700 bg-slate-100 p-2 rounded-sm"
                  >
                    <span className="text-black mx-3">REVOKE</span>
                    <DesktopAccessDisabledIcon />
                  </button>
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

export default RevokeConsent;
