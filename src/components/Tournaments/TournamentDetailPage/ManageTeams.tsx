import React, { useState, useEffect } from 'react';
import { Mail, UserPlus, Edit } from 'lucide-react';
import { Registration, RegistrationService, RegistrationStatus } from '../../../services/RegistrationService';
import { Team, TeamService } from '../../../services/TeamService';

interface ManageTeamsProps {
  tournamentId: number;
}

export function ManageTeams({ tournamentId }: ManageTeamsProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [regs, teams] = await Promise.all([
          RegistrationService.getRegistrations(tournamentId),
          TeamService.getTeams()
        ]);
        setRegistrations(regs);
        setAllTeams(teams);
        setError(null);
      } catch (err) {
        setError('Failed to fetch team data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tournamentId]);

  const invitedTeams = registrations.filter(r => r.status === 'invited');
  // Add logic for inviting new teams and changing status later

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Teams</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-500" />
              Invited Teams
            </h4>
            {invitedTeams.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {invitedTeams.map(reg => (
                  <li key={reg.team_id} className="py-2 flex justify-between items-center">
                    <span>{reg.team.name}</span>
                    <span className="text-sm text-gray-500 capitalize">{reg.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No teams have been invited yet.</p>
            )}
          </div>
          <div className="pt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4" />
              <span>Invite New Team</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 