import { useState } from 'react';
import { useContactStore } from '../store';
import ContactForm from './ContactForm';

export default function ContactCard({ contact }) {
  const { deleteContact } = useContactStore();
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setDeleting(true);
      try {
        await deleteContact(contact.id);
      } catch (error) {
        alert(error);
      }
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-2">{contact.first_name} {contact.last_name}</h3>
        <p className="text-gray-600 text-sm mb-1">{contact.job_title}</p>
        <a href={`mailto:${contact.email}`} className="text-blue-600 text-sm hover:underline block mb-1">
          {contact.email}
        </a>
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="text-blue-600 text-sm hover:underline block mb-4">
            {contact.phone}
          </a>
        )}
        {contact.is_primary && (
          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mb-4">
            Primary Contact
          </span>
        )}

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

      {showForm && <ContactForm contact={contact} onClose={() => setShowForm(false)} />}
    </>
  );
}
