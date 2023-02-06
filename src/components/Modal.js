import React from "react";
import "./styles/modalStyles.css";

const Modal = ({ modalContent, setIsModalOpen, isModalOpen }) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        className={`main-modal ${
          isModalOpen ? "fadeIn" : "fadeOut"
        }  fixed w-full h-100 inset-0 z-50 overflow-hidden ${
          isModalOpen ? "flex" : "hidden"
        } justify-center items-center animated fadeIn faster`}
        style={{ background: "rbga(0, 0, 0, 0.7)" }}
      >
        <div className="border border-teal-500 modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="modal-content py-4 text-left px-6">
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold">{modalContent.dataName}</p>
              <div
                className="modal-close cursor-pointer z-50"
                onClick={() => closeModal()}
              >
                <svg
                  className="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
              </div>
            </div>
            <div className="my-5">
              <p>{modalContent.content}</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => closeModal()}
                className="focus:outline-none modal-close px-4 bg-gray-400 p-3 rounded-lg text-black hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

/**
<script>
		const modal = document.querySelector('.main-modal');
		const closeButton = document.querySelectorAll('.modal-close');

		const modalClose = () => {
			modal.classList.remove('fadeIn');
			modal.classList.add('fadeOut');
			setTimeout(() => {
				modal.style.display = 'none';
			}, 500);
		}

		const openModal = () => {
			modal.classList.remove('fadeOut');
			modal.classList.add('fadeIn');
			modal.style.display = 'flex';
		}

		for (let i = 0; i < closeButton.length; i++) {

			const elements = closeButton[i];

			elements.onclick = (e) => modalClose();

			modal.style.display = 'none';

			window.onclick = function (event) {
				if (event.target == modal) modalClose();
			}
		}
	</script> 
 */
