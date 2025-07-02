import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Mail, User, UserX } from 'lucide-react';
import { ParticipantService, ParticipantWithMemberships, TeamMembership } from '../../services/ParticipantService';
import { Participant } from '../../types';
import { ParticipantForm } from './ParticipantForm';
import { formatDateOnly } from '../../utils/dateUtils';

export function ParticipantList() {
  const [participants, setParticipants] = useState<ParticipantWithMemberships[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithMemberships | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editingParticipantRef = useRef<ParticipantWithMemberships | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    editingParticipantRef.current = editingParticipant;
  }, [editingParticipant]);

  const fetchParticipants = async () => {
    try {
      const data = await ParticipantService.getParticipants();
      setParticipants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch participants');
      console.error(err);
    }
  };

  const handleAdd = async (participantData: Omit<Participant, 'id' | 'createdAt' | 'updatedAt' | 'teamMemberships'>) => {
    try {
      await ParticipantService.createParticipant(participantData);
      fetchParticipants();
      setShowForm(false);
    } catch (err) {
      setError('Failed to add participant');
      console.error(err);
    }
  };

  const handleEdit = async (id: number, participantData: Partial<Omit<Participant, 'id' | 'createdAt' | 'updatedAt' | 'teamMemberships'>>) => {
    try {
      await ParticipantService.updateParticipant(id, participantData);
      fetchParticipants();
      setEditingParticipant(null);
      editingParticipantRef.current = null;
      setShowForm(false);
    } catch (err) {
      setError(`Failed to update participant with id ${id}`);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ParticipantService.deleteParticipant(id);
      fetchParticipants();
    } catch (err) {
      setError(`Failed to delete participant with id ${id}`);
      console.error(err);
    }
  };

  const handleSubmit = (participantData: Omit<Participant, 'id' | 'createdAt' | 'updatedAt' | 'teamMemberships'>) => {
    const currentEditingParticipant = editingParticipantRef.current;
    
    if (currentEditingParticipant && currentEditingParticipant.id) {
      handleEdit(currentEditingParticipant.id, participantData);
    } else {
      handleAdd(participantData);
    }
  };

  const handleEditClick = (participant: ParticipantWithMemberships) => {
    setEditingParticipant(participant);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Participants</h3>
        <button
          onClick={() => {
            setEditingParticipant(null);
            editingParticipantRef.current = null;
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Participant</span>
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {showForm && (
        <ParticipantForm
          participant={editingParticipant}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingParticipant(null);
            editingParticipantRef.current = null;
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teams
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {participant.firstName} {participant.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {formatDateOnly(participant.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {participant.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      participant.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                      participant.category === 'amateur' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {participant.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {participant.teamMemberships && participant.teamMemberships.length > 0 ? (
                        <div className="space-y-2">
                          {participant.teamMemberships.map((membership, index) => (
                            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="font-semibold text-blue-900 text-sm">
                                    {membership.teamName}
                                  </span>
                                </div>
                                {membership.jerseyNumber && (
                                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                                    #{membership.jerseyNumber}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600 font-medium">Role:</span>
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                    {membership.role}
                                  </span>
                                </div>
                                
                                <div className="text-xs text-gray-500">
                                  {formatDateOnly(membership.addedAt)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                              <UserX className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-gray-400 text-xs">No teams</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(participant)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(participant.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}