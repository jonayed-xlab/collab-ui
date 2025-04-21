import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/logs');
      setLogs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">Logs</h2>
          <div className="bg-white rounded shadow p-4 max-h-[600px] overflow-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs found.</p>
            ) : (
              <ul className="space-y-2 font-mono text-sm">
                {logs.map((log, index) => (
                  <li key={index} className="border-b border-gray-200 pb-1">
                    {JSON.stringify(log)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Logs;
