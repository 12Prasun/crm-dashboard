import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, useCompanyStore, useContactStore, useDealStore } from '../store';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const { contacts, fetchContacts } = useContactStore();
  const { deals, fetchDeals } = useDealStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies(1, '');
    fetchContacts(1, '');
    fetchDeals(1, {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const wonDeals = deals.filter((d) => d.status === 'won');
  const totalValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CRM Dashboard</h1>
          <div className="flex items-center gap-6">
            <Link to="/companies" className="text-gray-700 hover:text-blue-600 font-medium">
              Companies
            </Link>
            <Link to="/contacts" className="text-gray-700 hover:text-blue-600 font-medium">
              Contacts
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-blue-600 font-medium">
              Deals
            </Link>
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Companies */}
          <Link to="/companies" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Companies</h3>
            <p className="text-3xl font-bold text-blue-600">{companies.length}</p>
            <p className="text-gray-600 text-sm">Total companies</p>
          </Link>

          {/* Card 2: Contacts */}
          <Link to="/contacts" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacts</h3>
            <p className="text-3xl font-bold text-green-600">{contacts.length}</p>
            <p className="text-gray-600 text-sm">Total contacts</p>
          </Link>

          {/* Card 3: Deals */}
          <Link to="/deals" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Deals</h3>
            <p className="text-3xl font-bold text-purple-600">
              {deals.filter((d) => d.status === 'open').length}
            </p>
            <p className="text-gray-600 text-sm">Active opportunities</p>
          </Link>

          {/* Card 4: Won Value */}
          <Link to="/deals" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Won Value</h3>
            <p className="text-3xl font-bold text-orange-600">${totalValue.toLocaleString()}</p>
            <p className="text-gray-600 text-sm">From closed deals</p>
          </Link>
        </div>

        {/* Deal Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deal Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Deal Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Open</span>
                <span className="font-semibold text-blue-600">
                  {deals.filter((d) => d.status === 'open').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Won</span>
                <span className="font-semibold text-green-600">
                  {deals.filter((d) => d.status === 'won').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Lost</span>
                <span className="font-semibold text-red-600">
                  {deals.filter((d) => d.status === 'lost').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">On Hold</span>
                <span className="font-semibold text-yellow-600">
                  {deals.filter((d) => d.status === 'on-hold').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Avg Deal Value</span>
                <span className="font-semibold">
                  ${deals.length > 0 ? (deals.reduce((sum, d) => sum + d.value, 0) / deals.length).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Win Rate</span>
                <span className="font-semibold">
                  {deals.length > 0
                    ? Math.round((wonDeals.length / deals.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Contacts per Company</span>
                <span className="font-semibold">
                  {companies.length > 0
                    ? Math.round(contacts.length / companies.length)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  );
}
