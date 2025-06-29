import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import { TeamService } from '../../services/TeamService';
import { Team } from '../../types';
import { TeamForm } from './TeamForm';
import { TeamDetails } from './TeamDetails';

export function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    fetchTeams();
    // Test backend connection
    testBackendConnection();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await TeamService.getTeams();
      setTeams(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teams');
      console.error(err);
    }
  };

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost:8080/teams');
      console.log('Backend test response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Backend test response data:', data);
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.error('Backend connection test failed:', error);
      setBackendStatus('error');
    }
  };

  const handleAdd = async (teamData: Omit<Team, 'id'>) => {
    try {
      await TeamService.createTeam(teamData);
      fetchTeams();
      setShowForm(false);
    } catch (err) {
      setError('Failed to add team');
      console.error(err);
    }
  };

  const handleEdit = async (id: number, teamData: Partial<Omit<Team, 'id'>>) => {
    try {
      await TeamService.updateTeam(id, teamData);
      fetchTeams();
      setEditingTeam(null);
      setShowForm(false);
    } catch (err) {
      setError(`Failed to update team with id ${id}`);
      console.error(err);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await TeamService.deleteTeam(id);
      fetchTeams();
    } catch (err) {
      setError(`Failed to delete team with id ${id}`);
      console.error(err);
    }
  };

  const handleSubmit = (teamData: Omit<Team, 'id'>) => {
    if (editingTeam) {
      handleEdit(editingTeam.id, teamData);
    } else {
      handleAdd(teamData);
    }
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeamId(team.id);
    setShowTeamDetails(true);
  };

  const handleTeamDetailsClose = () => {
    setSelectedTeamId(null);
    setShowTeamDetails(false);
  };

  const handleTeamUpdated = () => {
    fetchTeams();
  };

  const handleTeamDeleted = () => {
    fetchTeams();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Teams</h3>
        <div className="flex items-center space-x-4">
          {/* Backend Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              backendStatus === 'checking' ? 'bg-yellow-500' :
              backendStatus === 'connected' ? 'bg-green-500' :
              'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {backendStatus === 'checking' ? 'Checking backend...' :
               backendStatus === 'connected' ? 'Backend connected' :
               'Backend error'}
            </span>
          </div>
          
          <button
            onClick={() => {
              setEditingTeam(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team</span>
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {showForm && (
        <TeamForm
          team={editingTeam}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTeam(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div 
            key={team.id} 
            className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTeamClick(team)}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{team.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTeamClick(team);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(team);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit team"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(team.id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {team.category && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  team.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                  team.category === 'amateur' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {team.category}
                </span>
              )}
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Users className="w-4 h-4" />
                <span>Click to view members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Details Modal */}
      {showTeamDetails && selectedTeamId && (
        <TeamDetails
          teamId={selectedTeamId}
          isOpen={showTeamDetails}
          onClose={handleTeamDetailsClose}
          onTeamUpdated={handleTeamUpdated}
          onTeamDeleted={handleTeamDeleted}
        />
      )}
    </div>
  );
}