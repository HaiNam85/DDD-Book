# DDD-Book - Story Reading Website

A modern full-stack story reading website built with **Next.js**, **Tailwind CSS**, **Node.js**, **PostgreSQL**, and **Redis**.

## ✨ Features

- 📚 Browse and discover amazing stories
- 📖 Read full story content with beautiful interface
- ✍️ Create new stories with cover image upload
- ✏️ Edit and delete your stories
- ❤️ Like stories
- 💬 Comment on stories
- ⭐ Add stories to favorites
- 👥 Follow other users
- 🌓 Dark/Light mode toggle
- 🔍 Advanced search functionality
- 📊 User statistics and dashboard
- 🚀 Optimized with Redis caching

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup PostgreSQL database
# Create a database called 'story_website'
# Run the schema: psql -U postgres -d story_website -f database/schema.sql

# Configure environment variables
# Edit .env file with your database credentials

# Start the server
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env.local with API URL

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🛠️ Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Redis** - Caching layer
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **next-themes** - Dark mode support
- **Axios** - HTTP client

## 📁 Project Structure

```
DDD-Book/
├── backend/                   # Node.js backend
│   ├── database/              # Database config & schema
│   │   ├── schema.sql         # PostgreSQL schema
│   │   ├── db.js              # DB connection
│   │   └── redis.js           # Redis connection
│   ├── middleware/            # Express middleware
│   │   └── auth.js            # JWT authentication
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication
│   │   ├── stories.js         # Story management
│   │   ├── comments.js        # Comment system
│   │   ├── favorites.js       # Favorites
│   │   ├── follows.js         # User follows
│   │   ├── users.js           # User profiles
│   │   └── stats.js           # Statistics
│   └── server.js              # Express server
├── frontend/                  # Next.js frontend
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── create/            # Create story page
│   │   ├── edit/[id]/         # Edit story page
│   │   ├── story/[id]/         # Story detail page
│   │   ├── login/             # Login page
│   │   └── profile/           # User profile page
│   ├── components/            # React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── ThemeToggle.tsx    # Dark mode toggle
│   │   ├── StoryList.tsx      # Story listing
│   │   ├── StoryDetail.tsx    # Story reading
│   │   ├── CreateStory.tsx    # Create story form
│   │   ├── EditStory.tsx      # Edit story form
│   │   ├── Login.tsx          # Auth form
│   │   ├── UserMenu.tsx       # User menu
│   │   └── UserProfile.tsx    # User dashboard
│   └── lib/                   # Utilities
│       └── api.ts             # API client
└── README.md
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Stories
- `GET /api/stories` - Get all stories (with pagination, search, filtering)
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create story (requires auth)
- `PUT /api/stories/:id` - Update story (requires auth)
- `DELETE /api/stories/:id` - Delete story (requires auth)
- `POST /api/stories/:id/like` - Like/unlike story (requires auth)
- `GET /api/stories/user/:userId` - Get user's stories

### Comments
- `GET /api/comments/story/:storyId` - Get story comments
- `POST /api/comments` - Create comment (requires auth)
- `PUT /api/comments/:id` - Update comment (requires auth)
- `DELETE /api/comments/:id` - Delete comment (requires auth)

### Favorites
- `GET /api/favorites/user/:userId` - Get user favorites
- `GET /api/favorites/user/:userId/story/:storyId` - Check if favorited
- `POST /api/favorites/story/:storyId` - Add to favorites (requires auth)
- `DELETE /api/favorites/story/:storyId` - Remove from favorites (requires auth)

### Follows
- `GET /api/follows/followers/:userId` - Get user's followers
- `GET /api/follows/following/:userId` - Get users followed by user
- `GET /api/follows/check/:userId` - Check if following (requires auth)
- `POST /api/follows/:userId` - Follow user (requires auth)
- `DELETE /api/follows/:userId` - Unfollow user (requires auth)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile (requires auth)
- `GET /api/users/search/:query` - Search users

### Statistics
- `GET /api/stats/overview` - Overall site statistics
- `GET /api/stats/user/:userId` - User statistics
- `GET /api/stats/story/:storyId` - Story statistics

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=story_website
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration (Optional - set ENABLE_REDIS=false to disable caching)
ENABLE_REDIS=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎨 Features in Detail

- **Search**: Full-text search across story titles, descriptions, and content
- **Dark/Light Mode**: System-aware theme toggle with persistent preference
- **Login/Register**: Secure JWT-based authentication with bcrypt password hashing
- **Comments**: Real-time comment system on stories
- **Favorites**: Bookmark your favorite stories
- **Follow System**: Follow other users to see their stories
- **Upload Stories**: Create stories with cover image uploads
- **Statistics**: Track views, likes, comments, and user activity
- **Caching**: Redis-powered caching for improved performance

## 📝 License

ISC
