import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Team } from '../../types';

interface TeamFormProps {
  team?: Team | null;
  onSubmit: (team: Omit<Team, 'id'>) => void;
  onCancel: () => void;
}

export function TeamForm({ team, onSubmit, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'amateur' as 'amateur' | 'professional' | 'youth',
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        category: team.category || 'amateur',
      });
    }
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {team ? 'Edit Team' : 'Add New Team'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as 'amateur' | 'professional' | 'youth' })}
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
            {team ? 'Update' : 'Create'} Team
          </button>
        </div>
      </form>
    </div>
  );
}