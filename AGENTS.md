# Agent Instructions for Creating New Unit Pages

This file contains instructions for AI agents to convert exercise markdown files into complete, playable game units.

## Agent Task: Create New Unit Page

When asked to create a new unit page (e.g., "create Unit 4 page" or "convert Unit 6 to game"), follow these steps:

---

## Step 1: Read Source Material

1. **Read the exercise markdown file** from `./exercises/` folder
   - Example: `./exercises/Unit_4_The_world_around_us.md`
   - Example: `./exercises/Unit_6_Day_trip.md`
   - Example: `./exercises/Unit_11_Making_a_film.md`

2. **Identify the following:**
   - Unit number and title
   - Grammar topics covered
   - All exercises (typically 10-15 exercises)
   - Answer key section at the bottom
   - Exercise patterns/types used

---

## Step 2: Map Exercises to Types

Map each exercise to one of the 10 available exercise types:

| Exercise Pattern | Type to Use | Example |
|------------------|-------------|---------|
| Complete table (adj/comparative/superlative) | `fill-blank-table` | Exercise 1 in Unit 3 |
| Build sentence from prompts (A / B / C) | `sentence-build` | "Mount Everest / high / Mount Fuji" |
| Fill single blank: "X is _____ (word) Y" | `fill-blank` | "A tiger is _____ (dangerous) a lion" |
| Choose from options (A/B/C/D) | `multiple-choice` | Select: easier/easiest/more easy |
| Find and fix the mistake | `error-correct` | "She is more tall" → "She is taller" |
| Multiple blanks in one sentence | `fill-blank-mixed` | "Sarah is ___ (tall) but Maria is ___" |
| Translate Vietnamese → English | `translation` | "Chiếc áo này quá nhỏ" |
| Rewrite sentence with structure | `sentence-rewrite` | Rewrite using "too" |
| Complete dialogue | `dialogue-complete` | Fill conversation blanks |
| Free writing (5+ sentences) | `open-ended` | "Write about your weekend" |

---

## Step 3: Create JSON Data File

**File location:** `./data/unit-X-name.json`

**Naming convention:**
- Unit 4: `unit-4-world-around-us.json`
- Unit 6: `unit-6-day-trip.json`
- Unit 11: `unit-11-making-a-film.json`

**Template:**
```json
{
  "unitId": "unit-X-name",
  "title": "Unit X: Title from markdown",
  "subtitle": "Brief description of grammar topics",
  "grammarTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "theory": {
    "sections": [
      {
        "title": "Grammar Point 1",
        "content": "Brief explanation from markdown theory section",
        "examples": ["example 1", "example 2"]
      }
    ]
  },
  "exercises": [
    // Convert each exercise from markdown to JSON
    // Use answer key from bottom of markdown file
    // Include acceptedAnswers array for variations
  ]
}
```

**Important Rules:**
- Extract theory from "PHẦN LÝ THUYẾT" section in markdown
- Get correct answers from "ĐÁP ÁN THAM KHẢO" section
- Include multiple accepted answers when possible (contractions, punctuation variations)
- Set appropriate points (5 for table cells, 10 for most questions, 15 for complex mixed)
- Extract hints from theory section or create helpful ones

---

## Step 4: Create HTML Game Page

**File location:** `./pages/unit-X-name.html`

**Template (copy from unit-3-carnival.html):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unit X: Title | English Grammar Games</title>
  <link rel="stylesheet" href="../css/shared.css">
</head>
<body>
  <header class="game-header">
    <div class="container">
      <div class="game-header__container">
        <div>
          <h1 class="game-header__title">Unit X: Title</h1>
          <p style="color: var(--text-light); margin: 0;">Grammar Topics</p>
        </div>
        <div class="game-header__stats">
          <div class="stat">
            <span class="stat__label">Score</span>
            <span class="stat__value stat__value--primary" id="current-score">0</span>
          </div>
          <div class="stat">
            <span class="stat__label">Progress</span>
            <span class="stat__value" id="progress-count">0 / 0</span>
          </div>
          <div class="stat" id="combo-display" style="display: none;">
            <span class="stat__label">Combo</span>
            <span class="stat__value" id="combo-count">0</span>
          </div>
        </div>
      </div>
      <div class="progress">
        <div class="progress__bar" id="progress-bar" style="width: 0%;"></div>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- Theory Panel - populate from JSON theory sections -->
    <div class="theory-panel" id="theory-panel">
      <button class="theory-panel__toggle" id="theory-toggle">
        <span>📖 Grammar Reference</span>
        <span class="theory-panel__icon" id="theory-icon">▼</span>
      </button>
      <div class="theory-panel__content" id="theory-content">
        <!-- Add theory sections here based on unit grammar topics -->
      </div>
    </div>

    <div id="exercise-container">
      <div class="card text-center">
        <h2>Loading...</h2>
        <p>Please wait while we load the exercises.</p>
      </div>
    </div>
  </main>

  <!-- Core JS -->
  <script src="../js/core/utils.js"></script>
  <script src="../js/core/storage.js"></script>
  <script src="../js/core/game-engine.js"></script>

  <!-- Exercise Types - ONLY load types used in this unit -->
  <!-- Example: If unit uses fill-blank, multiple-choice, sentence-build -->
  <script src="../js/exercises/fill-blank.js"></script>
  <script src="../js/exercises/multiple-choice.js"></script>
  <script src="../js/exercises/sentence-build.js"></script>
  <!-- Add other types as needed -->

  <script>
    const UNIT_ID = 'unit-X-name'; // Match JSON unitId
    const DATA_PATH = '../data/unit-X-name.json'; // Match JSON filename

    // Theory panel toggle (copy from unit-3)
    const theoryToggle = document.getElementById('theory-toggle');
    const theoryContent = document.getElementById('theory-content');
    const theoryIcon = document.getElementById('theory-icon');

    theoryToggle.addEventListener('click', () => {
      const isExpanded = theoryContent.classList.contains('theory-panel__content--expanded');
      if (isExpanded) {
        theoryContent.classList.remove('theory-panel__content--expanded');
        theoryIcon.classList.remove('theory-panel__icon--rotated');
      } else {
        theoryContent.classList.add('theory-panel__content--expanded');
        theoryIcon.classList.add('theory-panel__icon--rotated');
      }
    });

    // Combo display
    function updateComboDisplay() {
      const comboDisplay = document.getElementById('combo-display');
      const comboCount = document.getElementById('combo-count');
      const state = GameEngine.getState();
      if (state.comboCount >= 3) {
        comboDisplay.style.display = 'flex';
        comboCount.textContent = state.comboCount + 'x 🔥';
      } else {
        comboDisplay.style.display = 'none';
      }
    }

    const originalUpdateUI = GameEngine.updateUI.bind(GameEngine);
    GameEngine.updateUI = function() {
      originalUpdateUI();
      updateComboDisplay();
    };

    // Load and start game
    async function loadAndStartGame() {
      try {
        const response = await fetch(DATA_PATH);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`);
        }
        const unitData = await response.json();
        console.log('Unit data loaded:', unitData);
        GameEngine.init(unitData, UNIT_ID);
      } catch (error) {
        console.error('Error loading game data:', error);
        const container = document.getElementById('exercise-container');
        container.innerHTML = `
          <div class="card">
            <h2 style="color: var(--danger);">Error Loading Game</h2>
            <p>Sorry, we couldn't load the exercise data.</p>
            <p style="font-size: var(--font-size-sm); color: var(--text-light);">Error: ${error.message}</p>
            <button class="btn btn--primary mt-2" onclick="location.reload()">Reload Page</button>
          </div>
        `;
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadAndStartGame);
    } else {
      loadAndStartGame();
    }
  </script>
</body>
</html>
```

**Customize for the unit:**
1. Update `<title>` with unit name
2. Update `<h1>` with unit name
3. Update subtitle with grammar topics
4. Populate theory panel content from JSON
5. Load only exercise type JS files used in the unit
6. Set correct `UNIT_ID` and `DATA_PATH`

---

## Step 5: Update Homepage (index.html)

Add the new unit to the `UNITS` array:

```javascript
const UNITS = [
  {
    id: 'unit-3-carnival',
    title: 'Unit 3: Carnival',
    description: 'Comparative and superlative adjectives, too and enough',
    topics: ['Comparatives', 'Superlatives', 'Too & Enough'],
    path: 'pages/unit-3-carnival.html',
    available: true
  },
  // ADD NEW UNIT HERE:
  {
    id: 'unit-X-name',
    title: 'Unit X: Title',
    description: 'Brief description of what students will learn',
    topics: ['Topic 1', 'Topic 2', 'Topic 3'],
    path: 'pages/unit-X-name.html',
    available: true
  }
];
```

---

## Step 6: Quality Checklist

Before marking complete, verify:

**JSON Data:**
- [ ] All exercises have correct answers from answer key
- [ ] Accepted answers include common variations (contractions, punctuation)
- [ ] Points are set appropriately
- [ ] Hints are helpful and don't give away the answer
- [ ] Theory sections are clear and concise

**HTML Page:**
- [ ] Title and headings match unit name
- [ ] Theory panel has correct grammar content
- [ ] Only necessary exercise type JS files are loaded
- [ ] UNIT_ID matches JSON unitId exactly
- [ ] DATA_PATH points to correct JSON file

**Testing:**
- [ ] Page loads without console errors
- [ ] All exercises render correctly
- [ ] Scoring works
- [ ] Progress saves to LocalStorage
- [ ] Completion screen appears at end

---

## Example: Converting Unit 4

**Source:** `./exercises/Unit_4_The_world_around_us.md`

**Output files:**
1. `./data/unit-4-world-around-us.json`
2. `./pages/unit-4-world-around-us.html`
3. Update `./index.html` UNITS array

**Grammar topics identified:**
- Past Continuous
- Past Simple
- Used to

**Exercise types needed:**
- `fill-blank` (most exercises)
- `sentence-build` (combine sentences)
- `multiple-choice` (choose correct form)
- `dialogue-complete` (Exercise 11 - story)
- `translation` (Exercise 13)
- `open-ended` (Exercise 14, 15)

**Special considerations:**
- Unit 4 uses "when" to combine past continuous + past simple
- Need to accept both contracted and full forms ("I was" vs "I'm")
- Story completion exercise should use dialogue-complete type

---

## Exercise Type Selection Guide

**When in doubt:**

- **Fill-in with word hint** → `fill-blank`
- **Fill-in multiple blanks** → `fill-blank-mixed`
- **Choose A/B/C/D** → `multiple-choice`
- **Table with cells to fill** → `fill-blank-table`
- **Build from "A / B / C" prompt** → `sentence-build`
- **Fix the mistake** → `error-correct`
- **Complete conversation** → `dialogue-complete`
- **Vietnamese text provided** → `translation`
- **Rewrite using X grammar** → `sentence-rewrite`
- **Write 5+ sentences** → `open-ended`

---

## Conversion Workflow Summary

```
1. Read ./exercises/Unit_X_Name.md
2. Extract: title, topics, theory, exercises, answer key
3. Create ./data/unit-X-name.json (convert exercises to JSON)
4. Create ./pages/unit-X-name.html (copy template, customize)
5. Update ./index.html (add to UNITS array)
6. Test locally
7. Verify checklist
8. Done!
```

---

## Notes

- Always use lowercase-kebab-case for IDs: `unit-4-world-around-us`
- Include Vietnamese theory if present in markdown
- Grammar explanations should be brief (200 words max)
- Focus on practical examples over complex rules
- Test with Python server: `python -m http.server 8000`

---

## AI Agent Prompt Template

When creating a unit, use this prompt:

> "Create a complete unit page for Unit X from the exercises markdown file. Follow the instructions in AGENTS.md:
> 1. Read ./exercises/Unit_X_Name.md
> 2. Create ./data/unit-X-name.json with all exercises
> 3. Create ./pages/unit-X-name.html game page
> 4. Update ./index.html UNITS array
> 5. Verify all files are correct"

---

**Remember:** Follow CLAUDE.md coding standards throughout!
