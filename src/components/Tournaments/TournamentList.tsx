import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { Tournament, TournamentService } from '../../services/TournamentService';
import { TournamentForm } from './TournamentForm';

interface TournamentListProps {
  onTournamentClick: (id: number) => void;
}

export function TournamentList({ onTournamentClick }: TournamentListProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const data = await TournamentService.getTournaments();
      setTournaments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tournaments');
      console.error(err);
    }
  };

  const handleAdd = async (tournamentData: Omit<Tournament, 'id'>) => {
    try {
      await TournamentService.createTournament(tournamentData);
      fetchTournaments();
      setShowForm(false);
    } catch (err) {
      setError('Failed to add tournament');
      console.error(err);
    }
  };

  const handleEdit = async (id: number, tournamentData: Partial<Omit<Tournament, 'id'>>) => {
    try {
      await TournamentService.updateTournament(id, tournamentData);
      fetchTournaments();
      setEditingTournament(null);
      setShowForm(false);
    } catch (err) {
      setError(`Failed to update tournament with id ${id}`);
      console.error(err);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await TournamentService.deleteTournament(id);
      fetchTournaments();
    } catch (err) {
      setError(`Failed to delete tournament with id ${id}`);
      console.error(err);
    }
  };

  const handleSubmit = (tournamentData: Omit<Tournament, 'id'>) => {
    if (editingTournament) {
      handleEdit(editingTournament.id, tournamentData);
    } else {
      handleAdd(tournamentData);
    }
  };

  const handleEditClick = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Tournaments</h3>
        <button
          onClick={() => {
            setEditingTournament(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tournament</span>
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

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
          <div 
            key={tournament.id} 
            className="bg-white rounded-lg shadow-md border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onTournamentClick(tournament.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{tournament.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(tournament);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(tournament.id);
                  }}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}