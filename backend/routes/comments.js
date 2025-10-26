const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const cache = require('../config/cache');
const { authenticate } = require('../middleware/auth');

// Get comments for a story
router.get('/story/:storyId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.username, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.story_id = $1
       ORDER BY c.created_at DESC`,
      [req.params.storyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Create comment
router.post('/', authenticate, async (req, res) => {
  try {
    const { storyId, content } = req.body;

    if (!storyId || !content) {
      return res.status(400).json({ message: 'Story ID and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO comments (story_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [storyId, req.user.userId, content]
    );

    // Get comment with user info
    const commentResult = await pool.query(
      `SELECT c.*, u.username, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    // Clear cache (if enabled)
    await cache.del(`story:${storyId}`);

    res.status(201).json(commentResult.rows[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

// Update comment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    // Check ownership
    const commentCheck = await pool.query('SELECT story_id FROM comments WHERE id = $1 AND user_id = $2', 
      [req.params.id, req.user.userId]);
    
    if (commentCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const result = await pool.query(
      'UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [content, req.params.id]
    );

    // Clear cache (if enabled)
    await cache.del(`story:${commentCheck.rows[0].story_id}`);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Error updating comment' });
  }
});

// Delete comment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const commentCheck = await pool.query(
      'SELECT story_id FROM comments WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);

    // Clear cache (if enabled)
    await cache.del(`story:${commentCheck.rows[0].story_id}`);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;
