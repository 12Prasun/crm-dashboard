import { useState } from 'react';
import { useCompanyStore } from '../store';
import CompanyForm from './CompanyForm';

export default function CompanyCard({ company }) {
  const { deleteCompany } = useCompanyStore();
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setDeleting(true);
      try {
        await deleteCompany(company.id);
      } catch (error) {
        alert(error);
      }
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
        <p className="text-gray-600 text-sm mb-1">{company.industry}</p>
        {company.website && (
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline block mb-2">
            {company.website}
          </a>
        )}
        <p className="text-gray-500 text-sm mb-4">Employees: {company.employee_count}</p>

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

      {showForm && <CompanyForm company={company} onClose={() => setShowForm(false)} />}
    </>
  );
}
