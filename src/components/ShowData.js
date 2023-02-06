import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { toast } from "react-toastify";

import Modal from "./Modal";
import Contract from "./utilities/contract/contract";
import IPFS from "./utilities/ipfs/ipfs";

const ShowData = () => {
  const [cards, setCards] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const display_data = async (el) => {
    const cid = el.user_data_cid;
    const raw = await IPFS.read_data(cid);
    const json = JSON.parse(raw);
    setModalContent({ dataName: json.data_name, content: json.data_content });
    setIsModalOpen(true);
  };

  const delete_data = async (el) => {
    const id = el.user_data_id;
    const status = await Contract.removeUserData(id);
    if (!status) {
      toast("Data delete failed, Try again later");
      return;
    } else {
      toast("Data deleted successfully");
    }

    const _cards = cards.filter((el) => el.user_data_id !== id);
    setCards(_cards);
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
      setCards(results);
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
      <section className="container px-6 py-4 mx-auto">
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Show data */}
          {cards.map((el, idx) => {
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
                    {el.user_data_name}
                  </p>
                  {/* <p className="text-sm font-normal text-gray-800"> */}
                  {/* {el.user_data_cid.substr(0, 3).} */}
                  {/* </p> */}
                  <button className="flex justify-around text-green-800 bg-slate-100 p-2 rounded-sm">
                    <VisibilityIcon onClick={() => display_data(el)} />
                  </button>
                  <button
                    onClick={() => delete_data(el)}
                    className="flex justify-around text-red-700 bg-slate-100 p-2 rounded-sm"
                  >
                    <DeleteIcon />
                  </button>
                  {/* <button className="flex justify-around text-blue-700">
                    <EditIcon />
                  </button> */}
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
