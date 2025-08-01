import { API_BASE_URL } from './api';
import { Team } from  '../types';

export enum RegistrationStatus {
  INVITED = 'INVITED',
  REGISTERED = 'REGISTERED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export interface Registration {
  id: number;
  team_id: number;
  team: Team;
  tournament_id: number;
  status: RegistrationStatus;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const RegistrationService = {
  getRegistrations: async (tournamentId: number): Promise<Registration[]> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations`, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }
    return response.json();
  },

  registerTeam: async (tournamentId: number, teamId: number, status: RegistrationStatus): Promise<Registration> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit,
      body: JSON.stringify({ team_id: teamId, status }),
    });
    if (!response.ok) {
      throw new Error('Failed to register team');
    }
    return response.json();
  },

  updateRegistration: async (registrationId: number, tournamentId: number, teamId: number, status: RegistrationStatus): Promise<Registration> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations/${registrationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit,
      body: JSON.stringify({ team_id: teamId, status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update registration');
    }
    return response.json();
  },

  deleteRegistration: async (tournamentId: number, teamId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations/${teamId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete registration');
    }
  },
}; 