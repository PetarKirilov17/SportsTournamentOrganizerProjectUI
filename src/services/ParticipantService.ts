import API_BASE_URL from './api';

export interface Participant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  category?: 'amateur' | 'professional' | 'youth';
}

export const ParticipantService = {
  getParticipants: async (): Promise<Participant[]> => {
    const response = await fetch(`${API_BASE_URL}/participants`);
    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }
    return response.json();
  },

  getParticipantById: async (id: number): Promise<Participant> => {
    const response = await fetch(`${API_BASE_URL}/participants/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch participant with id ${id}`);
    }
    return response.json();
  },

  createParticipant: async (participantData: Omit<Participant, 'id'>): Promise<Participant> => {
    const response = await fetch(`${API_BASE_URL}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(participantData),
    });
    if (!response.ok) {
      throw new Error('Failed to create participant');
    }
    return response.json();
  },

  updateParticipant: async (id: number, participantData: Partial<Omit<Participant, 'id'>>): Promise<Participant> => {
    const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(participantData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update participant with id ${id}`);
    }
    return response.json();
  },

  deleteParticipant: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete participant with id ${id}`);
    }
  },
}; 