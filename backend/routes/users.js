const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('../database/db');
const { authenticate } = require('../middleware/auth');

const upload = multer({
  dest: 'uploads/avatars/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
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

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, avatar_url, bio, created_at,
              (SELECT COUNT(*) FROM stories WHERE user_id = users.id) as story_count,
              (SELECT COUNT(*) FROM follows WHERE follower_id = users.id) as following_count,
              (SELECT COUNT(*) FROM follows WHERE following_id = users.id) as followers_count
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user profile
router.put('/:id', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    if (req.user.userId !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { username, email, bio } = req.body;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (username) {
      updateFields.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }
    if (email) {
      updateFields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount}`);
      values.push(bio);
      paramCount++;
    }
    if (req.file) {
      updateFields.push(`avatar_url = $${paramCount}`);
      values.push(`/uploads/avatars/${req.file.filename}`);
      paramCount++;
    }

    values.push(req.params.id);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email, avatar_url, bio`;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, avatar_url, bio
       FROM users
       WHERE LOWER(username) LIKE LOWER($1)
       ORDER BY username
       LIMIT 20`,
      [`%${req.params.query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = router;