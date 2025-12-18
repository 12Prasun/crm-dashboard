import { useEffect, useState } from 'react';
import { useDealStore } from '../store';
import DealForm from '../components/DealForm';
import DealCard from '../components/DealCard';

export default function Deals() {
  const { deals, loading, error, total, page, fetchDeals } = useDealStore();
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDeals(page, filters);
  }, [page, filters]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Deals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Deal
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="on-hold">On Hold</option>
        </select>

        <input
          type="number"
          placeholder="Min Value"
          onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Max Value"
          onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showForm && <DealForm onClose={() => setShowForm(false)} />}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {deals.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          No deals found. Create your first deal!
        </div>
      )}
    </div>
  );
}
