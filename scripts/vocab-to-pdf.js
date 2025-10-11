#!/usr/bin/env node

/**
 * Vocabulary JSON to PDF Converter
 * Converts vocabulary JSON files to beautifully formatted PDF using Puppeteer
 *
 * Usage: node scripts/vocab-to-pdf.js <unit-id>
 * Example: node scripts/vocab-to-pdf.js unit-9-possibilities
 */

const fs = require('fs');
const path = require('path');

// Check if Puppeteer is available
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.error(`❌ Error: Puppeteer is not installed.`);
  console.error(`Please install it by running: npm install puppeteer`);
  process.exit(1);
}

// Constants
const DATA_DIR = path.join(__dirname, '..', 'data', 'vocabulary');
const OUTPUT_DIR = path.join(__dirname, '..', 'exports', 'pdf');
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'vocab-pdf-template.html');

// Difficulty level badges
const DIFFICULTY_BADGES = {
  basic: { class: 'badge-basic', label: '🟢 Basic' },
  intermediate: { class: 'badge-intermediate', label: '🟡 Intermediate' },
  advanced: { class: 'badge-advanced', label: '🔴 Advanced' }
};

/**
 * Generate HTML content for PDF
 */
function generateHTMLContent(vocab) {
  let html = '';

  // Grammar Terms
  if (vocab.grammarTerms && vocab.grammarTerms.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title">📖 Grammar Terms</h2>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Pronunciation</th>
              <th>Vietnamese</th>
              <th>Definition</th>
              <th>Example</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
    `;

    vocab.grammarTerms.forEach(term => {
      const badge = DIFFICULTY_BADGES[term.difficulty] || { class: '', label: term.difficulty };
      html += `
        <tr>
          <td><strong>${term.word}</strong></td>
          <td class="pronunciation">${term.pronunciation || 'N/A'}</td>
          <td>${term.vietnamese}</td>
          <td>${term.definition}</td>
          <td class="example">${term.example}</td>
          <td><span class="badge ${badge.class}">${badge.label}</span></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  // Difficult Words
  if (vocab.difficultWords && vocab.difficultWords.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title">💡 Difficult Words</h2>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Pronunciation</th>
              <th>Vietnamese</th>
              <th>Definition</th>
              <th>Example</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
    `;

    vocab.difficultWords.forEach(word => {
      const badge = DIFFICULTY_BADGES[word.difficulty] || { class: '', label: word.difficulty };
      html += `
        <tr>
          <td><strong>${word.word}</strong></td>
          <td class="pronunciation">${word.pronunciation || 'N/A'}</td>
          <td>${word.vietnamese}</td>
          <td>${word.definition}</td>
          <td class="example">${word.example}</td>
          <td><span class="badge ${badge.class}">${badge.label}</span></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  // Key Phrases
  if (vocab.keyPhrases && vocab.keyPhrases.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title">🔑 Key Grammar Phrases</h2>
    `;

    vocab.keyPhrases.forEach((phrase, index) => {
      html += `
        <div class="phrase-card">
          <h3>${index + 1}. ${phrase.phrase || phrase.expression}</h3>
          <div class="detail"><strong>Vietnamese:</strong> ${phrase.vietnamese}</div>
          ${phrase.structure ? `<div class="detail"><strong>Structure:</strong> <span class="structure">${phrase.structure}</span></div>` : ''}
          <div class="detail"><strong>Definition:</strong> ${phrase.definition}</div>
          <div class="detail"><strong>Example:</strong> <span class="example">${phrase.example}</span></div>
          ${phrase.usage ? `<div class="detail"><strong>Usage Note:</strong> ${phrase.usage}</div>` : ''}
        </div>
      `;
    });

    html += `</div>`;
  }

  // Phrasal Verbs
  if (vocab.phrasalVerbs && vocab.phrasalVerbs.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title">🚀 Phrasal Verbs</h2>
        <table>
          <thead>
            <tr>
              <th>Phrasal Verb</th>
              <th>Vietnamese</th>
              <th>Definition</th>
              <th>Example</th>
              <th>Synonyms</th>
            </tr>
          </thead>
          <tbody>
    `;

    vocab.phrasalVerbs.forEach(verb => {
      const synonyms = verb.synonyms ? verb.synonyms.join(', ') : 'N/A';
      html += `
        <tr>
          <td><strong>${verb.verb}</strong></td>
          <td>${verb.vietnamese}</td>
          <td>${verb.definition}</td>
          <td class="example">${verb.example}</td>
          <td>${synonyms}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  // Useful Expressions
  if (vocab.usefulExpressions && vocab.usefulExpressions.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title">💬 Useful Expressions</h2>
        <ul class="expression-list">
    `;

    vocab.usefulExpressions.forEach((expr, index) => {
      html += `
        <li>
          ${index + 1}. <strong>${expr.expression}</strong><br>
          <span class="vietnamese">${expr.vietnamese}</span><br>
          <span class="example">${expr.example}</span>
          ${expr.type ? `<br><em>(Type: ${expr.type})</em>` : ''}
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
  }

  return html;
}

/**
 * Main conversion function
 */
async function convertToPDF(unitId) {
  try {
    // Read JSON file
    const jsonPath = path.join(DATA_DIR, `${unitId}.json`);

    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Error: File not found: ${jsonPath}`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const vocab = data.vocabularyData;

    // Read HTML template
    if (!fs.existsSync(TEMPLATE_PATH)) {
      console.error(`❌ Error: Template not found: ${TEMPLATE_PATH}`);
      process.exit(1);
    }

    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    // Generate content HTML
    const contentHTML = generateHTMLContent(vocab);

    // Replace placeholders
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    template = template.replace('{{unitTitle}}', data.unitTitle);
    template = template.replace('{{date}}', currentDate);
    template = template.replace('{{content}}', contentHTML);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`🚀 Launching browser...`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(template, {
      waitUntil: 'networkidle0'
    });

    console.log(`📄 Generating PDF...`);

    // Generate PDF
    const outputPath = path.join(OUTPUT_DIR, `${unitId}.pdf`);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    await browser.close();

    console.log(`✅ Successfully converted to PDF!`);
    console.log(`📄 Output: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`   - Grammar Terms: ${vocab.grammarTerms?.length || 0}`);
    console.log(`   - Difficult Words: ${vocab.difficultWords?.length || 0}`);
    console.log(`   - Key Phrases: ${vocab.keyPhrases?.length || 0}`);
    console.log(`   - Phrasal Verbs: ${vocab.phrasalVerbs?.length || 0}`);
    console.log(`   - Expressions: ${vocab.usefulExpressions?.length || 0}`);

    return outputPath;

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📚 Vocabulary JSON to PDF Converter

Usage: node vocab-to-pdf.js <unit-id>

Examples:
  node vocab-to-pdf.js unit-9-possibilities
  node vocab-to-pdf.js unit-3-carnival

Available units:
  - unit-3-carnival
  - unit-4-world-around-us
  - unit-5-environment
  - unit-6-day-trip
  - unit-7-first-aid
  - unit-8-our-favourite-food
  - unit-9-possibilities
  - unit-11-making-a-film
  - unit-12-famous-inventions

Note: Requires Puppeteer. Install with: npm install puppeteer
    `);
    process.exit(0);
  }

  const unitId = args[0];
  convertToPDF(unitId);
}

// Export for use in other scripts
module.exports = { convertToPDF };
