import React from 'react';
import { RxCross1 } from 'react-icons/rx'; // Optional: for a close button

/**
 * A reusable modal component.
 *
 * @param {object} props - The component props.
 * @param {Function} props.onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 */
const Modal = ({ onClose, children }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-lg shadow-xl relative max-w-md w-full m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Close modal"
                >
                    <RxCross1 size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
