import React, { useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
import IPFS from "./utilities/ipfs/ipfs";
import Contract from "./utilities/contract/contract";
import { toast } from "react-toastify";

const Upload = () => {
  const [dataName, setDataName] = useState("");
  const [content, setContent] = useState("");

  const ipfs_upload = async () => {
    const _cid = await IPFS.upload_data({
      data_name: dataName,
      data_content: content,
    });
    // QmZ8JpGAhjWPZDKWrXdYUf3qXaLhyE8KtcPGxiWfBrpYSr
    // QmbXyERFS1P7r7HoDgK6k5v4wTLewP96P7eSaJsCYFf38b
    return _cid;
  };

  const update_contract = async (cid) => {
    const status = await Contract.insertUserData(dataName, cid);
    if (!status) {
      toast("Error! data upload failed");
      return;
    }
    toast("Success! data uploaded successfully");
  };

  const run_upload = async () => {
    // store on IPFS
    const _cid = await ipfs_upload();
    // store on contract and assign ownership
    await update_contract(_cid);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-1/3 p-2">
        <label
          htmlFor="input-group-1"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Data Name
        </label>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <PublishIcon />
          </div>
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter data name"
            onChange={(e) => setDataName(e.target.value)}
          />
        </div>

        <textarea
          rows="15"
          cols="40"
          className="w-full h-full resize rounded-md bg-sky-100 p-2"
          placeholder="Enter data content"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          onClick={() => run_upload()}
          className="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
