import React from "react";

const ShowCard = ({ content }) => {
  return (
    <div className="flex justify-center">
      <div className="rounded-sm shadow-sm bg-gray-100 max-w-sm flex flex-col justify-center items-center">
        <a
          className="text-6xl"
          href="#!"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          <img
            className="rounded-t-md"
            src="https://mdbootstrap.com/img/new/standard/nature/182.jpg"
            alt=""
          />
        </a>
        <div className="p-6 flex flex-col">
          <h5 className="text-gray-900 text-xl font-medium mb-2">
            {content.user_data_name.slice(0, 10)}...
          </h5>
          {/* <p className="text-gray-700 text-base mb-4">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p> */}
          <button
            type="button"
            className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
