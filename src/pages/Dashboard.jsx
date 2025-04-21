import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Welcome to TeamCollab</h2>
          <p className="text-gray-700">Use the sidebar to navigate through the application.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
