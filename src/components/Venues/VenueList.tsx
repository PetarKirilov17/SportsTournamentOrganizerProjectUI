import React, { useState, useEffect } from 'react';
import { VenueService } from '../../services/VenueService';
import { Venue } from '../../types';
import { Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { VenueForm } from './VenueForm';

export function VenueList() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await VenueService.getVenues();
      setVenues(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch venues');
      console.error(err);
    }
  };

  const handleAdd = async (venueData: Omit<Venue, 'id'>) => {
    try {
      await VenueService.createVenue(venueData);
      fetchVenues();
      setShowForm(false);
    } catch (err) {
      setError('Failed to add venue');
      console.error(err);
    }
  };

  const handleEdit = async (id: number, venueData: Partial<Omit<Venue, 'id'>>) => {
    try {
      await VenueService.updateVenue(id, venueData);
      fetchVenues();
      setEditingVenue(null);
      setShowForm(false);
    } catch (err) {
      setError(`Failed to update venue with id ${id}`);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await VenueService.deleteVenue(id);
      fetchVenues();
    } catch (err) {
      setError(`Failed to delete venue with id ${id}`);
      console.error(err);
    }
  };

  const handleSubmit = (venueData: Omit<Venue, 'id'>) => {
    if (editingVenue) {
      handleEdit(editingVenue.id, venueData);
    } else {
      handleAdd(venueData);
    }
  };

  const handleEditClick = (venue: Venue) => {
    setEditingVenue(venue);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Venues</h3>
        <button
          onClick={() => {
            setEditingVenue(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

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
                  onClick={() => handleEditClick(venue)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(venue.id)}
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