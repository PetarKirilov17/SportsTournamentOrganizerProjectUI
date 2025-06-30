import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Match, MatchService, MatchStatus } from '../../../services/MatchService';
import { Team, TeamService } from '../../../services/TeamService';
import { Venue, VenueService } from '../../../services/VenueService';

interface ManageMatchesProps {
  tournamentId: number;
}

export function ManageMatches({ tournamentId }: ManageMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [form, setForm] = useState<{
    home_team_id: string;
    away_team_id: string;
    venue_id: string;
    scheduled_at: string;
    status: MatchStatus;
  }>({
    home_team_id: '',
    away_team_id: '',
    venue_id: '',
    scheduled_at: '',
    status: MatchStatus.SCHEDULED,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesData, teamsData, venuesData] = await Promise.all([
        MatchService.getMatches(tournamentId),
        TeamService.getTeams(),
        VenueService.getVenues(),
      ]);
      setMatches(matchesData);
      setTeams(teamsData);
      setVenues(venuesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch matches/teams/venues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  const handleOpenModal = () => {
    setForm({
      home_team_id: '',
      away_team_id: '',
      venue_id: '',
      scheduled_at: '',
      status: MatchStatus.SCHEDULED,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'status' ? value as MatchStatus : value,
    });
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.home_team_id || !form.away_team_id || !form.venue_id || !form.scheduled_at) {
      setFormError('All fields are required.');
      return;
    }
    if (form.home_team_id === form.away_team_id) {
      setFormError('Home and away teams must be different.');
      return;
    }
    try {
      await MatchService.createMatch(tournamentId, {
        home_team_id: Number(form.home_team_id),
        away_team_id: Number(form.away_team_id),
        venue_id: Number(form.venue_id),
        scheduled_at: form.scheduled_at,
        status: form.status,
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError('Failed to schedule match');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Manage Matches</h3>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          onClick={handleOpenModal}
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Match</span>
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map(match => (
              <div key={match?.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{match?.home_team?.name} vs {match?.away_team?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(match?.scheduled_at).toLocaleString()} | {match?.venue?.name}
                  </p>
                </div>
                <div className="text-sm font-medium capitalize">{match?.status}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No matches scheduled yet.</p>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Schedule a Match</h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Team</label>
                <select
                  name="home_team_id"
                  value={form.home_team_id}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select home team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Away Team</label>
                <select
                  name="away_team_id"
                  value={form.away_team_id}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select away team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <select
                  name="venue_id"
                  value={form.venue_id}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select venue</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.values(MatchStatus).map(status => (
                    <option key={status} value={status}>{status.charAt(0) + status.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              {formError && <div className="text-red-500 bg-red-100 p-2 rounded">{formError}</div>}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 