import React from "react";
import "./styles/filterDropDown.css";
import { RequestFilter } from "../constants";

const FilterDropDown = ({ setFilter, filter }) => {
  return (
    <div className="bg-white flex flex-col justify-center">
      <div className="flex items-center justify-center">
        <div className=" relative inline-block text-left dropdown">
          <span className="rounded shadow">
            <button
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
              type="button"
              aria-haspopup="true"
              aria-expanded="true"
              aria-controls="headlessui-menu-items-117"
            >
              <span className="font-bold text-xs">Filters</span>
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </span>
          <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
            <div
              className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-sm shadow outline-none"
              aria-labelledby="headlessui-menu-button-1"
              id="headlessui-menu-items-117"
              role="menu"
            >
              <div className="py-1">
                <button
                  onClick={() => setFilter(RequestFilter.ALL)}
                  className="hover:bg-cyan-700 font-medium text-xs text-gray-700 flex justify-between w-full px-4 py-2 leading-5 text-left"
                  role="menuitem"
                >
                  All
                </button>
                <button
                  onClick={() => setFilter(RequestFilter.PENDING)}
                  className="hover:bg-cyan-700 font-medium text-xs text-gray-700 flex justify-between w-full px-4 py-2 leading-5 text-left"
                  role="menuitem"
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter(RequestFilter.ACCEPTED)}
                  className="hover:bg-cyan-700 font-medium text-xs text-gray-700 flex justify-between w-full px-4 py-2 leading-5 text-left"
                  role="menuitem"
                >
                  Accepted
                </button>

                <button
                  onClick={() => setFilter(RequestFilter.REJECTED)}
                  className="hover:bg-cyan-700 font-medium text-xs text-gray-700 flex justify-between w-full px-4 py-2 leading-5 text-left"
                  role="menuitem"
                >
                  Rejected
                </button>

                <button
                  onClick={() => setFilter(RequestFilter.ACCEPTED_OR_REJECTED)}
                  className="hover:bg-cyan-700 font-medium text-xs text-gray-700 flex justify-between w-full px-4 py-2 leading-5 text-left"
                  role="menuitem"
                >
                  Accepted or Rejected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDropDown;
