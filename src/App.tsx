import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TournamentList } from './components/Tournaments/TournamentList';
import { TournamentDetailPage } from './components/Tournaments/TournamentDetailPage/TournamentDetailPage';
import { TeamList } from './components/Teams/TeamList';
import { ParticipantList } from './components/Participants/ParticipantList';
import { VenueList } from './components/Venues/VenueList';
import { SimpleList } from './components/Common/SimpleList';
import {
  mockMatches,
  mockRegistrations,
  mockNotifications
} from './data/mockData';
import { Calendar, UserCheck, Bell } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [viewingTournamentId, setViewingTournamentId] = useState<number | null>(null);

  const handleTournamentClick = (id: number) => {
    setViewingTournamentId(id);
    setActiveSection('tournaments'); // Ensure the section is correct
  };

  const handleBackToList = () => {
    setViewingTournamentId(null);
  };

  const getSectionTitle = () => {
    if (activeSection === 'tournaments' && viewingTournamentId) {
      return 'Tournament Details';
    }
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
    if (activeSection === 'tournaments' && viewingTournamentId) {
      return (
        <TournamentDetailPage
          tournamentId={viewingTournamentId}
          onBack={handleBackToList}
        />
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'tournaments':
        return (
          <TournamentList onTournamentClick={handleTournamentClick} />
        );
      
      case 'teams':
        return <TeamList />;
      
      case 'participants':
        return <ParticipantList />;
      
      case 'venues':
        return <VenueList />;
      
      case 'matches':
        return (
          <SimpleList
            title="Scheduled Matches"
            items={mockMatches.map(match => ({
              id: match.id,
              title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
              subtitle: `${new Date(match.scheduledAt).toLocaleDateString()} • ${match.venue.name}`,
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
              id: reg.teamId,
              title: reg.team.name,
              subtitle: `Tournament ID: ${reg.tournamentId}`,
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
              subtitle: `${notif.type} • ${new Date(notif.createdAt).toLocaleDateString()}`,
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