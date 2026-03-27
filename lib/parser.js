/**
 * Question parser — extracts structured questions from plain text.
 * Compatible with 疯狂刷题 and common Chinese exam document formats.
 *
 * Supported question types: single (单选), multi (多选), tf (判断), fill (填空)
 * Supported numbering: 1. / 1、/ 一、/ 第1题 / (1) / 1）etc.
 * Supported option markers: A. / A、/ A) / A） / (A) etc.
 * Supported answer markers: 答案：A / 正确答案：ABC / 答案:A、C / 【答案】A etc.
 * Supported inline answers: 题目内容（A）/ 题目内容(A)
 */

// ── Normalize ──

function normalizeText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Normalize common full-width punctuation
    .replace(/\uff0e/g, '.')     // ．
    .replace(/\uff1a/g, ':')     // ：
    .replace(/\uff08/g, '(')     // （
    .replace(/\uff09/g, ')')     // ）
    .replace(/\uff0c/g, ',')     // ，
    .replace(/\u3001/g, '、')    // 、
    .replace(/\uff1b/g, ';')     // ；
    .replace(/\u3010/g, '【')
    .replace(/\u3011/g, '】')
    // Remove common noise
    .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') // BOM + trim
    .trim();
}

// ── Regex patterns ──

// Question number at start of line
// Matches: 1. / 1、/ 1) / 1） / (1) / 一、/ 第1题 / 题目1 etc.
const Q_NUM_RE = /^(?:\d{1,4}[.、\s)）]\s*|[(（]\d{1,4}[)）]\s*|第[\d一二三四五六七八九十百]+[题题目][.、:\s]*|[\d一二三四五六七八九十百]+[.、]\s*)/;

// Option line
// Matches: A. / A、/ A) / A） / (A) / A: / A  选项内容
const OPT_RE = /^([A-Ha-h])\s*[.、)）:\s]\s*(.+)/;

// Answer line (standalone)
// Matches: 答案：A / 正确答案:ABC / 参考答案：A、C / 【答案】A / Answer: A
const ANS_LINE_RE = /^(?:【?(?:答案|正确答案|参考答案|本题答案)】?|answer)\s*[:：\s]\s*([A-Ha-h,、;\s]+)/i;

// Answer line for true/false
// Matches: 答案：正确 / 答案：错误 / 答案：√ / 答案：× / 答案：对 / 答案：错 / 答案：true / 答案：false
const ANS_TF_RE = /^(?:【?(?:答案|正确答案|参考答案)】?)\s*[:：\s]\s*(正确|错误|对|错|√|×|✓|✗|true|false|T|F|是|否)/i;

// Inline answer in question text: 题目内容（A）or 题目(B)
const INLINE_ANS_RE = /[(（]\s*([A-Ha-h])\s*[)）]/;

// Section header (used to detect chapter/section dividers, not questions)
const SECTION_RE = /^(?:第[一二三四五六七八九十百\d]+[章节部分篇]|[一二三四五六七八九十]+[、.]\s*(?:单选|多选|判断|填空|简答|选择|综合))/;

// Question type hint in question text
const TYPE_MULTI_RE = /多选|多项选择/;
const TYPE_TF_RE = /判断[题对错正]|是否正确|对错题/;
const TYPE_FILL_RE = /填空/;

// Explanation line
const EXPLAIN_RE = /^(?:【?(?:解析|答案解析|详解|解答|分析)】?)\s*[:：\s]\s*(.*)/;

// ── Parsing ──

function parseAnswerLetters(str) {
  // Extract all uppercase letters from answer string
  // "A、C" → ["A","C"], "ABC" → ["A","B","C"], "A;C" → ["A","C"]
  const letters = [];
  for (const ch of str.toUpperCase()) {
    if (ch >= 'A' && ch <= 'H' && !letters.includes(ch)) {
      letters.push(ch);
    }
  }
  return letters;
}

function detectTFAnswer(str) {
  const s = str.trim().toLowerCase();
  if (['正确', '对', '√', '✓', 'true', 't', '是'].includes(s)) return 'true';
  if (['错误', '错', '×', '✗', 'false', 'f', '否'].includes(s)) return 'false';
  return null;
}

function parseQuestions(text) {
  text = normalizeText(text);
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const questions = [];
  let current = null;
  let currentExplanation = '';
  let sectionType = 'single'; // default type from section headers

  function finalizeQuestion() {
    if (!current || !current.question) { current = null; return; }

    // Determine question type
    let type = current.type || sectionType;
    const qText = current.question;

    // Auto-detect type from question text
    if (TYPE_TF_RE.test(qText) && current.options.length === 0) {
      type = 'tf';
    } else if (TYPE_MULTI_RE.test(qText)) {
      type = 'multi';
    } else if (TYPE_FILL_RE.test(qText) && current.options.length === 0) {
      type = 'fill';
    }

    // True/false with 2 options that look like 对/错 or 正确/错误
    if (current.options.length === 2) {
      const o = current.options.map(s => s.trim());
      if ((o[0] === '正确' && o[1] === '错误') || (o[0] === '对' && o[1] === '错') ||
          (o[0] === '√' && o[1] === '×') || (o[0] === 'T' && o[1] === 'F')) {
        type = 'tf';
      }
    }

    // Format answer based on type
    let answer = current.answer;
    const explanation = (currentExplanation || current.explanation || '').trim();

    if (type === 'tf') {
      // For tf, answer should be "true" or "false"
      if (typeof answer === 'string') {
        const tf = detectTFAnswer(answer);
        if (tf) answer = tf;
        else if (answer === 'A') answer = 'true';
        else if (answer === 'B') answer = 'false';
        else answer = 'true'; // default
      } else {
        answer = 'true';
      }
      // Minimal valid tf question
      if (current.question) {
        questions.push({ question: current.question, answer, type: 'tf', explanation });
      }
    } else if (type === 'fill') {
      if (current.question) {
        questions.push({ question: current.question, answer: answer || '', type: 'fill', explanation });
      }
    } else if (current.options.length >= 2) {
      // Choice question (single or multi)
      if (Array.isArray(answer) && answer.length > 1) type = 'multi';
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        answer = 'A'; // default
      }
      questions.push({
        question: current.question,
        options: current.options,
        answer,
        type,
        explanation
      });
    }

    current = null;
    currentExplanation = '';
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip section headers but note the section type
    if (SECTION_RE.test(line)) {
      finalizeQuestion();
      if (/多选|多项/.test(line)) sectionType = 'multi';
      else if (/判断/.test(line)) sectionType = 'tf';
      else if (/填空/.test(line)) sectionType = 'fill';
      else sectionType = 'single';
      continue;
    }

    // Check for explanation line
    const explainMatch = line.match(EXPLAIN_RE);
    if (explainMatch && current) {
      currentExplanation = explainMatch[1].trim();
      continue;
    }

    // Check for true/false answer line
    const tfAnsMatch = line.match(ANS_TF_RE);
    if (tfAnsMatch && current) {
      current.type = 'tf';
      current.answer = detectTFAnswer(tfAnsMatch[1]) || 'true';
      // Don't finalize yet — explanation may follow
      continue;
    }

    // Check for choice answer line
    const ansMatch = line.match(ANS_LINE_RE);
    if (ansMatch && current) {
      const letters = parseAnswerLetters(ansMatch[1]);
      if (letters.length === 1) {
        current.answer = letters[0];
      } else if (letters.length > 1) {
        current.answer = letters;
        current.type = 'multi';
      }
      // Don't finalize yet — explanation may follow
      continue;
    }

    // Check for option line
    const optMatch = line.match(OPT_RE);
    if (optMatch && current) {
      current.options.push(optMatch[2].trim());
      continue;
    }

    // Check if this starts a new question
    const qMatch = line.match(Q_NUM_RE);
    if (qMatch) {
      finalizeQuestion();
      let qText = line.slice(qMatch[0].length).trim();
      let answer = null;

      // Check for inline answer like (A) in question text
      const inlineMatch = qText.match(INLINE_ANS_RE);
      if (inlineMatch) {
        answer = inlineMatch[1].toUpperCase();
        qText = qText.replace(INLINE_ANS_RE, '(   )');
      }

      current = { question: qText, options: [], answer, type: null, explanation: '' };
      continue;
    }

    // Continuation of current question or explanation
    if (current) {
      if (currentExplanation) {
        currentExplanation += ' ' + line;
      } else if (current.options.length === 0) {
        current.question += ' ' + line;
      }
    }
  }

  // Finalize last question
  finalizeQuestion();
  return questions;
}

/**
 * Robust parser with multiple strategies.
 */
function parseQuestionsRobust(text) {
  // Strategy 1: Standard line-by-line parsing
  let questions = parseQuestions(text);
  if (questions.length > 0) return questions;

  // Strategy 2: Split by double newlines (block mode)
  text = normalizeText(text);
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim().length > 5);

  for (const block of blocks) {
    const blockLines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (blockLines.length < 2) continue;

    let question = '';
    const options = [];
    let answer = null;
    let explanation = '';

    for (const line of blockLines) {
      const ansMatch = line.match(ANS_LINE_RE);
      const tfMatch = line.match(ANS_TF_RE);
      const optMatch = line.match(OPT_RE);
      const explMatch = line.match(EXPLAIN_RE);

      if (tfMatch) {
        answer = detectTFAnswer(tfMatch[1]) || 'true';
      } else if (ansMatch) {
        const letters = parseAnswerLetters(ansMatch[1]);
        answer = letters.length === 1 ? letters[0] : letters;
      } else if (explMatch) {
        explanation = explMatch[1].trim();
      } else if (optMatch && options.length < 8) {
        options.push(optMatch[2].trim());
      } else if (options.length === 0 && !answer) {
        const cleaned = line.replace(Q_NUM_RE, '').trim();
        question += (question ? ' ' : '') + cleaned;
      }
    }

    if (question && options.length >= 2) {
      if (!answer) answer = 'A';
      const type = Array.isArray(answer) && answer.length > 1 ? 'multi' : 'single';
      questions.push({ question, options, answer, type, explanation });
    } else if (question && options.length === 0 && answer) {
      // Likely true/false
      questions.push({ question, answer, type: 'tf', explanation });
    }
  }

  return questions;
}

module.exports = { parseQuestionsRobust };
