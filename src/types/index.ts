export interface Tournament {
  id: number;
  name: string;
  sport_type: string;
  start_date: string;
  end_date: string;
  location?: string;
  rules?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Team {
  id: number;
  name: string;
  category: 'amateur' | 'professional' | 'youth';
  member_count?: number;
}

export interface Participant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  category: 'amateur' | 'professional' | 'youth';
}

export interface TeamMember {
  participant_id: number;
  participant: Participant;
  role?: string;
  jersey_number?: number;
}

export interface Venue {
  id: number;
  name: string;
  address?: string;
  capacity?: number;
}

export interface Match {
  id: number;
  tournament_id: number;
  home_team: Team;
  away_team: Team;
  venue: Venue;
  scheduled_at: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  home_score?: number;
  away_score?: number;
}

export interface Registration {
  team_id: number;
  team: Team;
  tournament_id: number;
  status: 'invited' | 'registered' | 'declined' | 'cancelled';
}

export interface Notification {
  id: number;
  recipient_type: 'team' | 'participant';
  recipient_id: number;
  type: 'schedule' | 'result' | 'update';
  message: string;
  tournament_id?: number;
  match_id?: number;
  created_at: string;
  read: boolean;
}