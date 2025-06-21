import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, User } from 'lucide-react';
import { Participant } from '../../types';
import { ParticipantForm } from './ParticipantForm';

interface ParticipantListProps {
  participants: Participant[];
  onAdd: (participant: Omit<Participant, 'id'>) => void;
  onEdit: (id: number, participant: Partial<Participant>) => void;
  onDelete: (id: number) => void;
}

export function ParticipantList({ participants, onAdd, onEdit, onDelete }: ParticipantListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  const handleSubmit = (participantData: Omit<Participant, 'id'>) => {
    if (editingParticipant) {
      onEdit(editingParticipant.id, participantData);
      setEditingParticipant(null);
    } else {
      onAdd(participantData);
    }
    setShowForm(false);
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Participants</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Participant</span>
        </button>
      </div>

      {showForm && (
        <ParticipantForm
          participant={editingParticipant}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingParticipant(null);
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
                          {participant.first_name} {participant.last_name}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(participant)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(participant.id)}
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