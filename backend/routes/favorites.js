const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { authenticate } = require('../middleware/auth');

// Get user's favorite stories
router.get('/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.username, u.avatar_url
       FROM favorites f
       JOIN stories s ON f.story_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE f.user_id = $1 AND s.published = true
       ORDER BY f.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Check if story is favorited by user
router.get('/user/:userId/story/:storyId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND story_id = $2',
      [req.params.userId, req.params.storyId]
    );
    res.json({ isFavorited: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ message: 'Error checking favorite' });
  }
});

// Add to favorites
router.post('/story/:storyId', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO favorites (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [req.user.userId, req.params.storyId]
    );

    if (result.rows.length > 0) {
      res.json({ message: 'Story added to favorites', favorited: true });
    } else {
      res.json({ message: 'Already in favorites', favorited: true });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// Remove from favorites
router.delete('/story/:storyId', authenticate, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND story_id = $2',
      [req.user.userId, req.params.storyId]
    );
    res.json({ message: 'Story removed from favorites', favorited: false });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
});

module.exports = router;
