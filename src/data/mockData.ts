import { Tournament, Team, Participant, Venue, Match, Registration, Notification } from '../types';

export const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: "Spring Championship 2024",
    sportType: "Football",
    startDate: "2024-03-15",
    endDate: "2024-04-20",
    location: "Central Sports Complex",
    status: "upcoming",
    rules: "Standard FIFA rules apply"
  },
  {
    id: 2,
    name: "Summer Basketball League",
    sportType: "Basketball",
    startDate: "2024-06-01",
    endDate: "2024-08-15",
    location: "Metro Arena",
    status: "upcoming"
  },
  {
    id: 3,
    name: "Winter Hockey Cup",
    sportType: "Hockey",
    startDate: "2024-01-10",
    endDate: "2024-02-28",
    location: "Ice Palace",
    status: "completed"
  }
];

export const mockTeams: Team[] = [
  { id: 1, name: "Thunder Bolts", category: "professional", memberCount: 11 },
  { id: 2, name: "Lightning Strikers", category: "professional", memberCount: 11 },
  { id: 3, name: "Fire Dragons", category: "amateur", memberCount: 9 },
  { id: 4, name: "Ice Wolves", category: "youth", memberCount: 8 },
  { id: 5, name: "Storm Eagles", category: "professional", memberCount: 10 }
];

export const mockParticipants: Participant[] = [
  { id: 1, firstName: "John", lastName: "Smith", email: "john.smith@email.com", category: "professional" },
  { id: 2, firstName: "Sarah", lastName: "Johnson", email: "sarah.j@email.com", category: "professional" },
  { id: 3, firstName: "Mike", lastName: "Brown", email: "mike.brown@email.com", category: "amateur" },
  { id: 4, firstName: "Emma", lastName: "Davis", email: "emma.davis@email.com", category: "youth" },
  { id: 5, firstName: "Alex", lastName: "Wilson", email: "alex.wilson@email.com", category: "professional" }
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
    tournamentId: 1,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    venue: mockVenues[0],
    scheduledAt: "2024-03-20T15:00:00Z",
    status: "scheduled"
  },
  {
    id: 2,
    tournamentId: 1,
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[4],
    venue: mockVenues[0],
    scheduledAt: "2024-03-22T18:00:00Z",
    status: "scheduled"
  },
  {
    id: 3,
    tournamentId: 3,
    homeTeam: mockTeams[3],
    awayTeam: mockTeams[1],
    venue: mockVenues[2],
    scheduledAt: "2024-02-15T20:00:00Z",
    status: "completed",
    homeScore: 2,
    awayScore: 1
  }
];

export const mockRegistrations: Registration[] = [
  { teamId: 1, team: mockTeams[0], tournamentId: 1, status: "registered" },
  { teamId: 2, team: mockTeams[1], tournamentId: 1, status: "registered" },
  { teamId: 3, team: mockTeams[2], tournamentId: 1, status: "invited" },
  { teamId: 5, team: mockTeams[4], tournamentId: 1, status: "registered" }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    recipientType: "team",
    recipientId: 1,
    type: "schedule",
    message: "Your match against Lightning Strikers has been scheduled for March 20th at 3:00 PM",
    tournamentId: 1,
    matchId: 1,
    createdAt: "2024-03-01T10:00:00Z",
    read: false
  },
  {
    id: 2,
    recipientType: "team",
    recipientId: 2,
    type: "result",
    message: "Match result has been recorded: Ice Wolves 2 - 1 Lightning Strikers",
    tournamentId: 3,
    matchId: 3,
    createdAt: "2024-02-15T22:30:00Z",
    read: true
  }
];