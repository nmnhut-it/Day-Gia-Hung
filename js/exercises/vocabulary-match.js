/**
 * VocabularyMatch Exercise Type
 * Matches English words with Vietnamese definitions
 * Implements standard exercise API for game engine integration
 */

const VocabularyMatchExercise = {
  /**
   * Render matching pairs UI
   * Creates draggable/clickable interface for matching words with definitions
   */
  render(question, container, callbacks) {
    const { pairs, hints } = question;

    // Shuffle Vietnamese options to make it challenging
    const shuffledVietnamese = this._shuffleArray([...pairs]);

    const html = `
      <div class="vocabulary-match-container">
        <div class="match-instructions">
          <p>Match each English word with its Vietnamese meaning</p>
        </div>

        <div class="matching-area">
          <div class="english-column">
            <h4>English</h4>
            ${pairs.map((pair, index) => `
              <div class="match-item english-item" data-index="${index}" data-word="${pair.english}">
                <span class="match-number">${index + 1}.</span>
                <span class="match-text">${pair.english}</span>
                <select class="match-select" data-index="${index}">
                  <option value="">-- Select --</option>
                  ${shuffledVietnamese.map((p, i) => `
                    <option value="${p.vietnamese}">${p.vietnamese}</option>
                  `).join('')}
                </select>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="match-feedback" style="display: none;"></div>

        <div class="exercise-actions">
          <button class="btn-hint" data-action="hint">
            <span class="icon">💡</span> Hint
          </button>
          <button class="btn-submit" data-action="submit">
            <span class="icon">✓</span> Submit Answer
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach event listeners
    const submitBtn = container.querySelector('[data-action="submit"]');
    const hintBtn = container.querySelector('[data-action="hint"]');

    submitBtn.addEventListener('click', () => {
      const userAnswer = this.getUserAnswer(container);
      callbacks.onAnswer(userAnswer);
    });

    hintBtn.addEventListener('click', () => {
      callbacks.onHint();
    });
  },

  /**
   * Validate user's matches against correct pairs
   * Returns true only if all pairs are correctly matched
   */
  validate(userAnswer, question) {
    const { pairs } = question;

    if (!userAnswer || !Array.isArray(userAnswer)) {
      return false;
    }

    // Check if all matches are correct
    let allCorrect = true;
    for (let i = 0; i < pairs.length; i++) {
      const correctPair = pairs[i];
      const userMatch = userAnswer[i];

      if (!userMatch || userMatch.vietnamese !== correctPair.vietnamese) {
        allCorrect = false;
        break;
      }
    }

    return allCorrect;
  },

  /**
   * Extract user's current matches from UI
   * Returns array of {english, vietnamese} objects
   */
  getUserAnswer(container) {
    const selects = container.querySelectorAll('.match-select');
    const answer = [];

    selects.forEach((select, index) => {
      const englishItem = container.querySelector(`[data-index="${index}"]`);
      const english = englishItem.dataset.word;
      const vietnamese = select.value;

      answer.push({
        english: english,
        vietnamese: vietnamese
      });
    });

    return answer;
  },

  /**
   * Show visual feedback for correct/incorrect matches
   * Highlights correct matches in green, wrong ones in red
   */
  showFeedback(container, isCorrect, question) {
    const feedbackDiv = container.querySelector('.match-feedback');
    const { pairs } = question;
    const userAnswer = this.getUserAnswer(container);

    if (isCorrect) {
      feedbackDiv.className = 'match-feedback correct-answer';
      feedbackDiv.innerHTML = '<p><strong>✓ Correct!</strong> All matches are perfect!</p>';
      feedbackDiv.style.display = 'block';

      // Highlight all as correct
      const items = container.querySelectorAll('.english-item');
      items.forEach(item => {
        item.classList.add('correct');
      });
    } else {
      feedbackDiv.className = 'match-feedback wrong-answer';

      // Show which matches are wrong
      let wrongCount = 0;
      const items = container.querySelectorAll('.english-item');

      items.forEach((item, index) => {
        const correctVietnamese = pairs[index].vietnamese;
        const userVietnamese = userAnswer[index].vietnamese;

        if (userVietnamese === correctVietnamese) {
          item.classList.add('correct');
        } else {
          item.classList.add('wrong');
          wrongCount++;
        }
      });

      feedbackDiv.innerHTML = `
        <p><strong>✗ Incorrect!</strong></p>
        <p>You have ${wrongCount} wrong match${wrongCount > 1 ? 'es' : ''}.</p>
        <div class="correct-answers">
          <p><strong>Correct matches:</strong></p>
          ${pairs.map(pair => `
            <p>${pair.english} = ${pair.vietnamese}</p>
          `).join('')}
        </div>
      `;
      feedbackDiv.style.display = 'block';
    }

    // Disable selects after submission
    const selects = container.querySelectorAll('.match-select');
    selects.forEach(select => {
      select.disabled = true;
    });
  },

  /**
   * Reset exercise to initial state for retry
   * Clears selections and removes feedback
   */
  reset(container) {
    const selects = container.querySelectorAll('.match-select');
    selects.forEach(select => {
      select.value = '';
      select.disabled = false;
    });

    const items = container.querySelectorAll('.english-item');
    items.forEach(item => {
      item.classList.remove('correct', 'wrong');
    });

    const feedbackDiv = container.querySelector('.match-feedback');
    feedbackDiv.style.display = 'none';
    feedbackDiv.innerHTML = '';
  },

  /**
   * Utility: Shuffle array using Fisher-Yates algorithm
   */
  _shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// Auto-register with GameEngine if available
if (typeof window !== 'undefined' && window.GameEngine) {
  window.GameEngine.registerExerciseType('vocabulary-match', VocabularyMatchExercise);
}
