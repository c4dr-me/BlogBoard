import { memo } from 'react';

const LoadingSpinner = memo(() => (
  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-cyan-500 animate-pulse" />
));

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;