import React from "react";
import { useGlobalContext } from "./context";

const Modal = () => {
  const { modalOpen, closeModal, correct, questions } = useGlobalContext();
  return (
    <div
      className={`${modalOpen ? "modal-container isOpen" : "modal-container"}`}
    >
      <div className="modal-content">
        <h2>congrats!</h2>
        <p>
          You answered {((correct / questions.length) * 100).toFixed(0)}% of the
          questions correctly
        </p>
        <button className="close-btn" onClick={closeModal}>
          Play again
        </button>
      </div>
    </div>
  );
  return <h2>modal component</h2>;
};

export default Modal;
