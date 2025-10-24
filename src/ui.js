/**
 * UI module - Rendering and DOM manipulation functions
 */

import { QUESTION_TYPES, UI_TEXT, CSS_CLASSES } from './data.js';

/**
 * Renders the quiz interface
 * @param {QuizState} state - Quiz state object
 * @param {HTMLElement} container - Container element
 * @param {Function} onBackToMenu - Callback to return to menu
 */
export function renderQuiz(state, container, onBackToMenu) {
  if (state.isSubmitted) {
    renderResults(state, container, onBackToMenu);
    return;
  }

  const question = state.getCurrentQuestion();
  const questionNumber = state.currentIndex + 1;
  const total = state.getTotalQuestions();

  container.innerHTML = `
    <div class="quiz-header">
      <h2>${UI_TEXT.APP_TITLE}</h2>
      <div class="progress">${UI_TEXT.QUESTION_LABEL} ${questionNumber} / ${total}</div>
    </div>
    <div class="${CSS_CLASSES.QUESTION_CONTAINER}">
      ${renderQuestion(question, state)}
      ${renderAnswerFeedback(state)}
      ${renderExplanationSection(question, state)}
    </div>
    <div class="quiz-nav">
      ${renderNavigationButtons(state)}
    </div>
  `;

  attachEventListeners(state, container);
}

/**
 * Renders a single question based on type
 * @param {Object} question - Question object
 * @param {QuizState} state - Quiz state
 * @returns {string} HTML string
 */
function renderQuestion(question, state) {
  let html = `<p class="question-text"><strong>${question.question}</strong></p>`;

  if (question.mediaUrl) {
    if (question.mediaUrl.includes('.mp3')) {
      html += `<audio controls src="${question.mediaUrl}"></audio>`;
    } else if (question.mediaUrl.includes('.jpg') || question.mediaUrl.includes('.png')) {
      html += `<img src="${question.mediaUrl}" alt="Question image" class="question-image">`;
    }
  }

  const userAnswer = state.getAnswer() || '';

  switch (question.type) {
    case QUESTION_TYPES.MULTIPLE_CHOICE:
    case QUESTION_TYPES.PRONUNCIATION:
    case QUESTION_TYPES.ODD_ONE_OUT:
      html += renderMultipleChoice(question.options, userAnswer);
      break;

    case QUESTION_TYPES.FILL_BLANK:
      html += renderTextInput(userAnswer, question);
      break;

    case QUESTION_TYPES.WORD_ARRANGEMENT:
      html += renderWordArrangement(question, state);
      break;
  }

  return html;
}

/**
 * Renders multiple choice options
 * @param {string[]} options - Array of options
 * @param {string} selectedAnswer - Currently selected answer
 * @returns {string} HTML string
 */
function renderMultipleChoice(options, selectedAnswer) {
  const optionsHtml = options.map((option, index) => {
    const letter = String.fromCharCode(65 + index);
    const isSelected = selectedAnswer === option;
    const selectedClass = isSelected ? CSS_CLASSES.OPTION_SELECTED : '';

    return `
      <button
        class="${CSS_CLASSES.OPTION_BUTTON} ${selectedClass}"
        data-answer="${option}">
        ${letter}. ${option}
      </button>
    `;
  }).join('');

  return `<div class="options-container">${optionsHtml}</div>`;
}

/**
 * Renders text input field
 * @param {string} value - Current input value
 * @param {Object} question - Question object (optional, for fill-blank)
 * @returns {string} HTML string
 */
function renderTextInput(value, question = null) {
  if (question && question.type === QUESTION_TYPES.FILL_BLANK) {
    return renderFillBlankWithBoxes(question, value);
  }

  return `
    <div class="input-container">
      <input
        type="text"
        class="${CSS_CLASSES.INPUT_FIELD}"
        value="${value}"
        placeholder="${UI_TEXT.YOUR_ANSWER_LABEL}"
        autocomplete="off">
    </div>
  `;
}

/**
 * Renders fill-in-blank with letter boxes
 * @param {Object} question - Question object
 * @param {string} userAnswer - Current user answer
 * @returns {string} HTML string
 */
function renderFillBlankWithBoxes(question, userAnswer) {
  const expectedLength = question.correctAnswer.length;
  const userLetters = (userAnswer || '').split('');

  const underscorePattern = /_+/g;
  const parts = question.question.split(underscorePattern);

  const boxesHtml = Array.from({ length: expectedLength }).map((_, idx) => {
    const letter = userLetters[idx] || '';
    return `<span class="letter-box ${letter ? 'filled' : ''}">${letter}</span>`;
  }).join('');

  return `
    <div class="fill-blank-container">
      <div class="question-with-blanks">
        ${parts[0] || ''}
        <span class="letter-boxes-inline">${boxesHtml}</span>
        ${parts[1] || ''}
      </div>
      <input
        type="text"
        class="${CSS_CLASSES.INPUT_FIELD} hidden-input"
        value="${userAnswer}"
        placeholder="${UI_TEXT.YOUR_ANSWER_LABEL}"
        autocomplete="off"
        maxlength="${expectedLength}">
    </div>
  `;
}

/**
 * Renders word arrangement interface with drag and click support
 * @param {Object} question - Question object
 * @param {QuizState} state - Quiz state
 * @returns {string} HTML string
 */
function renderWordArrangement(question, state) {
  const words = question.question.split('/').map(w => w.trim()).filter(w => w);
  const selectedWords = state.getWordArrangementAnswer() || [];

  const availableWords = words.filter(w => !selectedWords.includes(w));

  const wordsHtml = availableWords.map((word, idx) => `
    <button class="word-chip" data-word="${word}" data-index="${idx}" draggable="true">
      ${word}
    </button>
  `).join('');

  const selectedHtml = selectedWords.map((word, idx) => `
    <span class="selected-word" data-word="${word}" data-position="${idx}">
      ${word}
      <button class="remove-word" data-word="${word}">&times;</button>
    </span>
  `).join('');

  return `
    <div class="word-arrangement-container">
      <div class="answer-area" data-empty="${selectedWords.length === 0}">
        ${selectedWords.length === 0 ? '<span class="placeholder">Click words to build your answer</span>' : selectedHtml}
      </div>
      <div class="word-bank">
        ${wordsHtml}
      </div>
    </div>
  `;
}

/**
 * Renders answer feedback section
 * @param {QuizState} state - Quiz state
 * @returns {string} HTML string
 */
function renderAnswerFeedback(state) {
  const question = state.getCurrentQuestion();

  if (!state.isCurrentAnswerChecked()) {
    return '';
  }

  const isCorrect = state.isCurrentAnswerCorrect();
  const feedbackClass = isCorrect ? 'correct-feedback' : 'wrong-feedback';
  const feedbackText = isCorrect ? UI_TEXT.CORRECT_FEEDBACK : UI_TEXT.WRONG_FEEDBACK;

  let html = `<div class="answer-feedback ${feedbackClass}">${feedbackText}</div>`;

  if (!isCorrect) {
    html += `
      <div class="correct-answer-display">
        <strong>${UI_TEXT.CORRECT_ANSWER_LABEL}</strong> ${question.correctAnswer}
      </div>
    `;
  }

  return html;
}

/**
 * Renders explanation section with toggle button
 * @param {Object} question - Question object
 * @param {QuizState} state - Quiz state
 * @returns {string} HTML string
 */
function renderExplanationSection(question, state) {
  if (!question.explanation) {
    return '';
  }

  const isVisible = state.isExplanationVisible();
  const isChecked = state.isCurrentAnswerChecked();

  if (!isChecked && !state.isSubmitted) {
    return '';
  }

  const renderedExplanation = isVisible && typeof marked !== 'undefined'
    ? marked.parse(question.explanation)
    : question.explanation;

  return `
    <div class="explanation-section">
      <button class="explanation-toggle" id="explanation-toggle">
        ${isVisible ? '📖 Hide Explanation' : '💡 Show Explanation'}
      </button>
      ${isVisible ? `
        <div class="explanation-content">
          <div class="explanation-text">${renderedExplanation}</div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Renders navigation buttons
 * @param {QuizState} state - Quiz state
 * @returns {string} HTML string
 */
function renderNavigationButtons(state) {
  const prevDisabled = !state.hasPrevious() ? CSS_CLASSES.NAV_DISABLED : '';
  const hasAnswer = state.getAnswer() !== undefined && state.getAnswer() !== '';
  const isChecked = state.isCurrentAnswerChecked();
  const isCorrect = state.isCurrentAnswerCorrect();
  const isWrongConfirmed = state.isWrongAnswerConfirmed();

  let html = `
    <button class="${CSS_CLASSES.NAV_BUTTON} ${prevDisabled}" id="prev-btn">
      ${UI_TEXT.PREVIOUS_BUTTON}
    </button>
  `;

  if (state.hasNext()) {
    if (!hasAnswer || !isChecked) {
      const checkDisabled = !hasAnswer ? CSS_CLASSES.NAV_DISABLED : '';
      html += `
        <button class="check-answer-btn ${checkDisabled}" id="check-btn">
          ${UI_TEXT.CHECK_ANSWER_BUTTON}
        </button>
      `;
    } else if (isChecked && !isCorrect && !isWrongConfirmed) {
      html += `
        <button class="confirm-btn" id="confirm-btn">
          ${UI_TEXT.CONFIRM_CONTINUE_BUTTON}
        </button>
      `;
    } else if (state.canProceedToNext()) {
      html += `
        <button class="${CSS_CLASSES.NAV_BUTTON}" id="next-btn">
          ${UI_TEXT.NEXT_BUTTON}
        </button>
      `;
    }
  } else {
    if (!hasAnswer || !isChecked) {
      const checkDisabled = !hasAnswer ? CSS_CLASSES.NAV_DISABLED : '';
      html += `
        <button class="check-answer-btn ${checkDisabled}" id="check-btn">
          ${UI_TEXT.CHECK_ANSWER_BUTTON}
        </button>
      `;
    } else {
      html += `
        <button class="${CSS_CLASSES.SUBMIT_BUTTON}" id="submit-btn">
          ${UI_TEXT.SUBMIT_BUTTON}
        </button>
      `;
    }
  }

  return html;
}

/**
 * Renders results screen
 * @param {QuizState} state - Quiz state
 * @param {HTMLElement} container - Container element
 * @param {Function} onBackToMenu - Callback to return to menu
 */
function renderResults(state, container, onBackToMenu) {
  const score = state.calculateScore();

  container.innerHTML = `
    <div class="${CSS_CLASSES.RESULTS_CONTAINER}">
      <h2>Quiz Complete!</h2>
      <div class="${CSS_CLASSES.SCORE_DISPLAY}">
        <p class="score-big">${score.correct} / ${score.total}</p>
        <p class="score-percentage">${score.percentage}%</p>
      </div>
      <div class="results-buttons">
        <button class="${CSS_CLASSES.SUBMIT_BUTTON}" id="retry-btn">
          ${UI_TEXT.RETRY_BUTTON}
        </button>
        <button class="${CSS_CLASSES.NAV_BUTTON}" id="menu-btn">
          ${UI_TEXT.BACK_TO_MENU}
        </button>
      </div>
    </div>
  `;

  container.querySelector('#retry-btn').addEventListener('click', () => {
    state.reset();
    renderQuiz(state, container, onBackToMenu);
  });

  container.querySelector('#menu-btn').addEventListener('click', onBackToMenu);
}

/**
 * Updates only navigation buttons without full re-render
 * @param {QuizState} state - Quiz state
 * @param {HTMLElement} container - Container element
 */
function updateNavigationButtons(state, container) {
  const navContainer = container.querySelector('.quiz-nav');
  if (!navContainer) return;

  navContainer.innerHTML = renderNavigationButtons(state);

  const checkBtn = container.querySelector('#check-btn');
  if (checkBtn && !checkBtn.classList.contains(CSS_CLASSES.NAV_DISABLED)) {
    checkBtn.addEventListener('click', () => {
      state.checkCurrentAnswer();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  const confirmBtn = container.querySelector('#confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      state.confirmWrongAnswer();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  const nextBtn = container.querySelector('#next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      await state.goToNext();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  const submitBtn = container.querySelector('#submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      state.submit();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  const prevBtn = container.querySelector('#prev-btn');
  if (prevBtn && !prevBtn.classList.contains(CSS_CLASSES.NAV_DISABLED)) {
    prevBtn.addEventListener('click', () => {
      state.goToPrevious();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }
}

/**
 * Attaches event listeners to interactive elements
 * @param {QuizState} state - Quiz state
 * @param {HTMLElement} container - Container element
 */
function attachEventListeners(state, container) {
  const question = state.getCurrentQuestion();

  // Option buttons (multiple choice)
  const optionButtons = container.querySelectorAll(`.${CSS_CLASSES.OPTION_BUTTON}`);
  optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const answer = e.target.dataset.answer;
      state.setAnswer(answer);

      // Update UI to show selection
      optionButtons.forEach(b => b.classList.remove(CSS_CLASSES.OPTION_SELECTED));
      e.target.classList.add(CSS_CLASSES.OPTION_SELECTED);

      // Re-render to enable Check button
      renderQuiz(state, container, state.onBackToMenu);
    });
  });

  // Text input
  const inputField = container.querySelector(`.${CSS_CLASSES.INPUT_FIELD}`);
  if (inputField) {
    inputField.addEventListener('input', (e) => {
      state.setAnswer(e.target.value);

      if (question.type === QUESTION_TYPES.FILL_BLANK) {
        const userLetters = e.target.value.split('');
        const letterBoxes = container.querySelectorAll('.letter-box');
        letterBoxes.forEach((box, idx) => {
          const letter = userLetters[idx] || '';
          box.textContent = letter;
          box.classList.toggle('filled', letter !== '');
        });
      }

      // Update navigation buttons to enable/disable Check button
      updateNavigationButtons(state, container);
    });
  }

  // Word arrangement
  if (question.type === QUESTION_TYPES.WORD_ARRANGEMENT) {
    attachWordArrangementListeners(state, container);
  }

  // Explanation toggle
  const explanationToggle = container.querySelector('#explanation-toggle');
  if (explanationToggle) {
    explanationToggle.addEventListener('click', () => {
      state.toggleExplanation();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  // Check Answer button
  const checkBtn = container.querySelector('#check-btn');
  if (checkBtn && !checkBtn.classList.contains(CSS_CLASSES.NAV_DISABLED)) {
    checkBtn.addEventListener('click', () => {
      state.checkCurrentAnswer();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  // Confirm button (for wrong answers)
  const confirmBtn = container.querySelector('#confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      state.confirmWrongAnswer();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  // Navigation buttons
  const prevBtn = container.querySelector('#prev-btn');
  const nextBtn = container.querySelector('#next-btn');
  const submitBtn = container.querySelector('#submit-btn');

  if (prevBtn && !prevBtn.classList.contains(CSS_CLASSES.NAV_DISABLED)) {
    prevBtn.addEventListener('click', () => {
      state.goToPrevious();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      await state.goToNext();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      state.submit();
      renderQuiz(state, container, state.onBackToMenu);
    });
  }
}

/**
 * Attaches event listeners for word arrangement interactions
 * @param {QuizState} state - Quiz state
 * @param {HTMLElement} container - Container element
 */
function attachWordArrangementListeners(state, container) {
  const wordChips = container.querySelectorAll('.word-chip');
  const answerArea = container.querySelector('.answer-area');

  // Click to add word
  wordChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const word = e.currentTarget.dataset.word;
      state.addWordToArrangement(word);
      renderQuiz(state, container, state.onBackToMenu);
    });

    // Drag start
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', e.currentTarget.dataset.word);
      e.currentTarget.classList.add('dragging');
    });

    chip.addEventListener('dragend', (e) => {
      e.currentTarget.classList.remove('dragging');
    });
  });

  // Remove word listeners
  const removeButtons = container.querySelectorAll('.remove-word');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const word = e.currentTarget.dataset.word;
      state.removeWordFromArrangement(word);
      renderQuiz(state, container, state.onBackToMenu);
    });
  });

  // Drop zone for answer area
  if (answerArea) {
    answerArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      answerArea.classList.add('drag-over');
    });

    answerArea.addEventListener('dragleave', () => {
      answerArea.classList.remove('drag-over');
    });

    answerArea.addEventListener('drop', (e) => {
      e.preventDefault();
      answerArea.classList.remove('drag-over');
      const word = e.dataTransfer.getData('text/plain');
      if (word) {
        state.addWordToArrangement(word);
        renderQuiz(state, container, state.onBackToMenu);
      }
    });
  }
}

/**
 * Renders test set selection menu
 * @param {Array} testSets - Array of test set objects
 * @param {HTMLElement} container - Container element
 * @param {Function} onSelect - Callback when test set is selected
 */
export function renderTestSetMenu(testSets, container, onSelect) {
  const setsHtml = testSets.map(set => `
    <button class="test-set-btn" data-set-number="${set.setNumber}">
      Set ${set.setNumber}
      <span class="question-count">${set.questionCount || set.questions?.length || 0} questions</span>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="test-set-menu">
      <h2>${UI_TEXT.SELECT_TEST_TITLE}</h2>
      <div class="test-sets-grid">
        ${setsHtml}
      </div>
    </div>
  `;

  container.querySelectorAll('.test-set-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const setNumber = parseInt(e.currentTarget.dataset.setNumber);
      const testSet = testSets.find(s => s.setNumber === setNumber);
      if (testSet) {
        onSelect(testSet);
      }
    });
  });
}

/**
 * Shows loading message
 * @param {HTMLElement} container - Container element
 */
export function showLoading(container) {
  container.innerHTML = `<div class="loading">${UI_TEXT.LOADING}</div>`;
}

/**
 * Shows error message
 * @param {HTMLElement} container - Container element
 * @param {Error} error - Error object
 */
export function showError(container, error) {
  container.innerHTML = `
    <div class="error">
      <p>${UI_TEXT.ERROR_LOADING}</p>
      <p class="error-details">${error.message}</p>
    </div>
  `;
}
