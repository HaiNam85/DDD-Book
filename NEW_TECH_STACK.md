# Story Website - New Tech Stack

## Migration Summary

The project has been completely rebuilt with a modern, production-ready tech stack.

## Key Changes

### Backend

#### Database Migration
- **From**: MongoDB with Mongoose
- **To**: PostgreSQL with native pg driver
- **Benefits**:
  - Relational data integrity
  - ACID transactions
  - Better performance for complex queries
  - Strong typing and constraints

#### New Features Added
- **Redis Integration**: Caching layer for improved performance
- **JWT Authentication**: Secure token-based authentication
- **bcrypt**: Password hashing
- **File Upload**: Multer for image uploads
- **Rate Limiting**: Express rate limiting for API protection

#### Architecture Changes
```
Old Structure:
backend/
├── models/         # Mongoose models
└── routes/         # Simple routes

New Structure:
backend/
├── database/       # Database configuration
│   ├── schema.sql  # SQL schema
│   ├── db.js       # PostgreSQL connection
│   └── redis.js    # Redis connection
├── middleware/     # Auth middleware
└── routes/         # Feature-based routes
    ├── auth.js     # Authentication
    ├── stories.js  # Story CRUD
    ├── comments.js # Comments
    ├── favorites.js
    ├── follows.js
    ├── users.js
    └── stats.js    # Statistics
```

### Frontend

#### Framework Migration
- **From**: Create React App (CRA)
- **To**: Next.js 14 with App Router
- **Benefits**:
  - Server-side rendering (SSR)
  - Better performance
  - Automatic code splitting
  - Built-in routing
  - TypeScript support

#### Styling Migration
- **From**: Custom CSS
- **To**: Tailwind CSS
- **Benefits**:
  - Utility-first approach
  - Faster development
  - Consistent design system
  - Dark mode support
  - Responsive by default

#### New Features
- **Dark/Light Mode**: System-aware theme toggle
- **TypeScript**: Type safety throughout
- **Better Performance**: Optimized with Next.js
- **Modern UI**: Tailwind utility classes

## New Features

### 1. Authentication System
- JWT-based authentication
- Secure password hashing with bcrypt
- User registration and login
- Protected routes

### 2. Comments System
- Users can comment on stories
- Edit and delete own comments
- Real-time comment display

### 3. Favorites
- Bookmark favorite stories
- View all favorites in profile
- Add/remove from favorites

### 4. Follow System
- Follow other users
- See followers and following counts
- Feed of followed users' stories

### 5. Advanced Search
- Search by title, author, description
- Category filtering
- Sort by date, views, likes
- Pagination support

### 6. Statistics
- User dashboard with stats
- Story views and engagement
- Site-wide statistics

### 7. File Upload
- Upload cover images for stories
- Avatar uploads for users
- Image validation and processing

### 8. Caching Layer
- Redis caching for stories
- Faster response times
- Reduced database load

## API Comparison

### Old API (MongoDB)
```
GET /api/stories        # All stories
GET /api/stories/:id   # Single story
POST /api/stories       # Create
PUT /api/stories/:id    # Update
DELETE /api/stories/:id # Delete
```

### New API (PostgreSQL + Features)
```
# Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/verify

# Stories (with query params)
GET /api/stories?search=query&page=1&limit=10&category=fiction
GET /api/stories/:id
POST /api/stories (multipart/form-data)
PUT /api/stories/:id (multipart/form-data)
DELETE /api/stories/:id
POST /api/stories/:id/like

# New Endpoints
GET /api/comments/story/:storyId
POST /api/comments
PUT /api/comments/:id
DELETE /api/comments/:id

GET /api/favorites/user/:userId
POST /api/favorites/story/:storyId
DELETE /api/favorites/story/:storyId

GET /api/follows/followers/:userId
GET /api/follows/following/:userId
POST /api/follows/:userId
DELETE /api/follows/:userId

GET /api/stats/overview
GET /api/stats/user/:userId
GET /api/stats/story/:storyId
```

## Technology Stack Comparison

| Aspect | Old Stack | New Stack |
|--------|-----------|-----------|
| Frontend | React (CRA) | Next.js 14 |
| Styling | Custom CSS | Tailwind CSS |
| Language | JavaScript | TypeScript |
| Database | MongoDB | PostgreSQL |
| Caching | None | Redis |
| Auth | None | JWT + bcrypt |
| File Upload | None | Multer |
| Dark Mode | No | Yes |
| Comments | No | Yes |
| Favorites | No | Yes |
| Follow | No | Yes |
| Statistics | Basic | Comprehensive |

## Performance Improvements

1. **Caching**: Redis reduces database queries
2. **SSR**: Next.js improves initial page load
3. **Database**: PostgreSQL better for complex queries
4. **TypeScript**: Prevents runtime errors
5. **Optimization**: Code splitting and lazy loading

## Migration Guide

If you have data in the old MongoDB database, you'll need to:

1. Export data from MongoDB
2. Transform to SQL insert statements
3. Import into PostgreSQL

See `backend/database/schema.sql` for the new schema.

## Benefits of New Stack

### Developer Experience
- Better type safety with TypeScript
- Faster development with Tailwind
- Hot reload with Next.js
- Better debugging tools

### User Experience
- Faster page loads (SSR)
- Dark mode support
- Better responsiveness
- More interactive features

### Scalability
- Redis caching handles more traffic
- PostgreSQL better for analytics
- Optimized database queries
- Better separation of concerns

### Security
- JWT authentication
- Password hashing
- Rate limiting
- Input validation

## Files Removed

- Old React components (`src/components/*`)
- MongoDB models
- Custom CSS files
- Old service files

## Files Added

- Next.js app structure (`app/`)
- TypeScript configuration
- Tailwind configuration
- PostgreSQL schema
- Redis integration
- New feature components
- Authentication middleware
- Stats endpoints
- File upload handling
