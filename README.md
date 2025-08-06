# 🚀 Errify - Research Failure Sharing Platform

A full-stack web application for researchers to share and learn from research failures, fostering collaboration and knowledge transfer in the scientific community.

## 🌟 Features

- **📝 Post Creation**: Share research failures with detailed descriptions
- **💬 Real-time Comments**: Interactive commenting system with live updates
- **👍 Like System**: Like and engage with posts
- **🔐 Authentication**: Secure user authentication with Supabase
- **📱 Responsive Design**: Mobile-friendly interface
- **⚡ Real-time Updates**: Live updates using Socket.IO
- **🏷️ Categorization**: Organize posts by research fields
- **🔒 Privacy Controls**: Public and private post options

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time features
- **Axios** for API communication
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **Supabase** for database and authentication
- **Socket.IO** for real-time communication
- **Express Validator** for input validation

### Database
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions**

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/T-ultrafast/Errify.git
cd Errify
```

### 2. Set Up Supabase Database

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings > API
3. **Run the database setup script** in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of setup-database.sql
-- This will create all necessary tables and policies
```

### 3. Environment Setup

#### Backend Environment
Create `.env` file in the `backend` directory:
```env
PORT=5001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

#### Frontend Environment
Create `.env` file in the `frontend-vite` directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5001/api
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend-vite
npm install
```

### 5. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5001`

#### Start Frontend Server
```bash
cd frontend-vite
npm run dev
```
Frontend will run on `http://localhost:5173`

### 6. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Errify/
├── backend/                 # Node.js API server
│   ├── models/             # Supabase-based data models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
├── frontend-vite/          # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utility libraries
│   │   └── App.jsx         # Main app component
│   └── package.json
├── setup-database.sql      # Database setup script
└── README.md
```

## 🔧 API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Comments
- `POST /api/posts/:id/comment` - Add a comment to a post

### Likes
- `POST /api/posts/:id/like` - Like/unlike a post

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

## 🎯 Key Features Explained

### Real-time Updates
- **Socket.IO Integration**: Live updates for comments and likes
- **Room-based Communication**: Efficient real-time updates per post
- **Optimistic UI Updates**: Immediate feedback for user interactions

### Authentication & Security
- **Supabase Auth**: Secure authentication system
- **Row Level Security**: Database-level security policies
- **JWT Tokens**: Stateless authentication
- **Middleware Protection**: Route-level security

### Database Design
- **Normalized Schema**: Efficient data relationships
- **JSONB Fields**: Flexible data storage for complex objects
- **Indexes**: Optimized query performance
- **Triggers**: Automatic timestamp updates

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic scaling

### Database
- Supabase provides hosting and scaling automatically
- No additional database setup required

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for backend-as-a-service
- **Vite** for fast development experience
- **Tailwind CSS** for utility-first styling
- **Socket.IO** for real-time communication

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/T-ultrafast/Errify/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

**Made with ❤️ for the research community** 