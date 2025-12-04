import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r hidden md:block">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Micrositio</h3>
        <p className="text-xs text-gray-500 dark:text-gray-300">Panel de administración</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 dark:text-gray-200'}`}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/posts" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 dark:text-gray-200'}`}>
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/settings" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 dark:text-gray-200'}`}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
