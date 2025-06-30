import React, { useState, useEffect } from 'react';
import { Mail, UserPlus, X } from 'lucide-react';
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  const handleInvite = async () => {
    if (!selectedTeam) {
      setError('Please select a team to invite.');
      return;
    }
    try {
      await RegistrationService.registerTeam(tournamentId, selectedTeam, RegistrationStatus.INVITED);
      setShowInviteModal(false);
      setSelectedTeam(null);
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to invite team');
      console.error(err);
    }
  };

  const invitedTeams = registrations.filter(r => r.status === RegistrationStatus.INVITED);
  const registeredTeamIds = registrations.map(r => r.team_id);
  const availableTeams = allTeams.filter(t => !registeredTeamIds.includes(t.id));

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
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite New Team</span>
            </button>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Invite a Team</h4>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <select
                onChange={(e) => setSelectedTeam(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option>Select a team</option>
                {availableTeams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 