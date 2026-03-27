const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const { authMiddleware } = require('../middleware/auth');
const { parseQuestionsRobust } = require('../lib/parser');
const {
  createBank, getUserBanks, getPublicBanks, getBankById,
  updateBankVisibility, deleteBank, renameBank
} = require('../db');

const router = express.Router();
router.use(authMiddleware);

// Multer: accept up to 10MB files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const ext = file.originalname.toLowerCase();
    if (allowed.includes(file.mimetype) || ext.endsWith('.doc') || ext.endsWith('.docx') || ext.endsWith('.pdf') || ext.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 doc、docx、pdf、txt 格式'));
    }
  }
});

// Extract text from uploaded file buffer
async function extractText(buffer, mimetype, filename) {
  const ext = filename.toLowerCase();

  if (ext.endsWith('.txt') || mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }

  if (ext.endsWith('.pdf') || mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext.endsWith('.docx') || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext.endsWith('.doc') || mimetype === 'application/msword') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (e) {
      throw new Error('无法解析 .doc 文件，建议转换为 .docx 后重试');
    }
  }

  throw new Error('不支持的文件格式');
}

// POST /api/banks/upload — upload doc/docx/pdf and parse questions
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择文件' });
    }
    const bankName = (req.body.name || '').trim();
    if (!bankName) {
      return res.status(400).json({ error: '请输入题库名称' });
    }
    if (bankName.length > 100) {
      return res.status(400).json({ error: '题库名称不能超过100个字符' });
    }

    const text = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: '文件内容为空或无法提取文本' });
    }

    const questions = parseQuestionsRobust(text);
    if (questions.length === 0) {
      return res.status(400).json({
        error: '未能识别出题目。请确保文档中的题目格式清晰，例如：\n\n1. 题目内容\nA. 选项A\nB. 选项B\nC. 选项C\nD. 选项D\n答案：B\n\n常见问题：避免使用表格、特殊排版或自动编号功能。',
        extracted_preview: text.substring(0, 800)
      });
    }

    const isPublic = req.body.is_public === '1' || req.body.is_public === 'true' ? 1 : 0;
    const bank = await createBank(req.userId, bankName, questions, req.file.originalname);

    if (isPublic) {
      await updateBankVisibility(bank.id, req.userId, true);
    }

    res.json({
      id: bank.id,
      name: bankName,
      question_count: questions.length,
      is_public: isPublic,
      questions
    });
  } catch (err) {
    console.error('Upload bank error:', err);
    if (err.message && (err.message.includes('仅支持') || err.message.includes('无法解析'))) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: '上传解析失败，请重试' });
  }
});

// POST /api/banks/json — import from JSON (existing functionality, now with naming)
router.post('/json', async (req, res) => {
  try {
    const { name, questions, is_public } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '请输入题库名称' });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: '题目列表为空' });
    }

    const bank = await createBank(req.userId, name.trim(), questions, null);
    if (is_public) {
      await updateBankVisibility(bank.id, req.userId, true);
    }

    res.json({ id: bank.id, name: name.trim(), question_count: questions.length, is_public: is_public ? 1 : 0 });
  } catch (err) {
    console.error('Import JSON bank error:', err);
    res.status(500).json({ error: '导入失败，请重试' });
  }
});

// GET /api/banks — list current user's banks
router.get('/', async (req, res) => {
  try {
    const banks = await getUserBanks(req.userId);
    res.json(banks);
  } catch (err) {
    console.error('List banks error:', err);
    res.status(500).json({ error: '获取题库列表失败' });
  }
});

// GET /api/banks/public — list all public banks from other users
router.get('/public', async (req, res) => {
  try {
    const banks = await getPublicBanks(req.userId);
    res.json(banks);
  } catch (err) {
    console.error('List public banks error:', err);
    res.status(500).json({ error: '获取公共题库失败' });
  }
});

// GET /api/banks/:id — get a bank's full data (own or public)
router.get('/:id', async (req, res) => {
  try {
    const bank = await getBankById(Number(req.params.id));
    if (!bank) return res.status(404).json({ error: '题库不存在' });
    // Must be owner or bank must be public
    if (bank.user_id !== req.userId && !bank.is_public) {
      return res.status(403).json({ error: '无权访问该题库' });
    }
    let questions;
    try { questions = JSON.parse(bank.questions); } catch { questions = []; }
    res.json({
      id: bank.id,
      name: bank.name,
      is_public: bank.is_public,
      question_count: bank.question_count,
      questions,
      is_owner: bank.user_id === req.userId,
      created_at: bank.created_at
    });
  } catch (err) {
    console.error('Get bank error:', err);
    res.status(500).json({ error: '获取题库失败' });
  }
});

// PATCH /api/banks/:id — update bank name or visibility
router.patch('/:id', async (req, res) => {
  try {
    const bankId = Number(req.params.id);
    const { name, is_public } = req.body;

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ error: '题库名称不能为空' });
      await renameBank(bankId, req.userId, name.trim());
    }
    if (is_public !== undefined) {
      await updateBankVisibility(bankId, req.userId, !!is_public);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Update bank error:', err);
    res.status(500).json({ error: '更新失败' });
  }
});

// DELETE /api/banks/:id — delete a bank (owner only)
router.delete('/:id', async (req, res) => {
  try {
    await deleteBank(Number(req.params.id), req.userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete bank error:', err);
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
