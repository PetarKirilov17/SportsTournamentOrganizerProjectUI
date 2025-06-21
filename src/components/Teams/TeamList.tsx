import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Team, TeamService } from '../../services/TeamService';
import { TeamForm } from './TeamForm';

export function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Teams</h3>
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
          <div key={team.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{team.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(team)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}