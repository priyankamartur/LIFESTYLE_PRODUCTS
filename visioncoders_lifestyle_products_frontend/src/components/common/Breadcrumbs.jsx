import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on homepage
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'home')) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 py-4 mb-4 select-none">
      <Link to="/home" className="flex items-center gap-1 hover:text-brand-primary transition">
        <Home size={15} />
        <span>Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-gray-600" />
            {isLast ? (
              <span className="text-gray-200 font-semibold">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-brand-primary transition">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
