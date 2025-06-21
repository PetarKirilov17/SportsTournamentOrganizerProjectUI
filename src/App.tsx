import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TournamentList } from './components/Tournaments/TournamentList';
import { TeamList } from './components/Teams/TeamList';
import { ParticipantList } from './components/Participants/ParticipantList';
import { VenueList } from './components/Venues/VenueList';
import { SimpleList } from './components/Common/SimpleList';
import { 
  mockTournaments, 
  mockTeams, 
  mockParticipants, 
  mockVenues,
  mockMatches,
  mockRegistrations,
  mockNotifications
} from './data/mockData';
import { Tournament, Team, Participant, Venue } from './types';
import { Calendar, UserCheck, Bell } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tournaments, setTournaments] = useState(mockTournaments);
  const [teams, setTeams] = useState(mockTeams);
  const [participants, setParticipants] = useState(mockParticipants);
  const [venues, setVenues] = useState(mockVenues);

  // Tournament operations
  const handleAddTournament = (tournamentData: Omit<Tournament, 'id'>) => {
    const newTournament = {
      ...tournamentData,
      id: Math.max(...tournaments.map(t => t.id)) + 1
    };
    setTournaments([...tournaments, newTournament]);
  };

  const handleEditTournament = (id: number, tournamentData: Partial<Tournament>) => {
    setTournaments(tournaments.map(t => 
      t.id === id ? { ...t, ...tournamentData } : t
    ));
  };

  const handleDeleteTournament = (id: number) => {
    setTournaments(tournaments.filter(t => t.id !== id));
  };

  // Team operations
  const handleAddTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam = {
      ...teamData,
      id: Math.max(...teams.map(t => t.id)) + 1
    };
    setTeams([...teams, newTeam]);
  };

  const handleEditTeam = (id: number, teamData: Partial<Team>) => {
    setTeams(teams.map(t => 
      t.id === id ? { ...t, ...teamData } : t
    ));
  };

  const handleDeleteTeam = (id: number) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  // Participant operations
  const handleAddParticipant = (participantData: Omit<Participant, 'id'>) => {
    const newParticipant = {
      ...participantData,
      id: Math.max(...participants.map(p => p.id)) + 1
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleEditParticipant = (id: number, participantData: Partial<Participant>) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, ...participantData } : p
    ));
  };

  const handleDeleteParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  // Venue operations
  const handleAddVenue = (venueData: Omit<Venue, 'id'>) => {
    const newVenue = {
      ...venueData,
      id: Math.max(...venues.map(v => v.id)) + 1
    };
    setVenues([...venues, newVenue]);
  };

  const handleEditVenue = (id: number, venueData: Partial<Venue>) => {
    setVenues(venues.map(v => 
      v.id === id ? { ...v, ...venueData } : v
    ));
  };

  const handleDeleteVenue = (id: number) => {
    setVenues(venues.filter(v => v.id !== id));
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard';
      case 'tournaments': return 'Tournament Management';
      case 'teams': return 'Team Management';
      case 'participants': return 'Participant Management';
      case 'venues': return 'Venue Management';
      case 'matches': return 'Match Management';
      case 'registrations': return 'Tournament Registrations';
      case 'notifications': return 'Notifications';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'tournaments':
        return (
          <TournamentList
            tournaments={tournaments}
            onAdd={handleAddTournament}
            onEdit={handleEditTournament}
            onDelete={handleDeleteTournament}
          />
        );
      
      case 'teams':
        return (
          <TeamList
            teams={teams}
            onAdd={handleAddTeam}
            onEdit={handleEditTeam}
            onDelete={handleDeleteTeam}
          />
        );
      
      case 'participants':
        return (
          <ParticipantList
            participants={participants}
            onAdd={handleAddParticipant}
            onEdit={handleEditParticipant}
            onDelete={handleDeleteParticipant}
          />
        );
      
      case 'venues':
        return (
          <VenueList
            venues={venues}
            onAdd={handleAddVenue}
            onEdit={handleEditVenue}
            onDelete={handleDeleteVenue}
          />
        );
      
      case 'matches':
        return (
          <SimpleList
            title="Scheduled Matches"
            items={mockMatches.map(match => ({
              id: match.id,
              title: `${match.home_team.name} vs ${match.away_team.name}`,
              subtitle: `${new Date(match.scheduled_at).toLocaleDateString()} • ${match.venue.name}`,
              status: match.status,
              icon: Calendar
            }))}
            emptyMessage="No matches scheduled yet."
          />
        );
      
      case 'registrations':
        return (
          <SimpleList
            title="Tournament Registrations"
            items={mockRegistrations.map(reg => ({
              id: reg.team_id,
              title: reg.team.name,
              subtitle: `Tournament ID: ${reg.tournament_id}`,
              status: reg.status,
              icon: UserCheck
            }))}
            emptyMessage="No registrations found."
          />
        );
      
      case 'notifications':
        return (
          <SimpleList
            title="Recent Notifications"
            items={mockNotifications.map(notif => ({
              id: notif.id,
              title: notif.message,
              subtitle: `${notif.type} • ${new Date(notif.created_at).toLocaleDateString()}`,
              status: notif.read ? 'read' : 'unread',
              icon: Bell
            }))}
            emptyMessage="No notifications found."
          />
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getSectionTitle()} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;