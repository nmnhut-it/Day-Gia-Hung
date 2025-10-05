# English Grammar Games 🎮

Interactive web-based games for English grammar practice. Built with vanilla HTML, CSS, and JavaScript - no frameworks required!

## 🎯 Features

- **10 Exercise Types**: Fill-blank, multiple-choice, table completion, sentence building, error correction, translation, and more
- **Scoring System**: Points, combo multipliers, time bonuses
- **Progress Tracking**: LocalStorage saves scores, stars, and attempts
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modular Architecture**: One JS file per exercise type

## 📁 Project Structure

```
/
├── index.html                      # Homepage with unit selector
├── CLAUDE.md                       # Development rules and specifications
├── README.md                       # This file
├── css/
│   └── shared.css                  # Global styles
├── js/
│   ├── core/
│   │   ├── game-engine.js          # Core orchestrator
│   │   ├── storage.js              # LocalStorage wrapper
│   │   └── utils.js                # Helper functions
│   └── exercises/
│       ├── fill-blank.js           # Standard fill-in exercise
│       ├── multiple-choice.js      # Choose correct answer
│       ├── fill-blank-table.js     # Table completion
│       ├── sentence-build.js       # Build sentences from prompts
│       ├── fill-blank-mixed.js     # Multiple blanks per sentence
│       ├── error-correct.js        # Find and fix mistakes
│       ├── translation.js          # Vietnamese → English
│       ├── sentence-rewrite.js     # Transform sentences
│       ├── dialogue-complete.js    # Fill dialogue blanks
│       └── open-ended.js           # Free writing
├── data/
│   └── unit-3-carnival.json        # Unit 3 questions and answers
└── pages/
    └── unit-3-carnival.html        # Unit 3 game page
```

## 🚀 How to Test Locally

### Option 1: Using Python
```bash
cd d:\Gitlab\Day-Gia-Hung
python -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: Using Node.js (http-server)
```bash
cd d:\Gitlab\Day-Gia-Hung
npx http-server -p 8000
```
Then open: http://localhost:8000

### Option 3: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎮 How to Play

1. Open the homepage ([index.html](index.html))
2. Click on "Unit 3: Carnival" card
3. Complete the exercises:
   - Read the grammar reference (collapsible panel)
   - Answer each question
   - Get instant feedback
   - Earn points and build combos!
4. View your score and stars at the end

## 📊 Scoring System

- **Base Points**: 10 points per question
- **Time Bonus**: +5 points if answered in <5 seconds
- **Combo Multiplier**: 1.5x points for 3+ consecutive correct answers
- **Hint Penalty**: -2 points per hint used

### Star Ratings
- ⭐ 1 Star: 50-69% correct
- ⭐⭐ 2 Stars: 70-89% correct
- ⭐⭐⭐ 3 Stars: 90-100% correct

## 🔧 Adding New Units

### Step 1: Create JSON Data File
Create `data/unit-X-name.json`:
```json
{
  "unitId": "unit-X-name",
  "title": "Unit X: Name",
  "exercises": [
    {
      "type": "fill-blank",
      "id": "ex1-q1",
      "question": "This is a _____ question.",
      "answer": "sample",
      "points": 10
    }
  ]
}
```

### Step 2: Create HTML Page
Create `pages/unit-X-name.html`:
- Copy from `unit-3-carnival.html`
- Update UNIT_ID and DATA_PATH
- Load only needed exercise type JS files

### Step 3: Add to Homepage
Edit `index.html`, add to UNITS array:
```javascript
{
  id: 'unit-X-name',
  title: 'Unit X: Name',
  description: 'Description here',
  path: 'pages/unit-X-name.html',
  available: true
}
```

## 📝 Exercise Types Reference

See [CLAUDE.md](CLAUDE.md) for complete JSON schemas and specifications for all 10 exercise types.

**Quick Reference:**
1. `fill-blank` - Single blank per question
2. `multiple-choice` - Select from options
3. `fill-blank-table` - Complete table cells
4. `sentence-build` - Build from prompts
5. `fill-blank-mixed` - Multiple blanks per sentence
6. `error-correct` - Find and fix mistakes
7. `translation` - Vietnamese → English
8. `sentence-rewrite` - Transform sentences
9. `dialogue-complete` - Fill dialogue blanks
10. `open-ended` - Free writing (not scored)

## 🌐 Deploying to GitHub Pages

### Step 1: Update .gitignore
```
node_modules/
.DS_Store
```

### Step 2: Commit and Push
```bash
git add .
git commit -m "Add English Grammar Games platform"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" section
3. Source: Deploy from main branch
4. Folder: / (root)
5. Save

Your site will be available at:
`https://[username].github.io/Day-Gia-Hung/`

## 🎨 Customization

### Colors
Edit `css/shared.css`:
```css
:root {
  --primary: #4CAF50;      /* Success green */
  --danger: #f44336;       /* Error red */
  --warning: #ff9800;      /* Warning orange */
  --info: #2196F3;         /* Info blue */
}
```

### Scoring Rules
Edit constants in `js/core/game-engine.js`:
```javascript
POINTS_PER_QUESTION: 10,
COMBO_MULTIPLIER: 1.5,
TIME_BONUS_THRESHOLD: 5000,
```

## 🧪 Testing Checklist

- [ ] Homepage loads with correct statistics
- [ ] Unit 3 page loads without errors
- [ ] Theory panel expands/collapses
- [ ] All 15+ exercises render correctly
- [ ] Scoring works (check browser console)
- [ ] Progress saves to LocalStorage
- [ ] Mobile responsive (test on phone)
- [ ] Completion screen shows at end
- [ ] Can replay unit
- [ ] "Clear Progress" button works

## 📚 Current Content

**Unit 3: Carnival** ✅ Complete
- 15+ exercises
- Topics: Comparatives, Superlatives, Too & Enough
- Exercise types: 8 different types used

**More units**: Coming soon! (Unit 4, Unit 6, Unit 11, etc.)

## 🐛 Troubleshooting

**Exercise not rendering?**
- Check browser console for errors
- Verify JSON file is valid (use JSONLint)
- Ensure exercise type JS file is loaded in HTML

**LocalStorage not working?**
- Check browser privacy settings
- Try incognito/private mode
- Clear browser cache

**Styles not applying?**
- Check CSS file path is correct
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

## 📄 License

Educational project for English grammar practice.

## 🤝 Contributing

To add more units:
1. Convert markdown exercise files to JSON
2. Create HTML game pages
3. Test thoroughly
4. Update homepage unit list

---

**Built with ❤️ for students learning English grammar**
