// Tournament types
export interface Tournament {
  id: number;
  name: string;
  sportType: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  rules?: string;
}

// Team types
export interface Team {
  id: number;
  name: string;
  category?: 'amateur' | 'professional' | 'youth';
  memberCount?: number;
}

// Participant types
export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  category: 'amateur' | 'professional' | 'youth';
}

// Venue types
export interface Venue {
  id: number;
  name: string;
  address: string;
  capacity: number;
}

// Match types
export interface Match {
  id: number;
  tournamentId: number;
  homeTeam: Team;
  awayTeam: Team;
  venue: Venue;
  scheduledAt: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  homeScore?: number;
  awayScore?: number;
}

// Registration types
export interface Registration {
  teamId: number;
  team: Team;
  tournamentId: number;
  status: 'registered' | 'invited' | 'declined';
}

// Notification types
export interface Notification {
  id: number;
  recipientType: 'team' | 'participant' | 'tournament';
  recipientId: number;
  type: 'schedule' | 'result' | 'reminder' | 'announcement';
  message: string;
  tournamentId?: number;
  matchId?: number;
  createdAt: string;
  read: boolean;
}

// Auth & User types
export type UserRole = 'ADMIN' | 'PARTICIPANT';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
} 