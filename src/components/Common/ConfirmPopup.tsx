import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/ConfirmPopup.css';

interface ConfirmPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
  confirmLoadingText?: string;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirmLoading = false,
  confirmLoadingText = 'Processing...',
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button
            className="popup-button popup-button--cancel"
            onClick={onCancel}
            disabled={isConfirmLoading}
          >
            {cancelText}
          </button>
          <button
            className="popup-button popup-button--confirm"
            onClick={onConfirm}
            disabled={isConfirmLoading}
            aria-busy={isConfirmLoading}
          >
            {isConfirmLoading ? confirmLoadingText : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
