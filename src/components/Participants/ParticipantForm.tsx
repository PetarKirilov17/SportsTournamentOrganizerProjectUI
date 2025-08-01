import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Participant } from '../../services/ParticipantService';

interface ParticipantFormProps {
  participant?: Participant | null;
  onSubmit: (participant: Omit<Participant, 'id' | 'createdAt' | 'updatedAt' | 'teamMemberships'>) => void;
  onCancel: () => void;
}

export function ParticipantForm({ participant, onSubmit, onCancel }: ParticipantFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    category: 'amateur' as 'amateur' | 'professional' | 'youth',
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        category: participant.category,
      });
    } else {
      // Reset form when participant is null (add mode)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        category: 'amateur',
      });
    }
  }, [participant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {participant ? 'Edit Participant' : 'Add New Participant'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Participant['category'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="amateur">Amateur</option>
            <option value="professional">Professional</option>
            <option value="youth">Youth</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {participant ? 'Update' : 'Create'} Participant
          </button>
        </div>
      </form>
    </div>
  );
}