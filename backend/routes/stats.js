const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { authenticate } = require('../middleware/auth');

// Get overall statistics
router.get('/overview', async (req, res) => {
  try {
    const [users, stories, comments, likes] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM stories WHERE published = true'),
      pool.query('SELECT COUNT(*) as count FROM comments'),
      pool.query('SELECT COUNT(*) as count FROM story_likes')
    ]);

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalStories: parseInt(stories.rows[0].count),
      totalComments: parseInt(comments.rows[0].count),
      totalLikes: parseInt(likes.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Get user statistics
router.get('/user/:userId', async (req, res) => {
  try {
    const [stories, followers, following, favorites] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM stories WHERE user_id = $1', [req.params.userId]),
      pool.query('SELECT COUNT(*) as count FROM follows WHERE following_id = $1', [req.params.userId]),
      pool.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [req.params.userId]),
      pool.query('SELECT COUNT(*) as count FROM favorites WHERE user_id = $1', [req.params.userId])
    ]);

    res.json({
      storiesCount: parseInt(stories.rows[0].count),
      followersCount: parseInt(followers.rows[0].count),
      followingCount: parseInt(following.rows[0].count),
      favoritesCount: parseInt(favorites.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// Get story statistics
router.get('/story/:storyId', async (req, res) => {
  try {
    const [views, likes, comments, favorites] = await Promise.all([
      pool.query('SELECT views FROM stories WHERE id = $1', [req.params.storyId]),
      pool.query('SELECT COUNT(*) as count FROM story_likes WHERE story_id = $1', [req.params.storyId]),
      pool.query('SELECT COUNT(*) as count FROM comments WHERE story_id = $1', [req.params.storyId]),
      pool.query('SELECT COUNT(*) as count FROM favorites WHERE story_id = $1', [req.params.storyId])
    ]);

    res.json({
      views: views.rows[0]?.views || 0,
      likes: parseInt(likes.rows[0].count) || 0,
      comments: parseInt(comments.rows[0].count) || 0,
      favorites: parseInt(favorites.rows[0].count) || 0
    });
  } catch (error) {
    console.error('Error fetching story stats:', error);
    res.status(500).json({ message: 'Error fetching story statistics' });
  }
});

module.exports = router;
