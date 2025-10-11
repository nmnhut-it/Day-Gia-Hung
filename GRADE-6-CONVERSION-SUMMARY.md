# Grade 6 Units Conversion Summary

## Completed Units (JSON + HTML created):
- ✅ Unit 1: My New School (Present Simple) - **ALREADY EXISTED**
- ✅ Unit 2: My House (Possessive 's, There is/are, Prepositions)
- ✅ Unit 3: My Friends (Present Continuous, Appearance)

## Remaining Units to Create:

### Unit 4: My Neighbourhood
- **Grammar**: Comparative adjectives, Giving directions
- **Files**: `data/g6-unit-4-my-neighbourhood.json`, `pages/g6-unit-4-my-neighbourhood.html`
- **Key topics**: comparative forms (bigger, more beautiful), directions (turn left/right, go straight)

### Unit 5: Natural Wonders
- **Grammar**: Must/mustn't (modal verbs), Superlative adjectives
- **Files**: `data/g6-unit-5-natural-wonders.json`, `pages/g6-unit-5-natural-wonders.html`
- **Key topics**: must/mustn't for rules, the highest/the most beautiful

### Unit 6: Our Tet Holiday
- **Grammar**: Will/won't for future, Should/shouldn't
- **Files**: `data/g6-unit-6-our-tet-holiday.json`, `pages/g6-unit-6-our-tet-holiday.html`
- **Key topics**: will for predictions, should for advice

### Unit 7: Television
- **Grammar**: Conjunctions (and, but, so, because, although), Question words
- **Files**: `data/g6-unit-7-television.json`, `pages/g6-unit-7-television.html`
- **Key topics**: connecting sentences, Wh-questions

### Unit 8: Sports and Games
- **Grammar**: Past Simple tense (regular and irregular verbs)
- **Files**: `data/g6-unit-8-sports-and-games.json`, `pages/g6-unit-8-sports-and-games.html`
- **Key topics**: was/were, played/did, went/saw

### Unit 9: Cities of the World
- **Grammar**: Superlative adjectives, Present Perfect (have been)
- **Files**: `data/g6-unit-9-cities-of-the-world.json`, `pages/g6-unit-9-cities-of-the-world.html`
- **Key topics**: the most/the best, have/has been to

### Unit 10: Our Houses in the Future
- **Grammar**: Will for predictions, Might for possibility
- **Files**: `data/g6-unit-10-our-houses-in-the-future.json`, `pages/g6-unit-10-our-houses-in-the-future.html`
- **Key topics**: will have, might be

### Unit 11: Our Greener World
- **Grammar**: Conditional Type 1 (If + present simple, will + V)
- **Files**: `data/g6-unit-11-our-greener-world.json`, `pages/g6-unit-11-our-greener-world.html`
- **Key topics**: If we recycle, we will save..., First conditional

### Unit 12: Robots
- **Grammar**: Will be able to, Could/couldn't
- **Files**: `data/g6-unit-12-robots.json`, `pages/g6-unit-12-robots.html`
- **Key topics**: Robots will be able to..., could in the past

### Review 1: Units 1-3
- **Grammar**: Mixed review (Present Simple, Present Continuous, Possessive, There is/are)
- **Files**: `data/g6-review-1-units-1-3.json`, `pages/g6-review-1-units-1-3.html`

### Review 2: Units 4-6
- **Grammar**: Mixed review (Comparatives, Must/mustn't, Will/won't)
- **Files**: `data/g6-review-2-units-4-6.json`, `pages/g6-review-2-units-4-6.html`

### Review 3: Units 7-9
- **Grammar**: Mixed review (Conjunctions, Past Simple, Superlatives)
- **Files**: `data/g6-review-3-units-7-9.json`, `pages/g6-review-3-units-7-9.html`

## Index.html Update Needed

Add to GRADE6_UNITS array:
```javascript
const GRADE6_UNITS = [
  {
    id: 'g6-unit-1-my-new-school',
    title: 'Unit 1: My New School',
    subtitle: 'Present Simple Tense',
    dataPath: './data/g6-unit-1-my-new-school.json',
    pagePath: './pages/g6-unit-1-my-new-school.html'
  },
  {
    id: 'g6-unit-2-my-house',
    title: 'Unit 2: My House',
    subtitle: "Possessive 's & There is/are",
    dataPath: './data/g6-unit-2-my-house.json',
    pagePath: './pages/g6-unit-2-my-house.html'
  },
  {
    id: 'g6-unit-3-my-friends',
    title: 'Unit 3: My Friends',
    subtitle: 'Present Continuous',
    dataPath: './data/g6-unit-3-my-friends.json',
    pagePath: './pages/g6-unit-3-my-friends.html'
  },
  {
    id: 'g6-unit-4-my-neighbourhood',
    title: 'Unit 4: My Neighbourhood',
    subtitle: 'Comparative Adjectives',
    dataPath: './data/g6-unit-4-my-neighbourhood.json',
    pagePath: './pages/g6-unit-4-my-neighbourhood.html'
  },
  {
    id: 'g6-unit-5-natural-wonders',
    title: 'Unit 5: Natural Wonders',
    subtitle: 'Must/Mustn\'t',
    dataPath: './data/g6-unit-5-natural-wonders.json',
    pagePath: './pages/g6-unit-5-natural-wonders.html'
  },
  {
    id: 'g6-unit-6-our-tet-holiday',
    title: 'Unit 6: Our Tet Holiday',
    subtitle: 'Will/Won\'t',
    dataPath: './data/g6-unit-6-our-tet-holiday.json',
    pagePath: './pages/g6-unit-6-our-tet-holiday.html'
  },
  {
    id: 'g6-unit-7-television',
    title: 'Unit 7: Television',
    subtitle: 'Conjunctions',
    dataPath: './data/g6-unit-7-television.json',
    pagePath: './pages/g6-unit-7-television.html'
  },
  {
    id: 'g6-unit-8-sports-and-games',
    title: 'Unit 8: Sports and Games',
    subtitle: 'Past Simple',
    dataPath: './data/g6-unit-8-sports-and-games.json',
    pagePath: './pages/g6-unit-8-sports-and-games.html'
  },
  {
    id: 'g6-unit-9-cities-of-the-world',
    title: 'Unit 9: Cities of the World',
    subtitle: 'Superlatives',
    dataPath: './data/g6-unit-9-cities-of-the-world.json',
    pagePath: './pages/g6-unit-9-cities-of-the-world.html'
  },
  {
    id: 'g6-unit-10-our-houses-in-the-future',
    title: 'Unit 10: Our Houses in the Future',
    subtitle: 'Will for Future',
    dataPath: './data/g6-unit-10-our-houses-in-the-future.json',
    pagePath: './pages/g6-unit-10-our-houses-in-the-future.html'
  },
  {
    id: 'g6-unit-11-our-greener-world',
    title: 'Unit 11: Our Greener World',
    subtitle: 'Conditional Type 1',
    dataPath: './data/g6-unit-11-our-greener-world.json',
    pagePath: './pages/g6-unit-11-our-greener-world.html'
  },
  {
    id: 'g6-unit-12-robots',
    title: 'Unit 12: Robots',
    subtitle: 'Will be able to',
    dataPath: './data/g6-unit-12-robots.json',
    pagePath: './pages/g6-unit-12-robots.html'
  },
  {
    id: 'g6-review-1-units-1-3',
    title: 'Review 1',
    subtitle: 'Units 1-3',
    dataPath: './data/g6-review-1-units-1-3.json',
    pagePath: './pages/g6-review-1-units-1-3.html'
  },
  {
    id: 'g6-review-2-units-4-6',
    title: 'Review 2',
    subtitle: 'Units 4-6',
    dataPath: './data/g6-review-2-units-4-6.json',
    pagePath: './pages/g6-review-2-units-4-6.html'
  },
  {
    id: 'g6-review-3-units-7-9',
    title: 'Review 3',
    subtitle: 'Units 7-9',
    dataPath: './data/g6-review-3-units-7-9.json',
    pagePath: './pages/g6-review-3-units-7-9.html'
  }
];
```

## Status:
- **Created**: 3/15 units (20%)
- **Remaining**: 12/15 units (80%)
