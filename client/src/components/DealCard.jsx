import { useState } from 'react';
import { useDealStore } from '../store';
import DealForm from './DealForm';

export default function DealCard({ deal }) {
  const { deleteDeal } = useDealStore();
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeleting(true);
      try {
        await deleteDeal(deal.id);
      } catch (error) {
        alert(error);
      }
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'blue',
      won: 'green',
      lost: 'red',
      'on-hold': 'yellow',
    };
    return colors[status] || 'gray';
  };

  const statusColor = getStatusColor(deal.status);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{deal.description}</p>
        
        <div className="mb-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Value:</span>
            <span className="font-semibold">{deal.currency} {deal.value?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Probability:</span>
            <span className="font-semibold">{deal.probability}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className={`bg-${statusColor}-100 text-${statusColor}-700 text-xs px-2 py-1 rounded capitalize`}>
            {deal.status}
          </span>
          <span className="text-gray-500 text-xs">
            Close: {new Date(deal.expected_close_date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {showForm && <DealForm deal={deal} onClose={() => setShowForm(false)} />}
    </>
  );
}
