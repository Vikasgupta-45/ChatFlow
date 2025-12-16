import React from 'react';
import { createPortal } from 'react-dom';

const DeleteModal = ({ isOpen, onClose, onConfirm, chatName }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
            <div
                className="bg-[#241e1e] border border-[#a37dd6]/20 rounded-2xl p-6 w-[400px] shadow-2xl transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-medium text-white mb-3">Delete chat?</h2>

                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                    This will delete <strong className="font-semibold text-white">{chatName}</strong>.
                    <br />
                    <span className="text-gray-500 text-sm mt-1 block">
                        Visit settings to delete any memories saved during this chat.
                    </span>
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-full text-white bg-transparent border border-gray-600 hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-full text-[#361c1c] bg-[#ffb0b0] hover:bg-[#ff9e9e] transition-colors text-sm font-semibold cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteModal;
