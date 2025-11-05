import { memo } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = memo(({ value, onChange }) => {
  return (
    <div className="relative max-w-md w-full">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;