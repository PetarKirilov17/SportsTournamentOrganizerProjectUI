import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Match, MatchService } from '../../../services/MatchService';

interface ManageMatchesProps {
  tournamentId: number;
}

export function ManageMatches({ tournamentId }: ManageMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await MatchService.getMatches(tournamentId);
        setMatches(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tournamentId]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Manage Matches</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
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
              <div key={match.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{match.home_team.name} vs {match.away_team.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.scheduled_at).toLocaleString()} | {match.venue.name}
                  </p>
                </div>
                <div className="text-sm font-medium capitalize">{match.status}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No matches scheduled yet.</p>
          )}
        </div>
      )}
    </div>
  );
} 