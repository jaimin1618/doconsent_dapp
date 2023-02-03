import React, { useState, useEffect } from "react";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DataObjectIcon from "@mui/icons-material/DataObject";

import Contract from "./utilities/contract/contract";

const ShowData = () => {
  const [indexes, setIndexes] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const get_indexes = async () => {
      const raw = await Contract.getCurrentUserDataIndexes();
      const idx = raw.map((el) => parseInt(el, 10));
      setIndexes(idx);
      return idx;
    };

    const get_data = async () => {
      const idx = await get_indexes();
      const _cards = idx.map(async (el, index) => {
        return await Contract.getUserDataByID(el);
      });
      setCards(_cards);
      return _cards;
    };

    setCards(get_data());
  }, []);

  return (
    <div className="h-screen">
      <section className="container px-6 py-4 mx-auto">
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Show data */}
          {cards.map((el, idx) => {
            // console.log(el);
            return (
              <div
                key={idx}
                className="flex items-center p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 hover:bg-slate-2 hover:bg-slate-200"
              >
                <div className="p-3 mr-4 bg-blue-500  text-white rounded-full">
                  <DataObjectIcon />
                </div>
                <div className="w-full h-full flex justify-around items-center">
                  {/* <p className="mb-2 text-sm font-medium text-gray-900">Data Name</p> */}
                  <p className="text-lg font-normal text-gray-800">
                    {el[1]}
                    {/* {el} */}
                  </p>
                  <button className="flex justify-around text-green-700">
                    <OpenWithIcon />
                  </button>
                  <button className="flex justify-around text-red-700">
                    <DeleteIcon />
                  </button>
                  <button className="flex justify-around text-blue-700">
                    <EditIcon />
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

export default ShowData;
