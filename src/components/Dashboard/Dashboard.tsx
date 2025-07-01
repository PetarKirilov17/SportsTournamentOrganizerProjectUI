import React from 'react';
import { Trophy, Users, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { mockTournaments, mockTeams, mockMatches, mockVenues } from '../../data/mockData';

const stats = [
  {
    label: 'Active Tournaments',
    value: mockTournaments.filter(t => t.status !== 'completed').length,
    icon: Trophy,
    color: 'bg-blue-500',
    change: '+2 this month'
  },
  {
    label: 'Registered Teams',
    value: mockTeams.length,
    icon: Users,
    color: 'bg-green-500',
    change: '+5 this week'
  },
  {
    label: 'Scheduled Matches', 
    value: mockMatches.filter(m => m.status === 'scheduled').length,
    icon: Calendar,
    color: 'bg-orange-500',
    change: '12 upcoming'
  },
  {
    label: 'Available Venues',
    value: mockVenues.length,
    icon: MapPin,
    color: 'bg-purple-500',
    change: 'All operational'
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tournaments</h3>
          <div className="space-y-3">
            {mockTournaments.slice(0, 3).map((tournament) => (
              <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{tournament.name}</p>
                  <p className="text-sm text-gray-500">{tournament.sportType} • {tournament.location}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tournament.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                  tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {tournament.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Matches</h3>
          <div className="space-y-3">
            {mockMatches.filter(m => m.status === 'scheduled').slice(0, 3).map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.scheduledAt).toLocaleDateString()} • {match.venue.name}
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}