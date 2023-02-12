import React, { useEffect, useState } from "react";
import Contract from "./utilities/contract/contract";

import WarningAlert from "./WarningAlert";
import InfoAlert from "./InfoAlert";

const CheckConsent = () => {
  const [options, setOptions] = useState([]);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [selectedOption, setSelectedOption] = useState(0);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [showWarning, setShowWarningAlert] = useState(false);

  const runCheckConsent = async () => {
    const status = await Contract.checkConsent(
      selectedOption,
      recipientAddress
    );
    if (status === true) {
      setShowInfoAlert(true);
    } else {
      setShowWarningAlert(true);
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

    const get_options = async () => {
      const results = await get_promises();
      const _options = results.map((el) => {
        return {
          dataName: el.user_data_name,
          dataId: el.user_data_id,
        };
      });
      setOptions(_options);
    };

    get_options();
  }, []);

  return (
    <div className="w-full sm:p-4">
      <div className="p-8 rounded-xl shadow-md bg-white">
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-3 block text-base text-[#07074D] font-bold"
          >
            Select data
          </label>

          <select
            onChange={(e) => setSelectedOption(e.target.value)}
            defaultValue={"DEFAULT"}
            name="dataNames"
            className="w-full px-6 py-3"
          >
            <option value="DEFAULT" disabled>
              Choose a data ...
            </option>
            {options.map((el, idx) => (
              <option key={idx} value={el.dataId}>
                {el.dataName}
              </option>
            ))}
          </select>
        </div>
        <span className="text-2xl mb-2">
          <i>Enter recipient address:</i>
          <span className="text-3xl font-bold">
            <input
              type="text"
              id="input-group-1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter recipient address"
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </span>
        </span>

        {/* SHOW STATUS */}
        <div className="my-2">
          <InfoAlert show={showInfoAlert} setShow={setShowInfoAlert} />
          <WarningAlert show={showWarning} setShow={setShowWarningAlert} />
        </div>
        {/* <p className="text-base">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Accusantium alias minima rerum. Soluta assumenda eveniet
        obcaecati maxime temporibus qui ab voluptas doloremque illo,
        odio optio ex, atque numquam tempore quis.
      </p> */}
        <button
          onClick={() => runCheckConsent()}
          className="w-1/2 my-2 block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
        >
          Check Consent
        </button>
      </div>
    </div>
  );
};

export default CheckConsent;
