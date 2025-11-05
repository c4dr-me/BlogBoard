import { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const ConfirmDialog = memo(({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to delete this post?',
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30"
      onClick={handleBackdropClick}
    >
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">{message}</p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;