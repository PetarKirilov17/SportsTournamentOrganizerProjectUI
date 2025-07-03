import { API_BASE_URL } from './api';
import { Team } from '../types';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const TeamService = {
  getTeams: async (): Promise<Team[]> => {
    const response = await fetch(`${API_BASE_URL}/teams`, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }
    return response.json();
  },

  getTeamById: async (id: number): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error(`Failed to fetch team with id ${id}`);
    }
    return response.json();
  },

  createTeam: async (teamData: Omit<Team, 'id'>): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit,
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      throw new Error('Failed to create team');
    }
    return response.json();
  },

  updateTeam: async (id: number, teamData: Partial<Omit<Team, 'id'>>): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit,
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update team with id ${id}`);
    }
    return response.json();
  },

  deleteTeam: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Failed to delete team with id ${id}`;
      throw new Error(errorMessage);
    }
  },
}; 