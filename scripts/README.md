# Vocabulary Converter Scripts

Convert vocabulary JSON files to **Markdown** and **PDF** formats for easy distribution and printing.

## 📋 Prerequisites

### Install Node.js
Download and install Node.js (v14 or higher) from [nodejs.org](https://nodejs.org/)

### Install Dependencies
```bash
cd Day-Gia-Hung
npm install
```

This will install:
- **Puppeteer** (v21.6.1) - For PDF generation using headless Chrome

---

## 🚀 Quick Start

### Convert Single Unit to Markdown
```bash
node scripts/vocab-to-markdown.js unit-9-possibilities
```

### Convert Single Unit to PDF
```bash
node scripts/vocab-to-pdf.js unit-9-possibilities
```

### Convert All Units (Both Formats)
```bash
node scripts/convert-all.js
```

---

## 📖 Detailed Usage

### 1. `vocab-to-markdown.js` - JSON to Markdown

**Convert a single unit:**
```bash
node scripts/vocab-to-markdown.js <unit-id>
```

**Examples:**
```bash
node scripts/vocab-to-markdown.js unit-3-carnival
node scripts/vocab-to-markdown.js unit-9-possibilities
```

**Output:**
- Location: `exports/markdown/<unit-id>.md`
- Format: GitHub-flavored Markdown with tables
- Features:
  - Table of Contents
  - Color-coded difficulty levels (🟢 Basic, 🟡 Intermediate, 🔴 Advanced)
  - Organized sections (Grammar Terms, Difficult Words, Key Phrases, etc.)
  - Study tips at the end

**Using npm scripts:**
```bash
npm run vocab:md unit-9-possibilities
```

---

### 2. `vocab-to-pdf.js` - JSON to PDF

**Convert a single unit:**
```bash
node scripts/vocab-to-pdf.js <unit-id>
```

**Examples:**
```bash
node scripts/vocab-to-pdf.js unit-3-carnival
node scripts/vocab-to-pdf.js unit-9-possibilities
```

**Output:**
- Location: `exports/pdf/<unit-id>.pdf`
- Format: Professional A4 PDF
- Features:
  - Beautiful typography with color-coded sections
  - Difficulty badges with colors
  - Print-optimized layout (proper page breaks)
  - Study tips included
  - Professional header and footer

**Using npm scripts:**
```bash
npm run vocab:pdf unit-9-possibilities
```

**Requirements:**
- Puppeteer must be installed (`npm install`)
- First run may take longer as Puppeteer downloads Chrome

---

### 3. `convert-all.js` - Batch Converter

**Convert all units to both formats:**
```bash
node scripts/convert-all.js
```

**Convert all units to Markdown only:**
```bash
node scripts/convert-all.js --format=md
```

**Convert all units to PDF only:**
```bash
node scripts/convert-all.js --format=pdf
```

**Convert specific units only:**
```bash
node scripts/convert-all.js --units=3,9,12
node scripts/convert-all.js --format=pdf --units=3,4,5
```

**Using npm scripts:**
```bash
npm run vocab:convert-all           # Both formats
npm run vocab:convert-all-md        # Markdown only
npm run vocab:convert-all-pdf       # PDF only
```

**Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--format=md` | Convert to Markdown only | `--format=md` |
| `--format=pdf` | Convert to PDF only | `--format=pdf` |
| `--format=both` | Convert to both formats (default) | `--format=both` |
| `--units=X,Y,Z` | Convert specific units only | `--units=3,9,12` |
| `--help`, `-h` | Show help message | `--help` |

---

## 📁 Available Units

| Unit # | Unit ID | Title |
|--------|---------|-------|
| 3 | `unit-3-carnival` | Carnival - Comparatives & Superlatives |
| 4 | `unit-4-world-around-us` | The World Around Us - Past Continuous & Used To |
| 5 | `unit-5-environment` | The Environment - Will/Won't |
| 6 | `unit-6-day-trip` | Day Trip - Be Going To |
| 7 | `unit-7-first-aid` | First Aid - Reported Speech |
| 8 | `unit-8-our-favourite-food` | Our Favourite Food - First Conditional |
| 9 | `unit-9-possibilities` | Possibilities - Modals & Have To |
| 11 | `unit-11-making-a-film` | Making a Film - Passive Voice (Present) |
| 12 | `unit-12-famous-inventions` | Famous Inventions - Passive Voice (Past) |

---

## 📂 Output Structure

After running conversion scripts, you'll have:

```
Day-Gia-Hung/
├── exports/
│   ├── markdown/
│   │   ├── unit-3-carnival.md
│   │   ├── unit-4-world-around-us.md
│   │   ├── unit-5-environment.md
│   │   ├── unit-6-day-trip.md
│   │   ├── unit-7-first-aid.md
│   │   ├── unit-8-our-favourite-food.md
│   │   ├── unit-9-possibilities.md
│   │   ├── unit-11-making-a-film.md
│   │   └── unit-12-famous-inventions.md
│   └── pdf/
│       ├── unit-3-carnival.pdf
│       ├── unit-4-world-around-us.pdf
│       ├── unit-5-environment.pdf
│       ├── unit-6-day-trip.pdf
│       ├── unit-7-first-aid.pdf
│       ├── unit-8-our-favourite-food.pdf
│       ├── unit-9-possibilities.pdf
│       ├── unit-11-making-a-film.pdf
│       └── unit-12-famous-inventions.pdf
```

---

## 🎨 Output Features

### Markdown (.md)
✅ **GitHub-ready** - Displays beautifully on GitHub
✅ **Searchable** - Easy to search with Ctrl+F
✅ **Tables** - Clean table format for vocabulary
✅ **Emojis** - Visual section markers
✅ **Study Tips** - Included at the bottom
✅ **TOC** - Table of Contents with links

### PDF (.pdf)
✅ **Print-optimized** - A4 format with proper margins
✅ **Color-coded** - Sections have different colors
✅ **Badges** - Visual difficulty level badges
✅ **Professional** - Clean typography and layout
✅ **Portable** - Share via email or Google Drive
✅ **Offline** - Students can print and study anywhere

---

## 🔧 Troubleshooting

### Issue: "Puppeteer is not installed"
**Solution:**
```bash
npm install
```

### Issue: "File not found" error
**Solution:** Check that:
1. You're in the project root directory
2. The unit ID is correct (use `--help` to see available units)
3. The JSON file exists in `data/vocabulary/`

### Issue: PDF generation is slow
**Solution:**
- First run downloads Chrome (~150MB), which takes time
- Subsequent runs are much faster
- Consider using `--format=md` if you only need Markdown

### Issue: "ENOENT: no such file or directory"
**Solution:** Create the directories manually:
```bash
mkdir -p exports/markdown
mkdir -p exports/pdf
```

---

## 💡 Use Cases

### For Teachers:
- **📧 Email to students** - Send PDF vocabulary before each unit
- **📄 Print handouts** - Print PDFs for classroom distribution
- **📱 Share on Google Drive** - Upload to class folder
- **📝 Homework assignments** - Include vocabulary reference

### For Students:
- **📖 Study offline** - Print and keep in binder
- **✏️ Make flashcards** - Use Markdown to create digital flashcards
- **🔍 Quick reference** - Keep PDF on phone/tablet
- **📚 Review before tests** - Print and annotate

### For Developers:
- **📘 Documentation** - Markdown files for GitHub
- **🔄 Automation** - Batch convert all units at once
- **🎨 Customization** - Edit templates for your needs
- **🔧 Integration** - Import modules in other scripts

---

## 🛠️ Customization

### Modify Markdown Format
Edit: `scripts/vocab-to-markdown.js`

Change table headers, add sections, modify footer, etc.

### Modify PDF Styling
Edit: `scripts/templates/vocab-pdf-template.html`

Change colors, fonts, layout, add logos, etc.

**Example customizations:**
```css
/* Change primary color from green to blue */
.section-title {
  color: #3B82F6;  /* Change from #10B981 */
  background: #DBEAFE;  /* Change from #D1FAE5 */
}

/* Change font */
body {
  font-family: 'Arial', sans-serif;
}

/* Add school logo */
.pdf-header::before {
  content: url('path/to/logo.png');
}
```

---

## 📊 Performance

**Markdown Conversion:**
- Single unit: ~100ms
- All 9 units: ~1 second

**PDF Conversion:**
- First run: ~10-15 seconds (Chrome download)
- Single unit: ~2-3 seconds
- All 9 units: ~20-30 seconds

---

## 📝 Examples

### Example 1: Convert all units before class
```bash
npm run vocab:convert-all
# Generates 9 Markdown + 9 PDF files
# Upload to Google Drive for students
```

### Example 2: Quick Markdown for GitHub
```bash
npm run vocab:convert-all-md
# Commit .md files to repository
git add exports/markdown/*.md
git commit -m "Add vocabulary reference"
```

### Example 3: Print PDFs for classroom
```bash
npm run vocab:convert-all-pdf
# Open exports/pdf/ folder
# Print all PDFs for distribution
```

### Example 4: Convert only new units
```bash
node scripts/convert-all.js --units=11,12
# Only converts units 11 and 12
```

---

## 🤝 Contributing

To add new conversion features:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-format`
3. Add your conversion script: `scripts/vocab-to-<format>.js`
4. Update this README
5. Submit pull request

---

## 📄 License

MIT License - Feel free to modify and distribute

---

## 🆘 Support

Having issues? Check:
- ✅ Node.js is installed: `node --version`
- ✅ Dependencies installed: `npm install`
- ✅ You're in project root: `pwd` or `cd`
- ✅ JSON files exist: `ls data/vocabulary/`

Still stuck? Open an issue on GitHub with:
- Error message
- Command you ran
- Node.js version (`node --version`)
- Operating system
