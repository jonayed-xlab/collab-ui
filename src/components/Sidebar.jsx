import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { to: '/users', label: 'Users', icon: 'fa-users' },
    { to: '/projects', label: 'Projects', icon: 'fa-folder' },
    { to: '/work-packages', label: 'Work Packages', icon: 'fa-tasks' },
    { to: '/logs', label: 'Logs', icon: 'fa-file-alt' },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-200">
        TeamCollab
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`
            }
          >
            <i className={`fas ${icon} w-5`}></i>
            <span className="ml-3">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
