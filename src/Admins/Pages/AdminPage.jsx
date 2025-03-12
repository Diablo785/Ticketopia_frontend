import React from "react";

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex flex-col space-y-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all">
          Add Event
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all">
          Manage Events
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-all">
          View Reports
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all">
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
