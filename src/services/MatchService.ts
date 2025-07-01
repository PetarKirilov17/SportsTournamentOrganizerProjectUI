import API_BASE_URL from './api';
import { Team } from './TeamService';
import { Venue } from './VenueService';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED',
}

export interface Match {
  id: number;
  tournament_id: number;
  home_team: Team;
  away_team: Team;
  venue: Venue;
  scheduled_at: string;
  status: MatchStatus;
  home_score?: number;
  away_score?: number;
}

export const MatchService = {
  getMatches: async (tournamentId: number): Promise<Match[]> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/matches`);
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    return response.json();
  },

  createMatch: async (tournamentId: number, matchData: Omit<Match, 'id' | 'home_team' | 'away_team' | 'venue' | 'tournament_id'> & { home_team_id: number, away_team_id: number, venue_id: number }): Promise<Match> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });
    if (!response.ok) {
      throw new Error('Failed to create match');
    }
    return response.json();
  },

  updateMatch: async (tournamentId: number, matchId: number, matchData: unknown): Promise<Match> => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/matches/${matchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });
    if (!response.ok) {
      throw new Error('Failed to update match');
    }
    return response.json();
  },

  deleteMatch: async (matchId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete match');
    }
  },
}; 