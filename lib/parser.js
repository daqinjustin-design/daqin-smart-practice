/**
 * Question parser — extracts structured questions from plain text.
 * Supports multiple common Chinese exam formats.
 */

// Normalize full-width chars and clean up text
function normalizeText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\uff0e/g, '.')   // ．→ .
    .replace(/\uff0c/g, ',')   // ，
    .replace(/\uff1a/g, ':')   // ：→ :
    .replace(/\uff08/g, '(')   // （
    .replace(/\uff09/g, ')')   // ）
    .replace(/\u3001/g, '、')
    .trim();
}

/**
 * Parse questions from text content.
 * Supported formats:
 *   1. 题目内容          or   一、题目内容
 *      A. 选项A               A、选项A
 *      B. 选项B               B、选项B
 *      答案：A                 答案:A
 *
 * Returns array of { question, options: [string], answer: number (0-based index), type: 'single' }
 */
function parseQuestions(text) {
  text = normalizeText(text);
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const questions = [];
  let current = null;

  // Patterns
  const questionStartRe = /^(?:[\d一二三四五六七八九十百]+[.、\s)）]\s*|第[\d一二三四五六七八九十]+题[.、:\s]*|题目[\d]*[.、:\s]*)/;
  const optionRe = /^([A-Fa-f])[.、)）:\s]\s*(.+)/;
  const answerRe = /^(?:答案|正确答案|参考答案|answer)[：:\s]*([A-Fa-f]+)/i;
  const inlineAnswerRe = /[\(（]\s*([A-Fa-f])\s*[\)）]/;

  function finalizeQuestion() {
    if (current && current.question && current.options.length >= 2) {
      // If no answer found, default to first option
      if (current.answer === -1) current.answer = 0;
      questions.push({
        question: current.question,
        options: current.options,
        answer: current.answer,
        type: current.options.length > 0 ? 'single' : 'text'
      });
    }
    current = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is an answer line
    const answerMatch = line.match(answerRe);
    if (answerMatch && current) {
      const ansLetter = answerMatch[1].toUpperCase().charAt(0);
      current.answer = ansLetter.charCodeAt(0) - 65;
      finalizeQuestion();
      continue;
    }

    // Check if this is an option line
    const optionMatch = line.match(optionRe);
    if (optionMatch && current) {
      current.options.push(optionMatch[2].trim());
      continue;
    }

    // Check if this starts a new question
    const qMatch = line.match(questionStartRe);
    if (qMatch) {
      finalizeQuestion();
      let qText = line.slice(qMatch[0].length).trim();
      let answer = -1;

      // Check for inline answer like (A) in the question text
      const inlineMatch = qText.match(inlineAnswerRe);
      if (inlineMatch) {
        answer = inlineMatch[1].toUpperCase().charCodeAt(0) - 65;
        qText = qText.replace(inlineAnswerRe, '(   )');
      }

      current = { question: qText, options: [], answer };
      continue;
    }

    // If we have a current question and this line doesn't match patterns,
    // it might be a continuation of the question text
    if (current && current.options.length === 0 && !optionMatch) {
      current.question += ' ' + line;
    }
  }

  // Finalize last question
  finalizeQuestion();

  return questions;
}

/**
 * Try to parse questions with fallback heuristics.
 * If standard parsing yields few results, try looser patterns.
 */
function parseQuestionsRobust(text) {
  // First try standard parsing
  let questions = parseQuestions(text);

  // If we got results, return them
  if (questions.length > 0) return questions;

  // Fallback: try splitting by double newlines as question blocks
  text = normalizeText(text);
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim().length > 10);
  const optionRe = /^([A-Fa-f])[.、)）:\s]\s*(.+)/;
  const answerRe = /(?:答案|正确答案|参考答案)[：:\s]*([A-Fa-f]+)/i;

  for (const block of blocks) {
    const blockLines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (blockLines.length < 3) continue;

    let question = '';
    const options = [];
    let answer = -1;

    for (const line of blockLines) {
      const optMatch = line.match(optionRe);
      const ansMatch = line.match(answerRe);
      if (ansMatch) {
        answer = ansMatch[1].toUpperCase().charCodeAt(0) - 65;
      } else if (optMatch) {
        options.push(optMatch[2].trim());
      } else if (options.length === 0) {
        // Part of question
        question += (question ? ' ' : '') + line.replace(/^[\d一二三四五六七八九十]+[.、\s)）]/, '').trim();
      }
    }

    if (question && options.length >= 2) {
      if (answer === -1) answer = 0;
      questions.push({ question, options, answer, type: 'single' });
    }
  }

  return questions;
}

module.exports = { parseQuestionsRobust };
