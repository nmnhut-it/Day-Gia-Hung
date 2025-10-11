#!/usr/bin/env node

/**
 * Vocabulary JSON to Markdown Converter
 * Converts vocabulary JSON files to beautifully formatted Markdown
 *
 * Usage: node scripts/vocab-to-markdown.js <unit-id>
 * Example: node scripts/vocab-to-markdown.js unit-9-possibilities
 */

const fs = require('fs');
const path = require('path');

// Constants
const DATA_DIR = path.join(__dirname, '..', 'data', 'vocabulary');
const OUTPUT_DIR = path.join(__dirname, '..', 'exports', 'markdown');

// Difficulty level emojis
const DIFFICULTY_BADGES = {
  basic: '🟢 Basic',
  intermediate: '🟡 Intermediate',
  advanced: '🔴 Advanced'
};

/**
 * Main conversion function
 */
function convertToMarkdown(unitId) {
  try {
    // Read JSON file
    const jsonPath = path.join(DATA_DIR, `${unitId}.json`);

    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Error: File not found: ${jsonPath}`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const vocab = data.vocabularyData;

    // Generate markdown
    let markdown = '';

    // Header
    markdown += `# ${data.unitTitle}\n\n`;
    markdown += `> Generated from: \`${unitId}.json\`\n`;
    markdown += `> Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    markdown += `---\n\n`;

    // Table of Contents
    markdown += `## 📚 Table of Contents\n\n`;
    if (vocab.grammarTerms && vocab.grammarTerms.length > 0) {
      markdown += `- [📖 Grammar Terms](#-grammar-terms)\n`;
    }
    if (vocab.difficultWords && vocab.difficultWords.length > 0) {
      markdown += `- [💡 Difficult Words](#-difficult-words)\n`;
    }
    if (vocab.keyPhrases && vocab.keyPhrases.length > 0) {
      markdown += `- [🔑 Key Grammar Phrases](#-key-grammar-phrases)\n`;
    }
    if (vocab.phrasalVerbs && vocab.phrasalVerbs.length > 0) {
      markdown += `- [🚀 Phrasal Verbs](#-phrasal-verbs)\n`;
    }
    if (vocab.usefulExpressions && vocab.usefulExpressions.length > 0) {
      markdown += `- [💬 Useful Expressions](#-useful-expressions)\n`;
    }
    markdown += `\n---\n\n`;

    // Grammar Terms
    if (vocab.grammarTerms && vocab.grammarTerms.length > 0) {
      markdown += `## 📖 Grammar Terms\n\n`;
      markdown += `| Word | Pronunciation | Vietnamese | Definition | Example | Level |\n`;
      markdown += `|------|---------------|------------|------------|---------|-------|\n`;

      vocab.grammarTerms.forEach(term => {
        const level = DIFFICULTY_BADGES[term.difficulty] || term.difficulty;
        markdown += `| **${term.word}** | ${term.pronunciation || 'N/A'} | ${term.vietnamese} | ${term.definition} | *${term.example}* | ${level} |\n`;
      });

      markdown += `\n`;
    }

    // Difficult Words
    if (vocab.difficultWords && vocab.difficultWords.length > 0) {
      markdown += `## 💡 Difficult Words\n\n`;
      markdown += `| Word | Pronunciation | Vietnamese | Definition | Example | Level |\n`;
      markdown += `|------|---------------|------------|------------|---------|-------|\n`;

      vocab.difficultWords.forEach(word => {
        const level = DIFFICULTY_BADGES[word.difficulty] || word.difficulty;
        markdown += `| **${word.word}** | ${word.pronunciation || 'N/A'} | ${word.vietnamese} | ${word.definition} | *${word.example}* | ${level} |\n`;
      });

      markdown += `\n`;
    }

    // Key Phrases
    if (vocab.keyPhrases && vocab.keyPhrases.length > 0) {
      markdown += `## 🔑 Key Grammar Phrases\n\n`;

      vocab.keyPhrases.forEach((phrase, index) => {
        markdown += `### ${index + 1}. ${phrase.phrase || phrase.expression}\n\n`;
        markdown += `- **Vietnamese:** ${phrase.vietnamese}\n`;
        if (phrase.structure) {
          markdown += `- **Structure:** \`${phrase.structure}\`\n`;
        }
        markdown += `- **Definition:** ${phrase.definition}\n`;
        markdown += `- **Example:** *${phrase.example}*\n`;
        if (phrase.usage) {
          markdown += `- **Usage Note:** ${phrase.usage}\n`;
        }
        markdown += `\n`;
      });
    }

    // Phrasal Verbs
    if (vocab.phrasalVerbs && vocab.phrasalVerbs.length > 0) {
      markdown += `## 🚀 Phrasal Verbs\n\n`;
      markdown += `| Phrasal Verb | Vietnamese | Definition | Example | Synonyms |\n`;
      markdown += `|--------------|------------|------------|---------|----------|\n`;

      vocab.phrasalVerbs.forEach(verb => {
        const synonyms = verb.synonyms ? verb.synonyms.join(', ') : 'N/A';
        markdown += `| **${verb.verb}** | ${verb.vietnamese} | ${verb.definition} | *${verb.example}* | ${synonyms} |\n`;
      });

      markdown += `\n`;
    }

    // Useful Expressions
    if (vocab.usefulExpressions && vocab.usefulExpressions.length > 0) {
      markdown += `## 💬 Useful Expressions\n\n`;

      vocab.usefulExpressions.forEach((expr, index) => {
        markdown += `${index + 1}. **${expr.expression}**\n`;
        markdown += `   - Vietnamese: ${expr.vietnamese}\n`;
        markdown += `   - Example: *${expr.example}*\n`;
        if (expr.type) {
          markdown += `   - Type: ${expr.type}\n`;
        }
        markdown += `\n`;
      });
    }

    // Footer
    markdown += `---\n\n`;
    markdown += `📚 **Study Tips:**\n`;
    markdown += `- Review vocabulary before each unit\n`;
    markdown += `- Practice pronunciation using the IPA symbols\n`;
    markdown += `- Create flashcards for difficult words\n`;
    markdown += `- Use the examples to understand context\n\n`;
    markdown += `---\n\n`;
    markdown += `*Generated by English Grammar Games - Vocabulary Converter*\n`;

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write markdown file
    const outputPath = path.join(OUTPUT_DIR, `${unitId}.md`);
    fs.writeFileSync(outputPath, markdown, 'utf8');

    console.log(`✅ Successfully converted to Markdown!`);
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
📚 Vocabulary JSON to Markdown Converter

Usage: node vocab-to-markdown.js <unit-id>

Examples:
  node vocab-to-markdown.js unit-9-possibilities
  node vocab-to-markdown.js unit-3-carnival

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
    `);
    process.exit(0);
  }

  const unitId = args[0];
  convertToMarkdown(unitId);
}

// Export for use in other scripts
module.exports = { convertToMarkdown };
