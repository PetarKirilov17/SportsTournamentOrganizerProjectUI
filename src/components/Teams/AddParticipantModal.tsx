import React, { useState, useEffect } from 'react';
import { X, Search, User, Mail, Plus } from 'lucide-react';
import { TeamMemberService, AddTeamMemberDTO, AvailableParticipant } from '../../services/TeamMemberService';

interface AddParticipantModalProps {
  teamId: number;
  teamName: string;
  isOpen: boolean;
  onClose: () => void;
  onParticipantAdded: () => void;
}

export function AddParticipantModal({
  teamId,
  teamName,
  isOpen,
  onClose,
  onParticipantAdded,
}: AddParticipantModalProps) {
  console.log('AddParticipantModal: Received props - teamId:', teamId, 'teamName:', teamName, 'isOpen:', isOpen);
  
  const [participants, setParticipants] = useState<AvailableParticipant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<AvailableParticipant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<AvailableParticipant | null>(null);
  const [formData, setFormData] = useState({
    role: '',
    jerseyNumber: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchAvailableParticipants();
    }
  }, [isOpen, teamId]);

  useEffect(() => {
    // Filter participants based on search term
    if (participants.length > 0) {
      filterParticipants();
    }
  }, [participants, searchTerm]);

  const fetchAvailableParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate teamId before making the API call
      if (!teamId || teamId === undefined || teamId === null) {
        console.error('AddParticipantModal: Invalid teamId:', teamId);
        setError('Invalid team ID');
        setParticipants([]);
        return;
      }
      
      console.log('AddParticipantModal: Fetching available participants for teamId:', teamId);
      const availableParticipants = await TeamMemberService.getAvailableParticipantsForTeam(teamId);
      setParticipants(availableParticipants || []);
      
    } catch (err) {
      console.error('AddParticipantModal: Error fetching available participants:', err);
      setError('Failed to fetch available participants');
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    // Only filter if we have participants loaded
    if (participants.length === 0) {
      setFilteredParticipants([]);
      return;
    }
    
    const filtered = participants.filter(participant => {
      const matchesSearch = participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredParticipants(filtered);
  };

  const handleParticipantSelect = (participant: AvailableParticipant) => {
    setSelectedParticipant(participant);
  };

  const handleAddParticipant = async () => {
    if (!selectedParticipant) {
      console.error('AddParticipantModal: No participant selected');
      setError('Please select a participant first');
      return;
    }

    if (!selectedParticipant.id) {
      console.error('AddParticipantModal: Selected participant has no ID:', selectedParticipant);
      setError('Selected participant has no valid ID');
      return;
    }
    
    console.log('AddParticipantModal: handleAddParticipant called with teamId:', teamId, 'selectedParticipant:', selectedParticipant);
    
    // Validate teamId is not undefined
    if (!teamId || teamId === undefined) {
      console.error('AddParticipantModal: Team ID is missing:', teamId);
      setError('Team ID is missing. Please try again.');
      return;
    }

    try {
      setLoading(true);
      console.log('Adding participant to team:', { teamId, participantId: selectedParticipant.id });
      
      const addDTO: AddTeamMemberDTO = {
        participant_id: selectedParticipant.id,
        role: formData.role || undefined,
        jersey_number: formData.jerseyNumber ? parseInt(formData.jerseyNumber) : undefined,
      };

      console.log('AddParticipantModal: addDTO being sent:', JSON.stringify(addDTO, null, 2));
      console.log('AddParticipantModal: selectedParticipant:', JSON.stringify(selectedParticipant, null, 2));
      console.log('AddParticipantModal: selectedParticipant.id type:', typeof selectedParticipant.id);
      console.log('AddParticipantModal: selectedParticipant.id value:', selectedParticipant.id);

      await TeamMemberService.addParticipantToTeam(teamId, addDTO);
      
      // Reset form
      setSelectedParticipant(null);
      setFormData({ role: '', jerseyNumber: '' });
      setSearchTerm('');
      
      onParticipantAdded();
      onClose();
    } catch (err) {
      setError('Failed to add participant to team');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedParticipant(null);
    setFormData({ role: '', jerseyNumber: '' });
    setSearchTerm('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  console.log('AddParticipantModal: Rendering modal with teamId:', teamId, 'isOpen:', isOpen);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Participant to {teamName}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {error && (
            <div className="text-red-500 bg-red-100 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Search Section */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search available participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading available participants...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredParticipants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>
                      {searchTerm ? 'No participants found matching your search.' : 'No available participants to add.'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Only participants matching the team category are shown.
                    </p>
                  </div>
                ) : (
                  filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      onClick={() => handleParticipantSelect(participant)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedParticipant?.id === participant.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {participant.firstName} {participant.lastName}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{participant.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            participant.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                            participant.category === 'amateur' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {participant.category}
                          </span>
                          {selectedParticipant?.id === participant.id && (
                            <Plus className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Form Section - Only show if participant is selected */}
          {selectedParticipant && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Selected Participant</h3>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">{selectedParticipant.firstName} {selectedParticipant.lastName}</div>
                  <div>{selectedParticipant.email}</div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedParticipant.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                      selectedParticipant.category === 'amateur' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedParticipant.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Player, Coach, Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jersey Number (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddParticipant}
            disabled={!selectedParticipant || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Team</span>
          </button>
        </div>
      </div>
    </div>
  );
} 