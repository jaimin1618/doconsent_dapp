import React from "react";
import Contract from "./utilities/contract/contract";

const Main = () => {
  return (
    <div className="bg-white dark:bg-gray-900 h-screen">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage: "url('/media/Banner.jpg')",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">Consent App</h2>

              <p className="max-w-xl mt-3 text-gray-300">
                Your secure hold on your data. Consept decentralise application
                lets you make your own decision on how you want to keep your
                data private. It is upto you to make a decision who sees your
                and who don't
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                Consent Application
              </h2>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Connect your wallet to use the application
              </p>
            </div>

            <div className="mt-8">
              <form>
                <div className="mt-6">
                  <button
                    onClick={async () => await Contract.requestAccounts()}
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Connect Wallet (MetaMask)
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                Don't have Metamask, No worry! integrate a browser extension
                from this&nbsp;
                <a
                  target="_blank"
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  link
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
