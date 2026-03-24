const express = require('express');
const bcrypt = require('bcryptjs');
const { getUserByEmail, createUser, getUserById } = require('../db');
const { authMiddleware, signToken } = require('../middleware/auth');

// Email validation regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = function(authLimiter) {
  const router = express.Router();

  // POST /api/register
  router.post('/register', authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ error: '请填写邮箱和密码' });
      }
      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: '邮箱格式不正确' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: '密码长度至少6位' });
      }
      if (password.length > 128) {
        return res.status(400).json({ error: '密码过长' });
      }

      const existing = await getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: '该邮箱已注册' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await createUser(email, hashedPassword);
      const token = signToken(user.id, user.email);

      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: '注册失败，请重试' });
    }
  });

  // POST /api/login
  router.post('/login', authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ error: '请填写邮箱和密码' });
      }

      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }

      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }

      const token = signToken(user.id, user.email);
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: '登录失败，请重试' });
    }
  });

  // GET /api/me
  router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json({ id: user.id, email: user.email, created_at: user.created_at });
    } catch (err) {
      console.error('Me error:', err);
      res.status(500).json({ error: '获取用户信息失败' });
    }
  });

  return router;
};
