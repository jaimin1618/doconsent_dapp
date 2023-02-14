import { useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
import { toast } from "react-toastify";
import urlExist from "url-exist";

import Contract from "../components/utilities/contract/contract";
import pinata from "../../src/components/utilities/ipfs/pinata";

function FileUploadMultiple() {
  const [dataName, setDataName] = useState(""); // dataName is FileName
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("uploaded file name: ", e.target.files[0].name);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    const metadata = {
      name: dataName,
      kayvalues: {
        version: 1,
      },
    };

    const options = JSON.stringify({
      pinataMetadata: metadata,
      cidVersion: 0,
    });

    formData.append("file", file);
    formData.append("pinataOptions", options);

    const response = await pinata.pin_file(formData);
    return response.IpfsHash;
  };

  const handleUploadClick = async () => {
    if (!file) {
      toast("File Note Found, Select the file properly");
      return;
    }
    const cid = await uploadFile();

    const status = await Contract.insertUserData(dataName, cid);
    if (!status) {
      toast("Error! file upload failed");
      return;
    }
    toast("Success! file uploaded successfully");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 font-bold">
      <div className="relative">
        <div>
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <PublishIcon />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter data name"
              value={dataName}
              onChange={(e) => setDataName(e.target.value)}
            />
          </div>
        </div>
        <div className="border border-dashed border-gray-500 relative">
          <input
            type="file"
            className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"
            onChange={(e) => handleFileChange(e)}
          />
          <div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
            <h4>
              Drop file anywhere to upload
              <br />
              or
            </h4>
            <p className="">{file ? `${file.name}` : "Select a File"}</p>
          </div>
          <button
            onClick={() => handleUploadClick()}
            className="w-1/2 my-5 block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUploadMultiple;
