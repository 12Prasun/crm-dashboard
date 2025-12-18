import { useEffect, useState } from 'react';
import { useCompanyStore } from '../store';
import CompanyForm from '../components/CompanyForm';
import CompanyCard from '../components/CompanyCard';

export default function Companies() {
  const { companies, loading, error, total, page, fetchCompanies } = useCompanyStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCompanies(page, search);
  }, [page, search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Company
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showForm && <CompanyForm onClose={() => setShowForm(false)} />}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {companies.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          No companies found. Create your first company!
        </div>
      )}
    </div>
  );
}
