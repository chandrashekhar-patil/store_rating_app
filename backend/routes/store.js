const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth(['store_owner']));

router.get('/dashboard', async (req, res) => {
  try {
    const [stores] = await pool.query('SELECT id FROM stores WHERE owner_id = ?', [req.user.id]);
    if (stores.length === 0) return res.status(404).json({ error: 'Store not found' });
    const store_id = stores[0].id;
    const [ratings] = await pool.query('SELECT u.name, r.rating FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ?', [store_id]);
    const [[{ average_rating }]] = await pool.query('SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?', [store_id]);
    res.json({ ratings, average_rating: average_rating || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
