const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../database/db');
const cache = require('../config/cache');
const { authenticate } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all stories with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category;
    const sortBy = req.query.sortBy || 'created_at';
    const order = req.query.order || 'DESC';

    let query = `
      SELECT s.*, u.username, u.avatar_url,
             (SELECT COUNT(*) FROM story_likes WHERE story_id = s.id) as like_count
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.published = true
    `;

    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (LOWER(s.title) LIKE $${paramCount} OR LOWER(s.description) LIKE $${paramCount} OR LOWER(s.content) LIKE $${paramCount})`;
      params.push(`%${search.toLowerCase()}%`);
      paramCount++;
    }

    if (category) {
      query += ` AND s.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Validate sortBy
    const allowedSortFields = ['created_at', 'views', 'likes', 'title', 'like_count'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY s.${sortField} ${sortOrder} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      stories: result.rows,
      page,
      limit,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Error fetching stories' });
  }
});

// Get single story
router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `story:${req.params.id}`;
    
    // Check cache first (if enabled)
    const cachedStory = await cache.get(cacheKey);
    if (cachedStory) {
      return res.json(cachedStory);
    }

    const result = await pool.query(
      `SELECT s.*, u.username, u.avatar_url, u.bio,
              (SELECT COUNT(*) FROM story_likes WHERE story_id = s.id) as like_count
       FROM stories s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const story = result.rows[0];

    // Increment views
    await pool.query('UPDATE stories SET views = views + 1 WHERE id = $1', [req.params.id]);

    // Cache for 1 hour (if enabled)
    await cache.set(cacheKey, story, 3600);

    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Error fetching story' });
  }
});

// Create story
router.post('/', authenticate, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, content, category, published } = req.body;
    const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO stories (user_id, title, description, content, cover_image_url, category, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.userId, title, description, content, coverImageUrl, category || 'general', published !== 'false']
    );

    // Clear cache (if enabled)
    await cache.clear('stories:*');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Error creating story' });
  }
});

// Update story
router.put('/:id', authenticate, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, content, category, published } = req.body;

    // Check if user owns the story
    const storyCheck = await pool.query('SELECT user_id FROM stories WHERE id = $1', [req.params.id]);
    
    if (storyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (storyCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this story' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (content) {
      updateFields.push(`content = $${paramCount}`);
      values.push(content);
      paramCount++;
    }
    if (category) {
      updateFields.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    if (published !== undefined) {
      updateFields.push(`published = $${paramCount}`);
      values.push(published);
      paramCount++;
    }
    if (req.file) {
      updateFields.push(`cover_image_url = $${paramCount}`);
      values.push(`/uploads/${req.file.filename}`);
      paramCount++;
    }

    values.push(req.params.id);
    const query = `UPDATE stories SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);

    // Clear cache (if enabled)
    await cache.del(`story:${req.params.id}`);
    await cache.clear('stories:*');

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Error updating story' });
  }
});

// Delete story
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Check ownership
    const storyCheck = await pool.query('SELECT user_id FROM stories WHERE id = $1', [req.params.id]);
    
    if (storyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (storyCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await pool.query('DELETE FROM stories WHERE id = $1', [req.params.id]);

    // Clear cache (if enabled)
    await cache.del(`story:${req.params.id}`);
    await cache.clear('stories:*');

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Error deleting story' });
  }
});

// Get user's stories
router.get('/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stories WHERE user_id = $1 AND published = true ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ message: 'Error fetching stories' });
  }
});

// Like/Unlike story
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if already liked
    const existingLike = await pool.query(
      'SELECT * FROM story_likes WHERE user_id = $1 AND story_id = $2',
      [userId, id]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await pool.query('DELETE FROM story_likes WHERE user_id = $1 AND story_id = $2', [userId, id]);
      await pool.query('UPDATE stories SET likes = GREATEST(likes - 1, 0) WHERE id = $1', [id]);
      res.json({ liked: false, message: 'Story unliked' });
    } else {
      // Like
      await pool.query('INSERT INTO story_likes (user_id, story_id) VALUES ($1, $2)', [userId, id]);
      await pool.query('UPDATE stories SET likes = likes + 1 WHERE id = $1', [id]);
      res.json({ liked: true, message: 'Story liked' });
    }

    // Clear cache (if enabled)
    await cache.del(`story:${id}`);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
});

module.exports = router;