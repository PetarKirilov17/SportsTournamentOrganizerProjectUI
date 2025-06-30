import API_BASE_URL from './api';
import { Team } from './TeamService';

export interface Registration {
  team_id: number;
  team: Team;
  tournament_id: number;
  status: 'invited' | 'registered' | 'declined' | 'cancelled';
}

export type RegistrationStatus = 'invited' | 'registered' | 'declined' | 'cancelled';

export const RegistrationService = {
  getRegistrations: async (tournamentId: number): Promise<Registration[]> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations`);
    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }
    return response.json();
  },

  registerTeam: async (tournamentId: number, teamId: number, status: RegistrationStatus): Promise<Registration> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ team_id: teamId, status }),
    });
    if (!response.ok) {
      throw new Error('Failed to register team');
    }
    return response.json();
  },

  updateRegistration: async (tournamentId: number, teamId: number, status: RegistrationStatus): Promise<Registration> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations/${teamId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update registration');
    }
    return response.json();
  },

  deleteRegistration: async (tournamentId: number, teamId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/registrations/${teamId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete registration');
    }
  },
}; 