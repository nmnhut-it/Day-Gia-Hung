#!/usr/bin/env node

/**
 * Batch Vocabulary Converter
 * Converts all vocabulary JSON files to Markdown and/or PDF
 *
 * Usage: node scripts/convert-all.js [options]
 * Options:
 *   --format=md       Convert to Markdown only
 *   --format=pdf      Convert to PDF only
 *   --format=both     Convert to both formats (default)
 *   --units=3,4,5     Convert specific units only
 */

const fs = require('fs');
const path = require('path');
const { convertToMarkdown } = require('./vocab-to-markdown');
const { convertToPDF } = require('./vocab-to-pdf');

// Constants
const DATA_DIR = path.join(__dirname, '..', 'data', 'vocabulary');

// All available units
const ALL_UNITS = [
  'unit-3-carnival',
  'unit-4-world-around-us',
  'unit-5-environment',
  'unit-6-day-trip',
  'unit-7-first-aid',
  'unit-8-our-favourite-food',
  'unit-9-possibilities',
  'unit-11-making-a-film',
  'unit-12-famous-inventions'
];

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    format: 'both', // default: convert to both formats
    units: ALL_UNITS // default: convert all units
  };

  args.forEach(arg => {
    if (arg.startsWith('--format=')) {
      const format = arg.split('=')[1];
      if (['md', 'pdf', 'both'].includes(format)) {
        options.format = format;
      } else {
        console.error(`❌ Invalid format: ${format}. Use: md, pdf, or both`);
        process.exit(1);
      }
    } else if (arg.startsWith('--units=')) {
      const unitsStr = arg.split('=')[1];
      const unitNumbers = unitsStr.split(',').map(n => n.trim());
      options.units = unitNumbers.map(n => {
        const unit = ALL_UNITS.find(u => u.includes(`unit-${n}-`));
        if (!unit) {
          console.error(`❌ Invalid unit number: ${n}`);
          process.exit(1);
        }
        return unit;
      });
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }
  });

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
📚 Batch Vocabulary Converter

Convert all vocabulary JSON files to Markdown and/or PDF formats.

Usage:
  node convert-all.js [options]

Options:
  --format=md        Convert to Markdown only
  --format=pdf       Convert to PDF only
  --format=both      Convert to both formats (default)
  --units=3,4,5      Convert specific units only (comma-separated)
  --help, -h         Show this help message

Examples:
  node convert-all.js
  # Converts all units to both Markdown and PDF

  node convert-all.js --format=md
  # Converts all units to Markdown only

  node convert-all.js --format=pdf --units=3,9,12
  # Converts units 3, 9, and 12 to PDF only

Available Units:
  3  - Carnival (Comparatives & Superlatives)
  4  - The World Around Us (Past Continuous & Used To)
  5  - The Environment (Will/Won't)
  6  - Day Trip (Be Going To)
  7  - First Aid (Reported Speech)
  8  - Our Favourite Food (First Conditional)
  9  - Possibilities (Modals & Have To)
  11 - Making a Film (Passive Voice Present)
  12 - Famous Inventions (Passive Voice Past)
  `);
}

/**
 * Convert all units
 */
async function convertAll() {
  const options = parseArgs();

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║        📚 Batch Vocabulary Converter                      ║
╚═══════════════════════════════════════════════════════════╝
`);

  console.log(`⚙️  Configuration:`);
  console.log(`   Format: ${options.format === 'both' ? 'Markdown + PDF' : options.format.toUpperCase()}`);
  console.log(`   Units: ${options.units.length} unit(s)`);
  console.log(``);

  const results = {
    markdown: { success: 0, failed: 0 },
    pdf: { success: 0, failed: 0 }
  };

  const startTime = Date.now();

  for (let i = 0; i < options.units.length; i++) {
    const unitId = options.units[i];
    const unitNumber = i + 1;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[${unitNumber}/${options.units.length}] Processing: ${unitId}`);
    console.log(`${'='.repeat(60)}\n`);

    // Convert to Markdown
    if (options.format === 'md' || options.format === 'both') {
      try {
        console.log(`📝 Converting to Markdown...`);
        await convertToMarkdown(unitId);
        results.markdown.success++;
        console.log(``);
      } catch (error) {
        console.error(`❌ Markdown conversion failed: ${error.message}\n`);
        results.markdown.failed++;
      }
    }

    // Convert to PDF
    if (options.format === 'pdf' || options.format === 'both') {
      try {
        console.log(`📄 Converting to PDF...`);
        await convertToPDF(unitId);
        results.pdf.success++;
        console.log(``);
      } catch (error) {
        console.error(`❌ PDF conversion failed: ${error.message}\n`);
        results.pdf.failed++;
      }
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Conversion Complete!`);
  console.log(`${'='.repeat(60)}\n`);

  if (options.format === 'md' || options.format === 'both') {
    console.log(`📝 Markdown:`);
    console.log(`   ✅ Success: ${results.markdown.success}`);
    if (results.markdown.failed > 0) {
      console.log(`   ❌ Failed: ${results.markdown.failed}`);
    }
    console.log(`   📁 Output: exports/markdown/\n`);
  }

  if (options.format === 'pdf' || options.format === 'both') {
    console.log(`📄 PDF:`);
    console.log(`   ✅ Success: ${results.pdf.success}`);
    if (results.pdf.failed > 0) {
      console.log(`   ❌ Failed: ${results.pdf.failed}`);
    }
    console.log(`   📁 Output: exports/pdf/\n`);
  }

  console.log(`⏱️  Total Time: ${duration}s\n`);

  // Exit with error code if any conversions failed
  const totalFailed = results.markdown.failed + results.pdf.failed;
  if (totalFailed > 0) {
    console.error(`⚠️  ${totalFailed} conversion(s) failed. Check errors above.\n`);
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
if (require.main === module) {
  convertAll().catch(error => {
    console.error(`\n❌ Fatal Error: ${error.message}\n`);
    process.exit(1);
  });
}

module.exports = { convertAll };
