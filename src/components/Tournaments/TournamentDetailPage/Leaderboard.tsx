import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Registration, RegistrationService } from '../../../services/RegistrationService';

interface LeaderboardProps {
  tournamentId: number;
}

interface TeamScore extends Registration {
  score: number;
}

export function Leaderboard({ tournamentId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const registrations = await RegistrationService.getRegistrations(tournamentId);
        
        // TODO: Calculate scores based on match results
        const teamsWithScores = registrations
          .filter(reg => reg.status === 'registered')
          .map(reg => ({ ...reg, score: 0 })) // Placeholder score
          .sort((a, b) => b.score - a.score);

        setLeaderboard(teamsWithScores);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [tournamentId]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Leaderboard
      </h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
      
      {!loading && !error && (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rank</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Team</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((team, index) => (
              <tr key={team.team_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{index + 1}</td>
                <td className="px-4 py-3 text-gray-800">{team.team.name}</td>
                <td className="px-4 py-3 text-right text-gray-800 font-semibold">{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && leaderboard.length === 0 && (
        <p className="text-gray-500 text-center py-4">No registered teams yet.</p>
      )}
    </div>
  );
} 