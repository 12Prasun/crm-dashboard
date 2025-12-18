import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CRM Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.email}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Companies */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Companies</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-gray-600 text-sm">Total companies</p>
          </div>

          {/* Card 2: Contacts */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacts</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-gray-600 text-sm">Total contacts</p>
          </div>

          {/* Card 3: Deals */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deals</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600 text-sm">Total deals</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}
