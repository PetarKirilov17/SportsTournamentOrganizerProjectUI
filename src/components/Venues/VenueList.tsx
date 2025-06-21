import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { Venue } from '../../types';
import { VenueForm } from './VenueForm';

interface VenueListProps {
  venues: Venue[];
  onAdd: (venue: Omit<Venue, 'id'>) => void;
  onEdit: (id: number, venue: Partial<Venue>) => void;
  onDelete: (id: number) => void;
}

export function VenueList({ venues, onAdd, onEdit, onDelete }: VenueListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const handleSubmit = (venueData: Omit<Venue, 'id'>) => {
    if (editingVenue) {
      onEdit(editingVenue.id, venueData);
      setEditingVenue(null);
    } else {
      onAdd(venueData);
    }
    setShowForm(false);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Venues</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {showForm && (
        <VenueForm
          venue={editingVenue}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingVenue(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{venue.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(venue)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(venue.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {venue.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{venue.address}</span>
                </div>
              )}
              {venue.capacity && (
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">Capacity: {venue.capacity.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}