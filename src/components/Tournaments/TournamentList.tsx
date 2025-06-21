import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { Tournament } from '../../types';
import { TournamentForm } from './TournamentForm';

interface TournamentListProps {
  tournaments: Tournament[];
  onAdd: (tournament: Omit<Tournament, 'id'>) => void;
  onEdit: (id: number, tournament: Partial<Tournament>) => void;
  onDelete: (id: number) => void;
}

export function TournamentList({ tournaments, onAdd, onEdit, onDelete }: TournamentListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

  const handleSubmit = (tournamentData: Omit<Tournament, 'id'>) => {
    if (editingTournament) {
      onEdit(editingTournament.id, tournamentData);
      setEditingTournament(null);
    } else {
      onAdd(tournamentData);
    }
    setShowForm(false);
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Tournaments</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tournament</span>
        </button>
      </div>

      {showForm && (
        <TournamentForm
          tournament={editingTournament}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTournament(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{tournament.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(tournament)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(tournament.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                </span>
              </div>
              {tournament.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{tournament.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">{tournament.sport_type}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                tournament.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {tournament.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}