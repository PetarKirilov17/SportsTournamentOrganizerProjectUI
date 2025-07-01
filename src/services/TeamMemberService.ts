import API_BASE_URL from './api';

export interface TeamMember {
  id: number;
  participantId: number;
  participantName: string;
  participantEmail: string;
  teamId: number;
  teamName: string;
  role: string;
  jerseyNumber?: number;
  addedAt: string;
}

export interface AddTeamMemberDTO {
  participant_id: number;
  role?: string;
  jersey_number?: number;
}

export interface UpdateTeamMemberDTO {
  role?: string;
  jersey_number?: number;
}

export interface ApiResponseDTO<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode?: number;
}

// Helper function to transform backend response to frontend format
const transformTeamMemberResponse = (data: any): TeamMember => {
  return {
    id: data.id,
    participantId: data.participant_id,
    participantName: data.participant_name,
    participantEmail: data.participant_email,
    teamId: data.team_id,
    teamName: data.team_name,
    role: data.role,
    jerseyNumber: data.jersey_number,
    addedAt: data.added_at,
  };
};

export const TeamMemberService = {
  getTeamMembers: async (teamId: number): Promise<TeamMember[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`);
      
      if (response.status === 404) {
        // Team members endpoint doesn't exist yet, return empty array
        return [];
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch team members');
      }
      
      const data = await response.json();
      // Handle both direct array response and wrapped response
      const members = Array.isArray(data) ? data : data.data || [];
      return members.map(transformTeamMemberResponse);
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      // If it's a network error or the endpoint doesn't exist, return empty array
      if (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'))) {
        return [];
      }
      throw error;
    }
  },

  getTeamMemberById: async (teamId: number, memberId: number): Promise<TeamMember> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch team member with id ${memberId}`);
    }
    const data = await response.json();
    return transformTeamMemberResponse(data.data);
  },

  addParticipantToTeam: async (teamId: number, addDTO: AddTeamMemberDTO): Promise<TeamMember> => {
    console.log('TeamMemberService.addParticipantToTeam called with:', { teamId, addDTO });
    console.log('TeamMemberService: Request body being sent:', JSON.stringify(addDTO, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addDTO),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('TeamMemberService.addParticipantToTeam error:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.message || 'Failed to add participant to team');
    }
    
    const data = await response.json();
    console.log('TeamMemberService.addParticipantToTeam success:', data);
    return transformTeamMemberResponse(data.data);
  },

  updateTeamMember: async (teamId: number, memberId: number, updateDTO: UpdateTeamMemberDTO): Promise<TeamMember> => {
    console.log('TeamMemberService.updateTeamMember called with:', { teamId, memberId, updateDTO });
    console.log('TeamMemberService: Request body being sent:', JSON.stringify(updateDTO, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDTO),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('TeamMemberService.updateTeamMember error:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.message || 'Failed to update team member');
    }
    
    const data = await response.json();
    console.log('TeamMemberService.updateTeamMember success:', data);
    return transformTeamMemberResponse(data.data);
  },

  removeParticipantFromTeam: async (teamId: number, memberId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove participant from team');
    }
  },

  removeParticipantFromTeamByParticipantId: async (teamId: number, participantId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/participant/${participantId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove participant from team');
    }
  },

  getParticipantsByRole: async (teamId: number, role: string): Promise<TeamMember[]> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/role/${role}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch participants by role');
    }
    const data = await response.json();
    const members = data.data || [];
    return members.map(transformTeamMemberResponse);
  },

  isParticipantInTeam: async (teamId: number, participantId: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/check/${participantId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check participant membership');
    }
    const data = await response.json();
    return data.data;
  },
}; 