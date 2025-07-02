import { Tournament } from '../types';
import API_BASE_URL from "./api.ts";

export interface LeaderboardEntry {
  team_id: number;
  team_name: string;
  wins: number;
}

export const TournamentService = {
  getTournaments: async (): Promise<Tournament[]> => {
    const response = await fetch(`${API_BASE_URL}/tournaments`);
    if (!response.ok) {
      throw new Error('Failed to fetch tournaments');
    }
    return response.json();
  },

  getTournamentById: async (id: number): Promise<Tournament> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tournament with id ${id}`);
    }
    return response.json();
  },

  createTournament: async (tournamentData: Omit<Tournament, 'id'>): Promise<Tournament> => {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create tournament');
    }
    return response.json();
  },

  updateTournament: async (id: number, tournamentData: Partial<Omit<Tournament, 'id'>>): Promise<Tournament> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update tournament with id ${id}`);
    }
    return response.json();
  },

  deleteTournament: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete tournament with id ${id}`);
    }
  },

  getLeaderboard: async (tournamentId: number): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
}; 