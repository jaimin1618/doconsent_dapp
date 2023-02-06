import React from "react";
import { RequestFilter } from "../constants";

export const DropDown = ({ setFilter, filter }) => {
  return (
    <div className="from-teal-100 via-teal-300 to-teal-500 flex justify-center items-center">
      <div className="relative mt-2 -mb-3">
        <button className="bg-sky-700 p-2 font-bold text-gray-100 rounded-md peer focus:bg-sky-400 focus:text-gray-200 transition-all duration-200  ">
          Filter Requests
        </button>
        <div
          className=' w-80 absolute top-5 z-10
            after:content-[""] after:inline-block after:absolute after:top-0 after:bg-white/40
            after:w-full after:h-full after:-z-20 after:blur-[2px] after:rounded-lg
        peer-focus:top-12 peer-focus:opacity-100 peer-focus:visible 
        transition-all duration-300 invisible  opacity-0 
        '
        >
          <ul className="py-6 px-3 flex flex-col gap-3">
            <li
              onClick={() => setFilter(RequestFilter.ALL)}
              className="cursor-pointer bg-red-500 p-3 rounded-md hover:opacity-90 text-white"
            >
              ALL Requests
            </li>
            <li
              onClick={() => setFilter(RequestFilter.ACCEPTED)}
              className="cursor-pointer bg-sky-700 p-3 rounded-md hover:opacity-90 text-white"
            >
              ACCEPTED Requests
            </li>
            <li
              onClick={() => setFilter(RequestFilter.REJECTED)}
              className="cursor-pointer bg-blue-600 p-3 rounded-md hover:opacity-90 text-white"
            >
              REJECTED Requests
            </li>
            <li
              onClick={() => setFilter(RequestFilter.PENDING)}
              className="cursor-pointer bg-cyan-500 p-3 rounded-md hover:opacity-90 text-white"
            >
              PENDING Requests
            </li>
            <li
              onClick={() => setFilter(RequestFilter.ACCEPTED_OR_REJECTED)}
              className="cursor-pointer bg-amber-500 p-3 rounded-md hover:opacity-90 text-white"
            >
              ACCEPTED or REJECTED Requests
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
