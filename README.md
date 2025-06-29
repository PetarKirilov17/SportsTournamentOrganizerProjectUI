# Sports Tournament Organizer - Frontend

A React-based frontend application for managing sports tournaments, teams, participants, and venues.

## Features

### Team Management
- **View Teams**: Display all teams with their basic information
- **Create Teams**: Add new teams with name and category
- **Edit Teams**: Modify existing team details
- **Delete Teams**: Remove teams from the system

### Team Member Management (New Feature)
- **View Team Details**: Click on any team to see detailed information and team members
- **Add Participants to Teams**: Add existing participants to teams with optional role and jersey number
- **Remove Team Members**: Remove participants from teams
- **Edit Team Member Details**: Update role and jersey number for team members
- **Search Participants**: Search through available participants when adding to teams

## Team Member Functionality

The team member system allows you to:

1. **Click on any team** in the team list to open a detailed view
2. **View all current team members** with their roles, jersey numbers, and join dates
3. **Add new participants** to the team using the "Add Participant" button
4. **Search and filter** available participants (excluding those already in the team)
5. **Assign roles and jersey numbers** when adding participants
6. **Edit member details** by clicking the edit icon on any team member
7. **Remove members** from the team using the delete icon

## API Integration

The application integrates with a Spring Boot backend API with the following endpoints:

### Team Member Endpoints
- `GET /teams/{teamId}/members` - Get all team members
- `POST /teams/{teamId}/members` - Add participant to team
- `PUT /teams/{teamId}/members/{memberId}` - Update team member
- `DELETE /teams/{teamId}/members/{memberId}` - Remove team member
- `GET /teams/{teamId}/members/check/{participantId}` - Check if participant is in team

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Ensure the backend API is running** on `http://localhost:8080`

## Project Structure

```
src/
├── components/
│   ├── Teams/
│   │   ├── TeamList.tsx          # Main team list with click-to-view functionality
│   │   ├── TeamDetails.tsx       # Team details modal with member management
│   │   ├── TeamMemberList.tsx    # Display and manage team members
│   │   ├── AddParticipantModal.tsx # Modal for adding participants to teams
│   │   └── TeamForm.tsx          # Form for creating/editing teams
│   └── ...
├── services/
│   ├── TeamService.ts            # Team CRUD operations
│   ├── TeamMemberService.ts      # Team member management API calls
│   ├── ParticipantService.ts     # Participant management
│   └── ...
└── types.ts                      # TypeScript interfaces
```

## Technologies Used

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Fetch API** for HTTP requests

## Backend Requirements

The frontend expects a Spring Boot backend with the following features:
- Team management endpoints
- Participant management endpoints
- Team member management endpoints (as documented in the controller)
- CORS configuration to allow frontend requests 