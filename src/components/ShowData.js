import React, { useState, useEffect } from "react";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
// import DownloadIcon from "@mui/icons-material/Download";
import OfflineShareIcon from "@mui/icons-material/OfflineShare";
import { toast } from "react-toastify";

import Modal from "./Modal";
import Contract from "./utilities/contract/contract";
import { ColorRing } from "react-loader-spinner";

const ShowData = () => {
  const [cards, setCards] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const display_data = async (el) => {
    const cid = el.user_data_cid;
    const location = process.env.REACT_APP_IPFS_PUBLIC_GATEWAY + cid;
    window.location.href = location;
  };

  const delete_data = async (el) => {
    const id = el.user_data_id;
    const cid = el.user_data_cid;
    console.log(id, cid);

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
      console.log(cards);
      setIsLoading(false);
    };

    get_data();
  }, []);

  return (
    <div className="h-screen">
      <Modal
        modalContent={modalContent}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <section
        className={`container px-6 py-4 mx-auto ${
          isLoading ? "flex justify-center" : ""
        }`}
      >
        <div
          className={` ${
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
          {cards.map((el, idx) => {
            console.log(el);
            return (
              <div
                key={idx}
                className="relative items-center p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 hover:bg-slate-2 hover:bg-slate-200 flex"
              >
                <div className="p-1 mr-2 bg-blue-500  text-white rounded-full">
                  <DescriptionIcon />
                </div>
                <div className="w-full h-full flex justify-start items-center">
                  <p className="font-bold text-xs text-gray-100 w-2/3 bg-cyan-700 h-full flex items-center justify-start pl-1 rounded-sm">
                    [{parseInt(el.user_data_id, 10)}]
                    {el.user_data_name.slice(0, 12)}...
                  </p>
                  <div className="flex justify-evenly h-full w-1/2 items-center">
                    <button
                      onClick={() => display_data(el)}
                      className="flex justify-around text-green-800 bg-slate-100 p-2 rounded-sm"
                    >
                      <AttachmentIcon />
                    </button>
                    {el.isOwner ? (
                      <button
                        onClick={() => delete_data(el)}
                        className="flex justify-around text-red-700 bg-slate-100 p-2 rounded-sm"
                      >
                        <DeleteIcon />
                      </button>
                    ) : (
                      <button className="flex justify-around text-blue-700 bg-slate-100 p-2 rounded-sm">
                        <OfflineShareIcon />
                      </button>
                    )}

                    <button>
                      {parseInt(el.data_verification_stage, 10) === 1 &&
                        parseInt(el.issuer_verification_status, 10) === 1 && (
                          <VerifiedIcon className="absolute -top-2 -right-2 text-green-800" />
                        )}
                      {parseInt(el.data_verification_stage, 10) === 1 &&
                        parseInt(el.issuer_verification_status, 10) === 2 && (
                          <CancelIcon className="absolute -top-2 -right-2 text-red-700" />
                        )}
                    </button>
                  </div>
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

export default ShowData;
