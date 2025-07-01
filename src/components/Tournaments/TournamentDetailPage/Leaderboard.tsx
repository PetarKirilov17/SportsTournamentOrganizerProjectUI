import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { TournamentService, LeaderboardEntry } from '../../../services/TournamentService';

interface LeaderboardProps {
  tournamentId: number;
  refreshKey?: number;
}

export function Leaderboard({ tournamentId, refreshKey }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    TournamentService.getLeaderboard(tournamentId)
      .then(setEntries)
      .catch(() => setError('Failed to fetch leaderboard'))
      .finally(() => setLoading(false));
  }, [tournamentId, refreshKey]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Leaderboard
      </h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-4 py-2">#</th>
            <th className="text-left px-4 py-2">Team</th>
            <th className="text-right px-4 py-2">Wins</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry.team_id}>
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2">{entry.team_name}</td>
              <td className="px-4 py-2 text-right">{entry.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && <div className="text-gray-500 text-center py-4">No teams yet.</div>}
    </div>
  );
} 