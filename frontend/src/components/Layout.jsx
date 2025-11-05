import { memo } from 'react';
import Navbar from './Navbar';

const Layout = memo(({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-6">
        {children}
      </main>
    </div>
  );
});

Layout.displayName = 'Layout';
export default Layout;