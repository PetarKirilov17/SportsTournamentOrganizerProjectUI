import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Team } from '../../types';
import { TeamForm } from './TeamForm';

interface TeamListProps {
  teams: Team[];
  onAdd: (team: Omit<Team, 'id'>) => void;
  onEdit: (id: number, team: Partial<Team>) => void;
  onDelete: (id: number) => void;
}

export function TeamList({ teams, onAdd, onEdit, onDelete }: TeamListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleSubmit = (teamData: Omit<Team, 'id'>) => {
    if (editingTeam) {
      onEdit(editingTeam.id, teamData);
      setEditingTeam(null);
    } else {
      onAdd(teamData);
    }
    setShowForm(false);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Teams</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team</span>
        </button>
      </div>

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
                  onClick={() => handleEdit(team)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(team.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">{team.member_count || 0} members</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                team.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                team.category === 'amateur' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {team.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}