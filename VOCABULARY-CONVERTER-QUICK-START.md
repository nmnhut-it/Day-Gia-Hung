# 🚀 Vocabulary Converter - Quick Start Guide

Convert vocabulary JSON files to Markdown and PDF in 3 easy steps!

---

## ⚡ 3-Step Quick Start

### Step 1: Install Dependencies
```bash
cd Day-Gia-Hung
npm install
```
*This installs Puppeteer for PDF generation (~150MB, one-time download)*

### Step 2: Choose Your Command

**Convert all units to both Markdown + PDF:**
```bash
npm run vocab:convert-all
```

**Convert one unit to Markdown:**
```bash
node scripts/vocab-to-markdown.js unit-9-possibilities
```

**Convert one unit to PDF:**
```bash
node scripts/vocab-to-pdf.js unit-9-possibilities
```

### Step 3: Find Your Files
- **Markdown:** `exports/markdown/<unit-id>.md`
- **PDF:** `exports/pdf/<unit-id>.pdf`

---

## 📚 Common Commands

| What I Want | Command |
|-------------|---------|
| Convert all units (MD + PDF) | `npm run vocab:convert-all` |
| Convert all units (MD only) | `npm run vocab:convert-all-md` |
| Convert all units (PDF only) | `npm run vocab:convert-all-pdf` |
| Convert one unit to MD | `node scripts/vocab-to-markdown.js unit-9-possibilities` |
| Convert one unit to PDF | `node scripts/vocab-to-pdf.js unit-9-possibilities` |
| Convert specific units only | `node scripts/convert-all.js --units=3,9,12` |
| See available units | `node scripts/convert-all.js --help` |

---

## 🎯 Available Unit IDs

Copy-paste these unit IDs:

```
unit-3-carnival
unit-4-world-around-us
unit-5-environment
unit-6-day-trip
unit-7-first-aid
unit-8-our-favourite-food
unit-9-possibilities
unit-11-making-a-film
unit-12-famous-inventions
```

---

## 📖 Example Workflow

**Scenario:** You want to print vocabulary for units 3, 4, and 5

```bash
# Step 1: Navigate to project
cd Day-Gia-Hung

# Step 2: Convert to PDF
node scripts/convert-all.js --format=pdf --units=3,4,5

# Step 3: Open PDFs
# Go to: exports/pdf/
# Print: unit-3-carnival.pdf, unit-4-world-around-us.pdf, unit-5-environment.pdf
```

**Result:** 3 beautiful PDF files ready to print! 🎉

---

## 💡 What You Get

### Markdown Output (.md)
- ✅ Tables with all vocabulary
- ✅ Difficulty levels marked
- ✅ Examples and definitions
- ✅ Ready for GitHub
- ✅ Searchable text

### PDF Output (.pdf)
- ✅ Professional A4 layout
- ✅ Color-coded sections
- ✅ Print-optimized
- ✅ Study tips included
- ✅ Ready to share

---

## 🆘 Troubleshooting

### "Puppeteer is not installed"
```bash
npm install
```

### "File not found"
Check your unit ID spelling! Use `--help` to see available units.

### Need Help?
Full documentation: `scripts/README.md`

---

## 🎓 For Teachers

**Before each unit:**
1. Convert vocabulary to PDF: `node scripts/vocab-to-pdf.js unit-X-name`
2. Upload to Google Drive or email to students
3. Students print and study before class

**For homework:**
1. Convert all units: `npm run vocab:convert-all-pdf`
2. Print copies for students
3. Use as reference material during exercises

---

## 📱 For Students

**Study offline:**
1. Download all PDFs: `npm run vocab:convert-all-pdf`
2. Transfer to phone/tablet
3. Study anywhere without internet

**Make flashcards:**
1. Use Markdown files: `npm run vocab:convert-all-md`
2. Copy vocabulary to flashcard app
3. Practice pronunciation and definitions

---

That's it! You're ready to convert vocabulary files! 🎉

For more details, see: `scripts/README.md`
