import API_BASE_URL from './api';
import { Participant } from '../types';

export interface TeamMembership {
  teamId: number;
  teamName: string;
  teamCategory: 'amateur' | 'professional' | 'youth';
  role: string;
  jerseyNumber?: number;
  addedAt: string;
}

export interface ParticipantWithMemberships extends Participant {
  createdAt: string;
  updatedAt: string;
  teamMemberships: TeamMembership[];
}

// Helper function to transform backend response to frontend format
const transformParticipantResponse = (data: any): ParticipantWithMemberships => {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    category: data.category?.toLowerCase() as 'amateur' | 'professional' | 'youth',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    teamMemberships: data.team_memberships?.map((membership: any) => ({
      teamId: membership.team_id ?? membership.teamId,
      teamName: membership.team_name ?? membership.teamName,
      teamCategory: (membership.team_category ?? membership.teamCategory)?.toLowerCase() as 'amateur' | 'professional' | 'youth',
      role: membership.role,
      jerseyNumber: membership.jersey_number ?? membership.jerseyNumber,
      addedAt: membership.added_at ?? membership.addedAt,
    })) || [],
  };
};

export const ParticipantService = {
  getParticipants: async (): Promise<ParticipantWithMemberships[]> => {
    const response = await fetch(`${API_BASE_URL}/participants`);
    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }
    const data = await response.json();
    return data.map(transformParticipantResponse);
  },

  getParticipantById: async (id: number): Promise<ParticipantWithMemberships> => {
    const response = await fetch(`${API_BASE_URL}/participants/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch participant with id ${id}`);
    }
    const data = await response.json();
    return transformParticipantResponse(data);
  },

  createParticipant: async (participantData: Omit<Participant, 'id'>): Promise<ParticipantWithMemberships> => {
    // Convert camelCase to snake_case for API
    const apiData = {
      first_name: participantData.firstName,
      last_name: participantData.lastName,
      email: participantData.email,
      category: participantData.category.toUpperCase(),
    };

    const response = await fetch(`${API_BASE_URL}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    if (!response.ok) {
      throw new Error('Failed to create participant');
    }
    const data = await response.json();
    return transformParticipantResponse(data);
  },

  updateParticipant: async (id: number, participantData: Partial<Omit<Participant, 'id'>>): Promise<ParticipantWithMemberships> => {
    // Convert camelCase to snake_case for API
    const apiData: any = {
      id: id, // Include ID in request body in case backend expects it
    };
    if (participantData.firstName !== undefined) apiData.first_name = participantData.firstName;
    if (participantData.lastName !== undefined) apiData.last_name = participantData.lastName;
    if (participantData.email !== undefined) apiData.email = participantData.email;
    if (participantData.category !== undefined) apiData.category = participantData.category.toUpperCase();

    const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update participant error:', errorText);
      throw new Error(`Failed to update participant with id ${id}`);
    }
    
    const data = await response.json();
    return transformParticipantResponse(data);
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