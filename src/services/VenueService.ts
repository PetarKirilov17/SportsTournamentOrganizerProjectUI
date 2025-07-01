import API_BASE_URL from './api';
import { Venue } from '../types';

export const VenueService = {
  getVenues: async (): Promise<Venue[]> => {
    const response = await fetch(`${API_BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
    return response.json();
  },

  getVenueById: async (id: number): Promise<Venue> => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch venue with id ${id}`);
    }
    return response.json();
  },

  createVenue: async (venueData: Omit<Venue, 'id'>): Promise<Venue> => {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venueData),
    });
    if (!response.ok) {
      throw new Error('Failed to create venue');
    }
    return response.json();
  },

  updateVenue: async (id: number, venueData: Partial<Omit<Venue, 'id'>>): Promise<Venue> => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venueData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update venue with id ${id}`);
    }
    return response.json();
  },

  deleteVenue: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete venue with id ${id}`);
    }
  },
}; 