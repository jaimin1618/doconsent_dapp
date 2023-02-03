import React, { useState, useEffect } from "react";
import Contract from "./utilities/contract/contract";
import IPFS from "./utilities/ipfs/ipfs";
import { toast } from "react-toastify";

import OpenWithIcon from "@mui/icons-material/OpenWith";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DataObjectIcon from "@mui/icons-material/DataObject";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Read = () => {
  const [indexes, setIndexes] = useState([]);
  const [dataName, setDataName] = useState("");
  const [dataContent, setDataContent] = useState("");

  const get_selected_data = async (id) => {
    const data = await Contract.getUserDataByID(id);
    setDataName(data[1]);

    try {
      const content = await IPFS.read_data(data[2]);
      const json = JSON.parse(content);

      setDataName(json.data_name);
      setDataContent(json.data_content);

      alert(`Data name: ${dataName}, Data content: ${dataContent}`);
    toast("Data will be displayed successfull");
    } catch (e) {
      console.error("Error found: ", e);
      toast("There was some problem fetching your data, Try again later");
    }
  };

  const remove_selected_data = async (id) => {
    const status = await Contract.removeUserData(id);
    if (!status) {
      toast("Data delete failed, Try again later");
      return;
    } else {
      toast("Data deleted successfully");
    }

    const idx = indexes.filter((el) => el != id);
    setIndexes(idx);
  };

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getCurrentUserDataIndexes();
      const idx = raw.map((el) => parseInt(el, 10));
      setIndexes(idx);
    };

    get_indexes().catch((e) => {
      console.error("Error: ", e);
    });
  }, [indexes]);

  return (
    <div className="h-screen">
      <section className="container px-6 py-4 mx-auto">
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {indexes.map((el, idx) => (
            <div
              key={idx}
              className="flex items-center p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 hover:bg-slate-2 hover:bg-slate-200"
            >
              <div className="p-3 mr-4 bg-blue-500  text-white rounded-full">
                <DataObjectIcon />
              </div>
              <div className="w-full h-full flex justify-around items-center">
                {/* <p className="mb-2 text-sm font-medium text-gray-900">{el}</p> */}
                <p className="text-lg font-normal text-gray-800">
                  ID:{el}
                </p>
                <button className="flex justify-around text-green-700">
                  <OpenWithIcon onClick={() => get_selected_data(el)} />
                </button>
                <button className="flex justify-around text-red-700">
                  <DeleteIcon onClick={() => remove_selected_data(el)} />
                </button>
                <button className="flex justify-around text-blue-700">
                  <EditIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Read;
