import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <button
  onClick={logout}
  className="bg-red-500 text-white px-4 py-2 rounded-md 
           hover:bg-red-600 active:scale-95 
           transition-all duration-200 shadow-sm
           hover:shadow-md"
>
  Logout
</button>
    </header>
  );
};

export default Header;
