import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { TeamService } from '../../services/TeamService';
import { Team } from '../../types';
import { TeamMemberList } from './TeamMemberList';
import { AddParticipantModal } from './AddParticipantModal';
import { TeamForm } from './TeamForm';

interface TeamDetailsProps {
  teamId: number;
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
  onTeamDeleted: () => void;
}

export function TeamDetails({
  teamId,
  isOpen,
  onClose,
  onTeamUpdated,
  onTeamDeleted,
}: TeamDetailsProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [teamNameEdit, setTeamNameEdit] = useState('');

  useEffect(() => {
    if (isOpen && teamId && teamId > 0) {
      console.log('TeamDetails: Opening team details for teamId:', teamId);
      fetchTeam();
    } else if (isOpen && (!teamId || teamId <= 0)) {
      console.error('TeamDetails: Invalid teamId provided:', teamId);
      setError('Invalid team ID provided');
    }
  }, [isOpen, teamId]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      console.log('TeamDetails: Fetching team with ID:', teamId);
      const data = await TeamService.getTeamById(teamId);
      console.log('TeamDetails: Team loaded:', data);
      console.log('TeamDetails: Team ID from loaded data:', data?.id);
      setTeam(data);
      setCurrentTeamId(teamId);
      setError(null);
      setMemberCount(data?.members?.length || 0);
    } catch (err) {
      console.error('TeamDetails: Failed to fetch team:', err);
      setError('Failed to fetch team details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (teamData: Partial<Omit<Team, 'id'>>) => {
    if (!team || !team.id) {
      console.error('TeamDetails: Cannot edit team - team not loaded or missing ID:', team);
      setError('Team not loaded properly. Please try again.');
      return;
    }

    try {
      await TeamService.updateTeam(team.id, teamData);
      await fetchTeam();
      setShowEditForm(false);
      onTeamUpdated();
    } catch (err) {
      setError('Failed to update team');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!team || !team.id) {
      console.error('TeamDetails: Cannot delete team - team not loaded or missing ID:', team);
      setError('Team not loaded properly. Please try again.');
      return;
    }

    // Check if team has members
    if (memberCount > 0) {
      const confirmMessage = `This team has ${memberCount} member(s). You must remove all members before deleting the team. Would you like to view the team members?`;
      if (confirm(confirmMessage)) {
        // Scroll to team members section or focus on it
        const membersSection = document.querySelector('[data-team-members]');
        if (membersSection) {
          membersSection.scrollIntoView({ behavior: 'smooth' });
        }
        setError('Please remove all team members before deleting the team.');
        return;
      }
      return;
    }

    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      await TeamService.deleteTeam(team.id);
      onTeamDeleted();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team';
      console.error('TeamDetails: Delete team error:', err);
      
      // Check if the error is about team members
      if (errorMessage.toLowerCase().includes('member') || errorMessage.toLowerCase().includes('participant')) {
        setError('Cannot delete team: Please remove all team members first before deleting the team.');
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleMemberRemoved = () => {
    // Refresh member count or team data if needed
    fetchTeam();
    setMemberCount(prev => Math.max(0, prev - 1));
  };

  const handleParticipantAdded = () => {
    // Refresh member count or team data if needed
    console.log('TeamDetails: Participant added, refreshing team data');
    fetchTeam();
    setMemberCount(prev => prev + 1);
    // Force a re-render of the TeamMemberList by triggering a state change
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTeamNameEdit = () => {
    if (!team) return;
    setTeamNameEdit(team.name || '');
    setEditingTeamName(true);
  };

  const handleTeamNameSave = async () => {
    if (!team || !teamNameEdit.trim()) return;
    
    try {
      await TeamService.updateTeam(team.id, { name: teamNameEdit.trim() });
      await fetchTeam();
      setEditingTeamName(false);
      setTeamNameEdit('');
      onTeamUpdated();
    } catch (err) {
      setError('Failed to update team name');
      console.error(err);
    }
  };

  const handleTeamNameCancel = () => {
    setEditingTeamName(false);
    setTeamNameEdit('');
  };

  const handleClose = () => {
    setTeam(null);
    setError(null);
    setShowEditForm(false);
    setShowAddParticipantModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Loading...' : team?.name || 'Team Details'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {error && (
              <div className="text-red-500 bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : team ? (
              <>
                {(() => {
                  console.log('TeamDetails: Rendering team information:', team);
                  return null;
                })()}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Team not found</p>
              </div>
            )}

            {/* Team Members Section - Always render if we have a teamId */}
            {teamId && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Team Members
                    </h3>
                  </div>
                  {team && currentTeamId && (
                    <button
                      onClick={() => {
                        console.log('TeamDetails: Button clicked - team state:', {
                          team,
                          currentTeamId,
                          teamId: team?.id,
                          teamName: team?.name,
                          showAddParticipantModal
                        });
                        setShowAddParticipantModal(true);
                        console.log('TeamDetails: Set showAddParticipantModal to true');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Participant</span>
                    </button>
                  )}
                </div>

                <TeamMemberList
                  key={`team-${teamId}-members-${refreshTrigger}`}
                  teamId={teamId}
                  teamName={team?.name || ''}
                  onMemberRemoved={handleMemberRemoved}
                />
              </div>
            )}
          </div>

          {/* Edit Team Form Modal */}
          {showEditForm && team && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Team</h3>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <TeamForm
                    team={team}
                    onSubmit={handleEdit}
                    onCancel={() => setShowEditForm(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Participant Modal - Outside the main modal */}
      {showAddParticipantModal && currentTeamId && team && (() => {
        console.log('TeamDetails: Modal rendering check:', {
          showAddParticipantModal,
          currentTeamId,
          teamExists: !!team,
          teamId: team?.id,
          teamName: team?.name
        });
        return (
          <AddParticipantModal
            teamId={currentTeamId}
            teamName={team.name}
            isOpen={showAddParticipantModal}
            onClose={() => setShowAddParticipantModal(false)}
            onParticipantAdded={handleParticipantAdded}
          />
        );
      })()}
    </>
  );
} 