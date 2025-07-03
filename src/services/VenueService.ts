import { API_BASE_URL } from './api';
import { Venue } from '../types';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const VenueService = {
  getVenues: async (): Promise<Venue[]> => {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
    return response.json();
  },

  getVenueById: async (id: number): Promise<Venue> => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      headers: authHeaders(),
    });
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
        ...authHeaders(),
      } as HeadersInit,
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
        ...authHeaders(),
      } as HeadersInit,
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
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete venue with id ${id}`);
    }
  },
}; 