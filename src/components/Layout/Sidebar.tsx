import React from 'react';
import { 
  Trophy, 
  Users, 
  User, 
  MapPin, 
  Calendar, 
  Bell, 
  Home,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'participants', label: 'Participants', icon: User },
  { id: 'venues', label: 'Venues', icon: MapPin },
  { id: 'matches', label: 'Matches', icon: Calendar },
  { id: 'registrations', label: 'Registrations', icon: UserCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Trophy className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">TournamentPro</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}