const express = require('express');
const { ALLOWED_KEYS, getUserData, getAllUserData, setUserData, deleteAllUserData } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All data routes require authentication
router.use(authMiddleware);

// GET /api/data - bulk fetch all user data
router.get('/', async (req, res) => {
  try {
    const data = await getAllUserData(req.userId);
    res.json(data);
  } catch (err) {
    console.error('Get all data error:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

// GET /api/data/:key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ error: '无效的数据键' });
    }
    const value = await getUserData(req.userId, key);
    res.json({ key, value: value ? JSON.parse(value) : null });
  } catch (err) {
    console.error('Get data error:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

// PUT /api/data/:key
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ error: '无效的数据键' });
    }
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: '缺少数据内容' });
    }
    const jsonString = JSON.stringify(value);
    await setUserData(req.userId, key, jsonString);
    res.json({ ok: true });
  } catch (err) {
    console.error('Set data error:', err);
    res.status(500).json({ error: '保存数据失败' });
  }
});

// DELETE /api/data - delete all user data (reset)
router.delete('/', async (req, res) => {
  try {
    await deleteAllUserData(req.userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete data error:', err);
    res.status(500).json({ error: '清除数据失败' });
  }
});

module.exports = router;
