# CampusFlow - AI-Powered College Disruptions Handler

CampusFlow is a modern, intelligent disruption management system designed to streamline the reporting, tracking, and resolution of campus-related issues. The platform connects students with relevant administrative departments through an intuitive interface, while leveraging AI to provide actionable insights on disruption sentiment.

## Features

### Student Portal
- **User Authentication**: Student login using college email
- **Disruption Filing System**: 
  - Category selection (Infrastructure, IT Department, Library, Classroom/Staff-room)
  - Auto-priority assignment
  - Disruption description with character counter
  - Image upload support (JPG, PNG, HEIC)
- **Disruption Tracking Dashboard**: View all submitted disruptions with status indicators

### Admin Portal
- **Admin Authentication**: Special recognition code system for department admins
- **Disruption Management Interface**:
  - Real-time notifications for new disruptions
  - Disruption card display with AI tone analysis
  - Filtering and search capabilities
- **Resolution Workflow**: 
  - Resolve button with modal for resolution details
  - Resolution image upload
  - Resolution description

### AI-Powered Tone Analysis
- Analyzes sentiment and tone of student-submitted disruptions
- Provides actionable recommendations for admins
- Five tone categories: Urgent/Frustrated, Neutral/Professional, Polite/Patient, Angry/Aggressive, Confused/Seeking Help

## Technology Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API

### Backend & Database
- **Backend**: Flask (Python)
- **Database**: Supabase for disruption data storage
- **Authentication**: Firebase for user authentication
- **AI**: Custom NLP service for tone analysis

## Setup Instructions

### Frontend
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend
1. Navigate to the `backend` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Start the Flask server: `python app.py`

## API Endpoints

### Disruption Management
- `POST /api/disruptions` - Create new disruption
- `GET /api/disruptions/:id` - Get disruption details
- `GET /api/disruptions/student/:studentId` - Get student's disruptions
- `GET /api/disruptions/admin/:category` - Get category-specific disruptions
- `PATCH /api/disruptions/:id/resolve` - Resolve disruption

### AI Analysis
- `POST /api/analyze-tone` - Analyze disruption tone

### File Upload
- `POST /api/upload/disruption-image` - Upload disruption image
- `POST /api/upload/resolution-image` - Upload resolution image

## Development Phases

### Phase 1: MVP (Minimum Viable Product)
- Basic student portal with disruption filing
- Admin portal with basic resolution workflow
- Firebase authentication
- Supabase database integration
- Image upload functionality

### Phase 2: AI Integration
- Implement tone analysis feature
- Flask API development
- Real-time notifications

### Phase 3: Enhancement
- Advanced filtering and search
- Analytics dashboard
- Email notifications
- Mobile responsiveness optimization

### Phase 4: Polish & Launch
- UI/UX refinements
- Performance optimization
- Security audit
- User testing and feedback
- Production deployment

## Future Enhancements
- Mobile app (iOS/Android)
- Advanced analytics for administrators
- Automated disruption routing based on AI analysis
- Integration with college management systems
- Chatbot for common queries
- Student feedback system post-resolution
- Multi-language support
- Dark mode theme