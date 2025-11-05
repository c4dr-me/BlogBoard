import { memo } from 'react';
import { FiPlus } from 'react-icons/fi';

const FloatingButton = memo(({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-105"
      aria-label="Create new post"
    >
      <FiPlus className="text-xl" />
    </button>
  );
});

FloatingButton.displayName = 'FloatingButton';
export default FloatingButton;