import React from 'react';
import './style.css';

const CustomModal = ({ show, onClose, title, message, onConfirm, confirmText, cancelText }) => {
    if (!show) return null;

    return (
        <div className="modal-container">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="d-flex justify-content-around">
                    {/* Hanya menampilkan tombol "Yes" (atau confirmText) jika cancelText tidak diberikan */}
                    <button className="modal-ok-btn" onClick={onConfirm}>{confirmText || "Yes"}</button>

                    {/* Menampilkan tombol "No" hanya jika cancelText ada */}
                    {cancelText &&
                        <button className="modal-ok-btn" onClick={onClose}>{cancelText || "No"}</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
