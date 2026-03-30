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
      book_name       TEXT    DEFAULT '',
      chapter_name    TEXT    DEFAULT '',
      is_public       INTEGER DEFAULT 0,
      questions       TEXT    NOT NULL DEFAULT '[]',
      question_count  INTEGER DEFAULT 0,
      source_filename TEXT,
      created_at      TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Migration: add book_name and chapter_name columns if missing
  try {
    await db.execute({ sql: "ALTER TABLE question_banks ADD COLUMN book_name TEXT DEFAULT ''", args: [] });
  } catch(e) { /* column already exists */ }
  try {
    await db.execute({ sql: "ALTER TABLE question_banks ADD COLUMN chapter_name TEXT DEFAULT ''", args: [] });
  } catch(e) { /* column already exists */ }
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

async function createBank(userId, name, questions, sourceFilename, bookName, chapterName) {
  const result = await db.execute({
    sql: 'INSERT INTO question_banks (user_id, name, book_name, chapter_name, questions, question_count, source_filename) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [userId, name, bookName || '', chapterName || '', JSON.stringify(questions), questions.length, sourceFilename || null]
  });
  return { id: Number(result.lastInsertRowid), name, question_count: questions.length };
}

async function getUserBanks(userId) {
  const result = await db.execute({
    sql: 'SELECT id, name, book_name, chapter_name, is_public, question_count, source_filename, created_at FROM question_banks WHERE user_id = ? ORDER BY book_name, chapter_name, created_at DESC',
    args: [userId]
  });
  return result.rows;
}

async function getPublicBanks(userId) {
  // Get all public banks except the user's own (include system banks with user_id=0)
  const result = await db.execute({
    sql: `SELECT qb.id, qb.name, qb.book_name, qb.chapter_name, qb.question_count, qb.created_at,
            CASE WHEN qb.user_id = 0 THEN '系统默认' ELSE COALESCE(u.email, '系统默认') END as author_email
          FROM question_banks qb LEFT JOIN users u ON qb.user_id = u.id
          WHERE qb.is_public = 1 AND qb.user_id != ?
          ORDER BY qb.book_name, qb.chapter_name, qb.created_at DESC`,
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

// ── Seed default question banks ──

async function seedDefaultBanks() {
  // Check if default banks already seeded
  const check = await db.execute({
    sql: "SELECT COUNT(*) as cnt FROM question_banks WHERE user_id = 0",
    args: []
  });
  if (check.rows[0].cnt > 0) {
    console.log('[Seed] Default banks already exist, skipping.');
    return;
  }

  console.log('[Seed] Importing default question banks...');

  // Ensure system user exists (user_id = 0 for default banks)
  try {
    await db.execute({
      sql: "INSERT OR IGNORE INTO users (id, email, password) VALUES (0, 'system@default', 'nologin')",
      args: []
    });
  } catch(e) { /* already exists */ }

  let gailan, shiwu;
  try {
    gailan = require('./questions-gailan.js');
    shiwu = require('./questions-shiwu.js');
  } catch(e) {
    console.log('[Seed] Question files not found, skipping seed.');
    return;
  }

  const banks = [
    { book: '档案事业概论', chapter: '单选题', name: '档案事业概论-单选题', questions: gailan.gailan_danxuan },
    { book: '档案事业概论', chapter: '多选题', name: '档案事业概论-多选题', questions: gailan.gailan_duoxuan },
    { book: '档案事业概论', chapter: '判断题', name: '档案事业概论-判断题', questions: gailan.gailan_panduan },
    { book: '档案工作实务', chapter: '单选题', name: '档案工作实务-单选题', questions: shiwu.shiwu_danxuan },
    { book: '档案工作实务', chapter: '多选题', name: '档案工作实务-多选题', questions: shiwu.shiwu_duoxuan },
    { book: '档案工作实务', chapter: '判断题', name: '档案工作实务-判断题', questions: shiwu.shiwu_panduan },
  ];

  for (const b of banks) {
    await db.execute({
      sql: 'INSERT INTO question_banks (user_id, name, book_name, chapter_name, questions, question_count, is_public) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [0, b.name, b.book, b.chapter, JSON.stringify(b.questions), b.questions.length, 1]
    });
    console.log(`[Seed] ✓ ${b.book} > ${b.chapter}: ${b.questions.length} questions`);
  }
  console.log('[Seed] Default banks imported successfully.');
}

module.exports = {
  db, initDB, seedDefaultBanks, ALLOWED_KEYS,
  getUserByEmail, createUser, getUserById,
  getUserData, getAllUserData, setUserData, deleteAllUserData,
  createBank, getUserBanks, getPublicBanks, getBankById,
  updateBankVisibility, deleteBank, renameBank
};
