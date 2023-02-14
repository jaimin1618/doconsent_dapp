import React, { useState, useEffect } from "react";
import DataObjectIcon from "@mui/icons-material/DataObject";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";

import Modal from "./Modal";
import Contract from "./utilities/contract/contract";
// import IPFS from "./utilities/ipfs/ipfs";

const VerifyAccessData = () => {
  const [accessData, setAccessData] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const display_data = async (el) => {
    const cid = el.user_data_cid;
    const location = process.env.REACT_APP_IPFS_PUBLIC_GATEWAY + cid;
    window.location.href = location;
  };

  const approve_data = async (el) => {
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
  };

  const reject_data = async (el) => {
    const status = await Contract.issuerDataVerification(
      parseInt(el.user_data_id, 10),
      2
    );
    if (!status) {
      toast("Data rejection failed due to some reasons, Try again later");
    } else {
      toast("Data rejected successfully approved successfully");
    }
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
      console.log(results);
      setIsLoading(false);
    };

    getAccessData();
  }, []);

  return (
    <div className="h-screen">
      <Modal
        modalContent={modalContent}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <section className="container px-6 py-4 mx-auto">
        <div
          className={`${
            isLoading
              ? "h-screen w-full flex justify-center items-start"
              : "grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3"
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
            ""
          )}

          {/* Show data */}

          {accessData.map((el, idx) => {
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
                    {el.user_data_name.split(0, 30)}
                  </p>
                  {/* <p className="text-sm font-normal text-gray-800">
                    {el.user_data_cid.substr(0, 30)}...
                  </p> */}
                  <button className="flex justify-around text-blue-800 bg-slate-100 p-2 rounded-sm">
                    <VisibilityIcon onClick={() => display_data(el)} />
                  </button>
                  <button className="flex justify-around text-green-900 bg-slate-100 p-2 rounded-sm">
                    <DoneOutlineIcon onClick={() => approve_data(el)} />
                  </button>
                  <button className="flex justify-around text-red-900 bg-slate-100 p-2 rounded-sm">
                    <CancelIcon onClick={() => reject_data(el)} />
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

export default VerifyAccessData;
