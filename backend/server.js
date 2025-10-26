const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const commentRoutes = require('./routes/comments');
const favoriteRoutes = require('./routes/favorites');
const followRoutes = require('./routes/follows');
const userRoutes = require('./routes/users');
const statsRoutes = require('./routes/stats');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Story Website API with PostgreSQL and Redis' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Using PostgreSQL database');
  
  // Check Redis status
  const cache = require('./config/cache');
  if (cache.isEnabled()) {
    console.log('✅ Redis caching: ENABLED');
  } else {
    console.log('⚠️  Redis caching: DISABLED');
    console.log('   Set ENABLE_REDIS=true in .env to enable caching');
  }
});