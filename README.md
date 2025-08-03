# Errify - A Collaborative Platform for Learning from Failures

## Overview

Errify is an innovative social platform designed to foster collaboration, learning, and growth by turning failures into valuable opportunities for improvement. Researchers, professionals, and students from all disciplines can share their research challenges, failures, and mistakes, collaborate with others to find solutions, and gain insight into overcoming setbacks.

## Vision & Mission

**Vision**: Errify aims to normalize failure as an integral part of learning and professional growth. By providing a community-focused space to discuss, reflect upon, and learn from mistakes, it encourages cross-disciplinary collaboration and innovation.

**Mission**: To provide a platform where individuals can share their challenges and failures in a supportive, constructive environment, while simultaneously learning from others' experiences. Through real-time collaboration, feedback, and sharing of resources, users can turn failures into meaningful breakthroughs.

## Core Features

### 1. User Registration and Profile Setup
- **School/Institution Email Registration**: Users must sign up using their academic or professional email to ensure credibility
- **Profile Customization**: Users can create detailed profiles with their field of expertise, research interests, and affiliations
- **Verification**: Optional verification for credibility by institutions or peers

### 2. Failure Stories Feed
- **Post Failures**: Share experiences with research failures or setbacks
- **Content Format**: Support for text, images, videos, and external links
- **Categories and Tags**: Organize posts by disciplines (chemistry, biology, engineering, business, etc.)
- **Collaboration Requests**: Include calls for collaboration or help in posts

### 3. Real-Time Collaboration
- **Live Messaging**: Real-time chat about shared challenges or ideas
- **Discussion Threads**: Dedicated comment sections for each post
- **Peer Support**: Culture of positive and constructive criticism

### 4. Patent Section
- **Idea Submission**: Submit new ideas or innovations for discussion
- **Patenting Resources**: Educational content about the patent process
- **Community Feedback**: Comment on ideas and offer suggestions
- **Confidentiality Options**: Privacy settings for patent-related posts

### 5. Learning and Resource Sharing
- **Resource Library**: Upload tools, datasets, research papers, or protocols
- **Tutorials and Webinars**: Educational content and expert guidance
- **Ask an Expert**: Submit questions for expert guidance

### 6. Gamification and Recognition
- **Badges and Achievements**: Earn badges based on activity level
- **Leaderboard**: Showcase most active users and helpful contributors
- **User Growth Tracking**: Track progress over time

### 7. Privacy and Security
- **User-Controlled Privacy**: Public, semi-private, or fully private posts
- **Data Protection**: Encrypted data storage with regulatory compliance
- **Anonymity Options**: Anonymous or pseudonymous posting

## User Journey

1. **Sign-Up**: Register with academic/professional email and create profile
2. **Post a Failure**: Share failure story with categorization
3. **Collaboration Request**: Add requests for assistance if needed
4. **Engagement**: Receive feedback and collaborate with others
5. **Patent Section**: Submit ideas for feedback (public or private)
6. **Learning**: Explore resources and attend educational content
7. **Recognition**: Earn badges and recognition through engagement

## Technology Stack

This project will be implemented using modern web technologies:

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB for flexible document storage
- **Real-time Communication**: Socket.io for live messaging
- **Authentication**: JWT with email verification
- **File Storage**: AWS S3 or similar for media uploads
- **Deployment**: Docker containers with cloud hosting

## Project Structure

```
errify/
├── frontend/          # React.js application
├── backend/           # Node.js/Express API
├── database/          # Database schemas and migrations
├── docs/             # Documentation
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd errify
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # Or run MongoDB manually
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

#### Users
- `GET /api/users` - Get all users with filtering
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/verify/:userId` - Verify another user
- `GET /api/users/me/stats` - Get user statistics

#### Posts (Failure Stories)
- `GET /api/posts` - Get all posts with filtering
- `POST /api/posts` - Create a new failure story
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/comment` - Add comment to post
- `POST /api/posts/:id/collaborate` - Request collaboration

#### Patents
- `GET /api/patents` - Get all patents with filtering
- `POST /api/patents` - Create a new patent idea
- `GET /api/patents/:id` - Get specific patent
- `PUT /api/patents/:id` - Update a patent
- `DELETE /api/patents/:id` - Delete a patent
- `POST /api/patents/:id/like` - Like/unlike a patent
- `POST /api/patents/:id/comment` - Add comment to patent
- `POST /api/patents/:id/collaborate` - Request collaboration

#### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get specific resource
- `POST /api/resources` - Upload a new resource
- `POST /api/resources/:id/review` - Add review to resource
- `GET /api/resources/categories` - Get resource categories
- `GET /api/resources/featured` - Get featured resources

#### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:id` - Get conversation messages
- `POST /api/messages/conversations` - Create new conversation
- `POST /api/messages/conversations/:id` - Send message
- `PUT /api/messages/conversations/:id/read` - Mark as read
- `DELETE /api/messages/conversations/:id` - Delete conversation
- `GET /api/messages/unread-count` - Get unread count

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm start
   ```

The frontend will be running on `http://localhost:3000`

### Testing the API

You can test the API using tools like Postman or curl:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "researcher@university.edu",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "profile": {
      "fieldOfExpertise": "Computer Science",
      "institution": "MIT",
      "position": "Student",
      "academicLevel": "Graduate"
    }
  }'
```

### Running Both Frontend and Backend

1. **Start MongoDB** (in one terminal)
   ```bash
   mongod
   ```

2. **Start the backend** (in another terminal)
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```

Now you can access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Contributing

This is a collaborative project for learning from failures. All contributions are welcome!

## License

[License information to be determined] 