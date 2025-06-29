import React, { useState, useEffect } from 'react';
import { Trash2, Edit, User, Mail, Calendar, Hash, Users } from 'lucide-react';
import { TeamMember, TeamMemberService, UpdateTeamMemberDTO } from '../../services/TeamMemberService';

interface TeamMemberListProps {
  teamId: number;
  teamName: string;
  onMemberRemoved: () => void;
}

export function TeamMemberList({ teamId, teamName, onMemberRemoved }: TeamMemberListProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editForm, setEditForm] = useState({
    role: '',
    jerseyNumber: '',
  });

  useEffect(() => {
    // Only fetch if teamId is valid
    if (teamId && teamId !== undefined && teamId !== null) {
      fetchTeamMembers();
    }
  }, [teamId]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      
      // Validate teamId before making the API call
      if (!teamId || teamId === undefined || teamId === null) {
        console.error('TeamMemberList: Invalid teamId:', teamId);
        setError('Invalid team ID');
        setMembers([]);
        return;
      }
      
      console.log('TeamMemberList: Fetching members for teamId:', teamId);
      const data = await TeamMemberService.getTeamMembers(teamId);
      setMembers(data || []); // Ensure we always have an array
      setError(null);
    } catch (err) {
      console.error('Error fetching team members:', err);
      // Don't show error if it's just an empty response
      if (err instanceof Error && err.message.includes('404')) {
        setMembers([]);
        setError(null);
      } else {
        setError('Failed to fetch team members');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }

    try {
      await TeamMemberService.removeParticipantFromTeam(teamId, memberId);
      await fetchTeamMembers();
      onMemberRemoved();
    } catch (err) {
      setError('Failed to remove team member');
      console.error(err);
    }
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setEditForm({
      role: member.role || '',
      jerseyNumber: member.jerseyNumber?.toString() || '',
    });
  };

  const handleEditSubmit = async () => {
    if (!editingMember) return;

    try {
      const updateDTO: UpdateTeamMemberDTO = {
        role: editForm.role || undefined,
        jersey_number: editForm.jerseyNumber ? parseInt(editForm.jerseyNumber) : undefined,
      };

      console.log('TeamMemberList: Updating team member with:', {
        teamId,
        memberId: editingMember.id,
        updateDTO
      });

      await TeamMemberService.updateTeamMember(teamId, editingMember.id, updateDTO);
      await fetchTeamMembers();
      setEditingMember(null);
      setEditForm({ role: '', jerseyNumber: '' });
    } catch (err) {
      setError('Failed to update team member');
      console.error(err);
    }
  };

  const handleEditCancel = () => {
    setEditingMember(null);
    setEditForm({ role: '', jerseyNumber: '' });
  };

  if (!teamId || teamId === undefined || teamId === null) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Loading team information...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No team members yet</p>
        <p className="text-xs text-gray-400 mt-1">Add participants to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">
          Team Members ({members.length})
        </h4>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No members in this team yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingMember?.id === member.id ? (
                // Edit form
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {member.participantName}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Player, Coach, Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jersey Number
                      </label>
                      <input
                        type="number"
                        value={editForm.jerseyNumber}
                        onChange={(e) => setEditForm({ ...editForm, jerseyNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 10"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditSubmit}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display member info
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {member.participantName}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{member.participantEmail}</span>
                      </div>
                      
                      {member.role && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Role:</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {member.role}
                          </span>
                        </div>
                      )}
                      
                      {member.jerseyNumber && (
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4" />
                          <span>#{member.jerseyNumber}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {new Date(member.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditClick(member)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit member"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 