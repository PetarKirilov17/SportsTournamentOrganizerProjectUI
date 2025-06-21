import { Tournament, Team, Participant, Venue, Match, Registration, Notification } from '../types';

export const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: "Spring Championship 2024",
    sport_type: "Football",
    start_date: "2024-03-15",
    end_date: "2024-04-20",
    location: "Central Sports Complex",
    status: "upcoming",
    rules: "Standard FIFA rules apply"
  },
  {
    id: 2,
    name: "Summer Basketball League",
    sport_type: "Basketball",
    start_date: "2024-06-01",
    end_date: "2024-08-15",
    location: "Metro Arena",
    status: "upcoming"
  },
  {
    id: 3,
    name: "Winter Hockey Cup",
    sport_type: "Hockey",
    start_date: "2024-01-10",
    end_date: "2024-02-28",
    location: "Ice Palace",
    status: "completed"
  }
];

export const mockTeams: Team[] = [
  { id: 1, name: "Thunder Bolts", category: "professional", member_count: 11 },
  { id: 2, name: "Lightning Strikers", category: "professional", member_count: 11 },
  { id: 3, name: "Fire Dragons", category: "amateur", member_count: 9 },
  { id: 4, name: "Ice Wolves", category: "youth", member_count: 8 },
  { id: 5, name: "Storm Eagles", category: "professional", member_count: 10 }
];

export const mockParticipants: Participant[] = [
  { id: 1, first_name: "John", last_name: "Smith", email: "john.smith@email.com", category: "professional" },
  { id: 2, first_name: "Sarah", last_name: "Johnson", email: "sarah.j@email.com", category: "professional" },
  { id: 3, first_name: "Mike", last_name: "Brown", email: "mike.brown@email.com", category: "amateur" },
  { id: 4, first_name: "Emma", last_name: "Davis", email: "emma.davis@email.com", category: "youth" },
  { id: 5, first_name: "Alex", last_name: "Wilson", email: "alex.wilson@email.com", category: "professional" }
];

export const mockVenues: Venue[] = [
  { id: 1, name: "Central Sports Complex", address: "123 Main St, City Center", capacity: 50000 },
  { id: 2, name: "Metro Arena", address: "456 Sports Ave, Downtown", capacity: 15000 },
  { id: 3, name: "Ice Palace", address: "789 Ice Blvd, North Side", capacity: 8000 },
  { id: 4, name: "Community Field", address: "321 Park Rd, Suburbs", capacity: 2000 }
];

export const mockMatches: Match[] = [
  {
    id: 1,
    tournament_id: 1,
    home_team: mockTeams[0],
    away_team: mockTeams[1],
    venue: mockVenues[0],
    scheduled_at: "2024-03-20T15:00:00Z",
    status: "scheduled"
  },
  {
    id: 2,
    tournament_id: 1,
    home_team: mockTeams[2],
    away_team: mockTeams[4],
    venue: mockVenues[0],
    scheduled_at: "2024-03-22T18:00:00Z",
    status: "scheduled"
  },
  {
    id: 3,
    tournament_id: 3,
    home_team: mockTeams[3],
    away_team: mockTeams[1],
    venue: mockVenues[2],
    scheduled_at: "2024-02-15T20:00:00Z",
    status: "completed",
    home_score: 2,
    away_score: 1
  }
];

export const mockRegistrations: Registration[] = [
  { team_id: 1, team: mockTeams[0], tournament_id: 1, status: "registered" },
  { team_id: 2, team: mockTeams[1], tournament_id: 1, status: "registered" },
  { team_id: 3, team: mockTeams[2], tournament_id: 1, status: "invited" },
  { team_id: 5, team: mockTeams[4], tournament_id: 1, status: "registered" }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    recipient_type: "team",
    recipient_id: 1,
    type: "schedule",
    message: "Your match against Lightning Strikers has been scheduled for March 20th at 3:00 PM",
    tournament_id: 1,
    match_id: 1,
    created_at: "2024-03-01T10:00:00Z",
    read: false
  },
  {
    id: 2,
    recipient_type: "team",
    recipient_id: 2,
    type: "result",
    message: "Match result has been recorded: Ice Wolves 2 - 1 Lightning Strikers",
    tournament_id: 3,
    match_id: 3,
    created_at: "2024-02-15T22:30:00Z",
    read: true
  }
];