const { createClient } = require('@libsql/client');

// Turso cloud DB (set via environment variables)
// Fallback to local file for development
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:data.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
      password    TEXT    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_data (
      user_id     INTEGER NOT NULL,
      key         TEXT    NOT NULL,
      value       TEXT    NOT NULL DEFAULT '{}',
      updated_at  TEXT    DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS question_banks (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL,
      name            TEXT    NOT NULL,
      is_public       INTEGER DEFAULT 0,
      questions       TEXT    NOT NULL DEFAULT '[]',
      question_count  INTEGER DEFAULT 0,
      source_filename TEXT,
      created_at      TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

const ALLOWED_KEYS = [
  'exam_progress', 'exam_bank', 'exam_settings',
  'exam_notes', 'exam_qstats', 'exam_qtags',
  'exam_reports', 'exam_pomodoro'
];

async function getUserByEmail(email) {
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
  return result.rows[0] || null;
}

async function createUser(email, hashedPassword) {
  const result = await db.execute({
    sql: 'INSERT INTO users (email, password) VALUES (?, ?)',
    args: [email, hashedPassword]
  });
  return { id: Number(result.lastInsertRowid), email };
}

async function getUserById(id) {
  const result = await db.execute({
    sql: 'SELECT id, email, created_at FROM users WHERE id = ?',
    args: [id]
  });
  return result.rows[0] || null;
}

async function getUserData(userId, key) {
  const result = await db.execute({
    sql: 'SELECT value FROM user_data WHERE user_id = ? AND key = ?',
    args: [userId, key]
  });
  return result.rows[0] ? result.rows[0].value : null;
}

async function getAllUserData(userId) {
  const result = await db.execute({
    sql: 'SELECT key, value FROM user_data WHERE user_id = ?',
    args: [userId]
  });
  const data = {};
  for (const row of result.rows) {
    try { data[row.key] = JSON.parse(row.value); } catch { data[row.key] = row.value; }
  }
  return data;
}

async function setUserData(userId, key, jsonString) {
  await db.execute({
    sql: `INSERT INTO user_data (user_id, key, value, updated_at)
          VALUES (?, ?, ?, datetime('now'))
          ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    args: [userId, key, jsonString]
  });
}

async function deleteAllUserData(userId) {
  await db.execute({ sql: 'DELETE FROM user_data WHERE user_id = ?', args: [userId] });
}

// ── Question Bank functions ──

async function createBank(userId, name, questions, sourceFilename) {
  const result = await db.execute({
    sql: 'INSERT INTO question_banks (user_id, name, questions, question_count, source_filename) VALUES (?, ?, ?, ?, ?)',
    args: [userId, name, JSON.stringify(questions), questions.length, sourceFilename || null]
  });
  return { id: Number(result.lastInsertRowid), name, question_count: questions.length };
}

async function getUserBanks(userId) {
  const result = await db.execute({
    sql: 'SELECT id, name, is_public, question_count, source_filename, created_at FROM question_banks WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId]
  });
  return result.rows;
}

async function getPublicBanks(userId) {
  // Get all public banks except the user's own
  const result = await db.execute({
    sql: `SELECT qb.id, qb.name, qb.question_count, qb.created_at, u.email as author_email
          FROM question_banks qb JOIN users u ON qb.user_id = u.id
          WHERE qb.is_public = 1 AND qb.user_id != ?
          ORDER BY qb.created_at DESC`,
    args: [userId]
  });
  return result.rows;
}

async function getBankById(bankId) {
  const result = await db.execute({
    sql: 'SELECT * FROM question_banks WHERE id = ?',
    args: [bankId]
  });
  return result.rows[0] || null;
}

async function updateBankVisibility(bankId, userId, isPublic) {
  await db.execute({
    sql: 'UPDATE question_banks SET is_public = ? WHERE id = ? AND user_id = ?',
    args: [isPublic ? 1 : 0, bankId, userId]
  });
}

async function deleteBank(bankId, userId) {
  await db.execute({
    sql: 'DELETE FROM question_banks WHERE id = ? AND user_id = ?',
    args: [bankId, userId]
  });
}

async function renameBank(bankId, userId, newName) {
  await db.execute({
    sql: 'UPDATE question_banks SET name = ? WHERE id = ? AND user_id = ?',
    args: [newName, bankId, userId]
  });
}

module.exports = {
  db, initDB, ALLOWED_KEYS,
  getUserByEmail, createUser, getUserById,
  getUserData, getAllUserData, setUserData, deleteAllUserData,
  createBank, getUserBanks, getPublicBanks, getBankById,
  updateBankVisibility, deleteBank, renameBank
};
