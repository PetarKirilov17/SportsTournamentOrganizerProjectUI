import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Tournament, TournamentService } from '../../../services/TournamentService';
import { Leaderboard } from './Leaderboard';
import { ManageTeams } from './ManageTeams';
import { ManageMatches } from './ManageMatches';

interface TournamentDetailPageProps {
  tournamentId: number;
  onBack: () => void;
}

export function TournamentDetailPage({ tournamentId, onBack }: TournamentDetailPageProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

  const triggerLeaderboardRefresh = () => setRefreshLeaderboard((c) => c + 1);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const data = await TournamentService.getTournamentById(tournamentId);
        setTournament(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tournament details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>;
  }

  if (!tournament) {
    return <div>Tournament not found.</div>;
  }
  
  const isBeforeTournamentStart = new Date() < new Date(tournament.start_date);

  return (
    <div className="space-y-8">
      <div>
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tournaments
        </button>
        <h2 className="text-2xl font-bold text-gray-900">{tournament.name}</h2>
        <p className="text-gray-600">{tournament.sport_type}</p>
      </div>

      <div className="space-y-6">
        <Leaderboard tournamentId={tournament.id} refreshKey={refreshLeaderboard} />
      </div>
      
      {isBeforeTournamentStart && (
        <div className="space-y-6">
          <ManageTeams tournamentId={tournament.id} onChange={triggerLeaderboardRefresh} />
        </div>
      )}

      <div className="space-y-6">
        <ManageMatches tournamentId={tournament.id} onChange={triggerLeaderboardRefresh} />
      </div>
    </div>
  );
} 