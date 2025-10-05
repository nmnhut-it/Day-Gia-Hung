# English Grammar Games - Development Rules

## Project Overview
Interactive web-based games for English grammar practice. Each exercise file becomes one standalone HTML game page. Students play games, earn scores, and track progress.

## Architecture Rules

### File Structure
```
/
├── index.html                                  # Homepage - unit selector grid
├── css/
│   └── shared.css                              # Global styles for all pages
├── js/
│   ├── core/
│   │   ├── game-engine.js                      # Core orchestrator: scoring, timer, state
│   │   ├── storage.js                          # LocalStorage wrapper for scores/progress
│   │   └── utils.js                            # Helper functions (normalize, shuffle, etc.)
│   └── exercises/
│       ├── fill-blank-table.js                 # Exercise type 1: Table completion
│       ├── sentence-build.js                   # Exercise type 2: Build from prompts
│       ├── fill-blank.js                       # Exercise type 3: Standard fill-in
│       ├── multiple-choice.js                  # Exercise type 4: Choose answer
│       ├── error-correct.js                    # Exercise type 5: Find/fix mistakes
│       ├── fill-blank-mixed.js                 # Exercise type 6: Multiple blanks
│       ├── translation.js                      # Exercise type 7: Vietnamese → English
│       ├── sentence-rewrite.js                 # Exercise type 8: Transform sentences
│       ├── dialogue-complete.js                # Exercise type 9: Fill dialogue
│       └── open-ended.js                       # Exercise type 10: Writing (display only)
├── data/
│   ├── unit-3-carnival.json                    # Question bank for Unit 3
│   ├── unit-4-world-around-us.json             # Question bank for Unit 4
│   ├── unit-6-day-trip.json                    # Question bank for Unit 6
│   └── review-1-units-1-3.json                 # Question bank for Review 1
└── pages/
    ├── unit-3-carnival.html                    # Game page for Unit 3
    ├── unit-4-world-around-us.html             # Game page for Unit 4
    ├── unit-6-day-trip.html                    # Game page for Unit 6
    └── review-1-units-1-3.html                 # Game page for Review 1
```

### Architecture Principles
- **One JS file per exercise type** - Modular, maintainable, reusable
- Each `.md` exercise file → one `.html` game page → one `.json` data file
- All pages share: `shared.css`, core JS (`game-engine.js`, `storage.js`, `utils.js`)
- Each HTML page loads only the exercise type JS files it needs

### JSON Data Structure
Each JSON file contains:
```json
{
  "unitId": "unit-3-carnival",
  "title": "Unit 3: Carnival - Comparatives & Superlatives",
  "grammarTopics": ["Comparative Adjectives", "Superlative Adjectives", "Too and Enough"],
  "theory": {
    "brief": "Summary of grammar rules in Vietnamese/English",
    "examples": ["example 1", "example 2"]
  },
  "exercises": [
    {
      "id": 1,
      "type": "fill-blank",
      "question": "This book is _______ (interesting) than that one.",
      "answer": "more interesting",
      "hints": ["Use 'more' with long adjectives"],
      "points": 10
    },
    {
      "id": 2,
      "type": "multiple-choice",
      "question": "She is _______ girl in the class.",
      "options": ["the most beautiful", "more beautiful", "beautifulest", "most beautiful"],
      "answer": "the most beautiful",
      "points": 10
    }
  ]
}
```

### Exercise Types - Complete Reference

Each exercise type has its own JS file in `/js/exercises/`. Below are all 10 types with JSON schemas and examples.

#### Type 1: `fill-blank-table` - Table Completion
Complete tables with multiple cells (e.g., adjective forms table).

**JSON Schema:**
```json
{
  "type": "fill-blank-table",
  "id": "ex1",
  "title": "Complete the table with comparative and superlative forms",
  "instructions": "Fill in the missing forms",
  "headers": ["Adjective", "Comparative", "Superlative"],
  "rows": [
    {
      "rowId": "r1",
      "cells": ["tall", "___", "___"],
      "answers": ["taller", "the tallest"],
      "cellsToFill": [1, 2],
      "points": 5
    },
    {
      "rowId": "r2",
      "cells": ["happy", "___", "___"],
      "answers": ["happier", "the happiest"],
      "cellsToFill": [1, 2],
      "points": 5
    }
  ]
}
```

#### Type 2: `sentence-build` - Build Sentences from Prompts
Build grammatically correct sentences from word prompts.

**JSON Schema:**
```json
{
  "type": "sentence-build",
  "id": "ex2-q1",
  "prompt": "Mount Everest / high / Mount Fuji",
  "instructions": "Write a comparative sentence",
  "answer": "Mount Everest is higher than Mount Fuji.",
  "acceptedAnswers": [
    "Mount Everest is higher than Mount Fuji",
    "Mount Everest is higher than Mount Fuji.",
    "Mount Everest's higher than Mount Fuji"
  ],
  "hints": ["Use comparative form of 'high'", "Don't forget 'than'"],
  "points": 10
}
```

#### Type 3: `fill-blank` - Standard Fill-in-the-Blank
Single blank per question with word hint.

**JSON Schema:**
```json
{
  "type": "fill-blank",
  "id": "ex4-q1",
  "question": "A tiger is __________ (dangerous) a lion.",
  "wordHint": "(dangerous)",
  "answer": "as dangerous as",
  "acceptedAnswers": ["as dangerous as", "not as dangerous as"],
  "hints": ["Use 'as...as' pattern for equality"],
  "points": 10,
  "timeLimit": 30
}
```

#### Type 4: `multiple-choice` - Select Correct Answer
Choose from multiple options.

**JSON Schema:**
```json
{
  "type": "multiple-choice",
  "id": "ex5-q1",
  "question": "This exercise is _____ than the last one.",
  "options": ["easier", "the easiest", "more easy", "most easy"],
  "correctIndex": 0,
  "explanation": "Use comparative form with 'than'",
  "hints": ["Look for the word 'than' in the sentence"],
  "points": 10
}
```

#### Type 5: `error-correct` - Find and Fix Mistakes
Identify grammatical errors and provide corrections.

**JSON Schema:**
```json
{
  "type": "error-correct",
  "id": "ex9-q1",
  "wrongSentence": "She is more tall than her brother.",
  "correctSentence": "She is taller than her brother.",
  "errorWord": "more tall",
  "correction": "taller",
  "explanation": "'Tall' is a short adjective, use -er form not 'more'",
  "hints": ["Check the adjective form"],
  "points": 10
}
```

#### Type 6: `fill-blank-mixed` - Multiple Blanks Per Sentence
Fill multiple blanks within one sentence.

**JSON Schema:**
```json
{
  "type": "fill-blank-mixed",
  "id": "ex8-q1",
  "template": "Sarah is _1_ (tall) her sister, but Maria is _2_ (tall) girl in the class.",
  "blanks": [
    {
      "blankId": 1,
      "hint": "(tall)",
      "answer": "taller than",
      "acceptedAnswers": ["taller than"]
    },
    {
      "blankId": 2,
      "hint": "(tall)",
      "answer": "the tallest",
      "acceptedAnswers": ["the tallest"]
    }
  ],
  "points": 15
}
```

#### Type 7: `translation` - Vietnamese to English
Translate Vietnamese sentences to English.

**JSON Schema:**
```json
{
  "type": "translation",
  "id": "ex13-q1",
  "vietnamese": "Chiếc áo này quá nhỏ đối với tôi.",
  "answer": "This shirt is too small for me.",
  "acceptedAnswers": [
    "This shirt is too small for me",
    "This shirt is too small for me.",
    "This dress is too small for me",
    "This dress is too small for me."
  ],
  "hints": ["Use 'too' + adjective"],
  "points": 10
}
```

#### Type 8: `sentence-rewrite` - Transform Sentences
Rewrite sentences using specific grammar structure.

**JSON Schema:**
```json
{
  "type": "sentence-rewrite",
  "id": "ex7-q1",
  "original": "The shoes are very small. I can't wear them.",
  "instruction": "Rewrite using 'too'",
  "starterText": "The shoes are",
  "answer": "The shoes are too small for me to wear.",
  "acceptedAnswers": [
    "The shoes are too small for me to wear",
    "The shoes are too small to wear",
    "The shoes are too small for me to wear."
  ],
  "hints": ["Structure: too + adjective + to + verb"],
  "points": 10
}
```

#### Type 9: `dialogue-complete` - Fill Dialogue Blanks
Complete conversation with missing words/phrases.

**JSON Schema:**
```json
{
  "type": "dialogue-complete",
  "id": "ex12",
  "title": "Complete the dialogue",
  "lines": [
    {
      "speaker": "A",
      "text": "Have you seen the new shopping center?",
      "blank": false
    },
    {
      "speaker": "B",
      "text": "Yes! It's ___ (large) shopping center in the city.",
      "blank": true,
      "blankId": "b1",
      "wordHint": "(large)",
      "answer": "the largest",
      "acceptedAnswers": ["the largest"]
    }
  ],
  "points": 20
}
```

#### Type 10: `open-ended` - Free Writing
Free writing exercises (not auto-scored, display only).

**JSON Schema:**
```json
{
  "type": "open-ended",
  "id": "ex14",
  "title": "Writing Exercise",
  "instruction": "Write 5 sentences comparing two cities. Use comparative and superlative adjectives.",
  "example": "Example: Hanoi is bigger than Hue. It's also more crowded...",
  "minSentences": 5,
  "maxWords": 200,
  "scored": false,
  "displayOnly": true,
  "points": 0
}
```

### Exercise Type JS File - Standard API

Every exercise type JS file must implement this interface:

```javascript
const ExerciseTypeName = {
  /**
   * Render the UI for this exercise
   * @param {Object} question - Question data from JSON
   * @param {HTMLElement} container - DOM element to render into
   * @param {Object} callbacks - { onAnswer, onHint }
   */
  render(question, container, callbacks) {
    // Create HTML structure
    // Attach event listeners
    // Call callbacks.onAnswer(userAnswer) when student submits
    // Call callbacks.onHint() when student requests hint
  },

  /**
   * Validate student answer against correct answer(s)
   * @param {string|Array} userAnswer - Student's answer
   * @param {Object} question - Question data with answer(s)
   * @returns {boolean} - True if correct
   */
  validate(userAnswer, question) {
    // Normalize and compare answers
    // Check acceptedAnswers array if present
    // Return true/false
  },

  /**
   * Extract current answer from rendered UI
   * @param {HTMLElement} container - DOM element containing the exercise
   * @returns {string|Array} - Current user answer
   */
  getUserAnswer(container) {
    // Read from input fields
    // Return answer value(s)
  },

  /**
   * Show visual feedback for correct/wrong answer
   * @param {HTMLElement} container - DOM element
   * @param {boolean} isCorrect - Whether answer was correct
   * @param {Object} question - Question data for showing correct answer
   */
  showFeedback(container, isCorrect, question) {
    // Add CSS classes: .correct-answer or .wrong-answer
    // Display correct answer if wrong
    // Animate feedback
  },

  /**
   * Reset exercise for retry
   * @param {HTMLElement} container - DOM element
   */
  reset(container) {
    // Clear input fields
    // Remove feedback classes
    // Reset to initial state
  }
};
```

**Naming Convention:**
- File: `fill-blank.js`
- Object: `FillBlankExercise`
- Pattern: `<type-name>.js` → `<TypeName>Exercise`

## Coding Standards

### CSS
- Use CSS custom properties (variables) for colors, spacing
- Mobile-first responsive design
- BEM naming convention: `.block__element--modifier`
- No inline styles
- Animation classes: `.correct-answer`, `.wrong-answer`, `.fade-in`

### JavaScript
- ES6+ features (const/let, arrow functions, template literals)
- No jQuery - vanilla JS only
- Module pattern for organization
- Constants in CAPS: `const MAX_HINTS = 3`
- Extract magic numbers to constants

```javascript
// Good
const POINTS_PER_QUESTION = 10;
const COMBO_MULTIPLIER = 1.5;
const TIME_BONUS_THRESHOLD = 5000; // ms

// Bad
score += 10; // magic number
```

### HTML
- Semantic HTML5 elements
- Accessibility: proper ARIA labels, alt text
- Consistent structure across all game pages:
  - Header (title, score, timer)
  - Theory panel (collapsible)
  - Game area
  - Progress bar
  - Footer (navigation)

## Scoring System

### Points
- Base points per question: 10
- Combo multiplier: consecutive correct × 1.5
- Time bonus: answer in <5s → +5 points
- Hint penalty: -2 points per hint used
- Wrong answer: 0 points, reset combo

### Progress Tracking (LocalStorage)
```javascript
{
  "unit-3-carnival": {
    "bestScore": 150,
    "stars": 3,
    "completed": true,
    "attempts": 5,
    "lastPlayed": "2025-10-05T10:30:00Z"
  }
}
```

### Star Ratings
- 1 star: 50-69% correct
- 2 stars: 70-89% correct
- 3 stars: 90-100% correct

## UI/UX Guidelines

### Visual Feedback
- Correct answer: green flash + checkmark icon + sound
- Wrong answer: red shake + X icon + error sound
- Instant feedback (no delay)
- Smooth transitions (300ms)

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Color Scheme
```css
:root {
  --primary: #4CAF50;      /* Success green */
  --danger: #f44336;       /* Error red */
  --warning: #ff9800;      /* Warning orange */
  --info: #2196F3;         /* Info blue */
  --bg-light: #f5f5f5;
  --text-dark: #333;
}
```

## Development Workflow

### Creating a New Game Page
1. Read corresponding `.md` exercise file
2. Create JSON data file in `/data/`
3. Create HTML game page in `/pages/`
4. Link to shared CSS/JS files
5. Test all question types
6. Add to homepage index

### No Duplication
- Extract common UI components to templates in `utils.js`
- Reuse game logic from `game-engine.js`
- Single source of truth for colors, spacing in `shared.css`

### File Size Limits
- Each JSON file: < 100KB
- Images: optimized, < 200KB each
- Total page weight: < 500KB (excluding cached assets)

## Features to Implement

### Phase 1 (MVP)
- Homepage with unit cards
- One complete game page (Unit 3)
- Basic scoring system
- LocalStorage save/load

### Phase 2
- All units converted
- Timer functionality
- Sound effects (toggle)
- Progress dashboard

### Phase 3
- Review mode (mixed questions)
- Leaderboard (compare with classmates via shared code)
- Badges/achievements
- Print certificate

## GitHub Pages Deployment

### Repository Setup
- Main branch: production code
- All assets use relative paths
- Base URL: `/Day-Gia-Hung/`
- No server-side code (pure static)

### Testing Before Deploy
- Test on mobile devices
- Test all browsers (Chrome, Firefox, Safari)
- Validate HTML/CSS
- Check all links work with base path

## Notes
- Keep it simple - plain HTML/CSS/JS, no frameworks
- Production-ready code from start
- Every string/number should be a constant or enum
- Brief inline comments for complex logic
- Student-friendly UI (large buttons, clear instructions)
