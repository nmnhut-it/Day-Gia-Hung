/**
 * Game Engine for English Grammar Games
 * Core orchestrator that manages game state, scoring, timer, and exercise flow
 */

const GameEngine = {
  // Constants
  POINTS_PER_QUESTION: 10,
  COMBO_MULTIPLIER: 1.5,
  TIME_BONUS_THRESHOLD: 5000,
  TIME_BONUS_POINTS: 5,
  HINT_PENALTY: 2,

  // State
  state: {
    unitId: null,
    unitData: null,
    currentExerciseIndex: 0,
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    comboCount: 0,
    hintsUsed: 0,
    startTime: null,
    questionStartTime: null,
    isPlaying: false,
    completed: false,
    answerHistory: [], // Track all answers for summary
    timeBonusEarned: 0,
    comboBonusEarned: 0
  },

  // Exercise type handlers (populated dynamically)
  exerciseHandlers: {},

  /**
   * Initialize game with unit data
   * @param {Object} unitData - Unit data from JSON
   * @param {string} unitId - Unit ID
   */
  init(unitData, unitId) {
    this.state = {
      unitId: unitId,
      unitData: unitData,
      currentExerciseIndex: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: this.calculateTotalQuestions(unitData.exercises),
      comboCount: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      questionStartTime: Date.now(),
      isPlaying: true,
      completed: false,
      answerHistory: [],
      timeBonusEarned: 0,
      comboBonusEarned: 0
    };

    this.updateUI();
    this.renderCurrentExercise();
  },

  /**
   * Calculate total number of questions across all exercises
   * @param {Array} exercises - Array of exercise objects
   * @returns {number} - Total question count
   */
  calculateTotalQuestions(exercises) {
    return exercises.reduce((total, exercise) => {
      if (exercise.type === 'fill-blank-table') {
        return total + exercise.rows.length;
      } else if (exercise.type === 'dialogue-complete') {
        return total + exercise.lines.filter(line => line.blank).length;
      } else if (exercise.type === 'open-ended') {
        return total;
      } else {
        return total + 1;
      }
    }, 0);
  },

  /**
   * Register exercise type handler
   * @param {string} typeName - Exercise type name
   * @param {Object} handler - Exercise handler object
   */
  registerExerciseHandler(typeName, handler) {
    this.exerciseHandlers[typeName] = handler;
  },

  /**
   * Render current exercise
   */
  renderCurrentExercise() {
    const exercise = this.getCurrentExercise();
    if (!exercise) {
      this.completeGame();
      return;
    }

    const container = document.getElementById('exercise-container');
    if (!container) {
      console.error('Exercise container not found');
      return;
    }

    container.innerHTML = '';

    const handler = this.exerciseHandlers[exercise.type];
    if (!handler) {
      console.error(`No handler found for exercise type: ${exercise.type}`);
      return;
    }

    this.questionStartTime = Date.now();

    const callbacks = {
      onAnswer: (userAnswer) => this.handleAnswer(userAnswer, exercise),
      onHint: () => this.handleHint(exercise)
    };

    handler.render(exercise, container, callbacks);
  },

  /**
   * Get current exercise
   * @returns {Object|null} - Current exercise object
   */
  getCurrentExercise() {
    const exercises = this.state.unitData?.exercises;
    if (!exercises || this.state.currentExerciseIndex >= exercises.length) {
      return null;
    }
    return exercises[this.state.currentExerciseIndex];
  },

  /**
   * Handle user answer submission
   * @param {string|Array} userAnswer - User's answer
   * @param {Object} exercise - Exercise object
   */
  handleAnswer(userAnswer, exercise) {
    if (!this.state.isPlaying) return;

    const handler = this.exerciseHandlers[exercise.type];
    if (!handler) return;

    const isCorrect = handler.validate(userAnswer, exercise);
    const container = document.getElementById('exercise-container');

    const answerRecord = {
      questionId: exercise.id,
      questionText: exercise.question || exercise.title || `Câu ${exercise.id}`,
      userAnswer: userAnswer,
      correctAnswer: exercise.answer || exercise.options?.[exercise.correctIndex],
      isCorrect: isCorrect,
      exercise: exercise,
      timeSpent: Date.now() - this.questionStartTime,
      points: 0
    };

    if (isCorrect) {
      const points = this.handleCorrectAnswer(exercise);
      answerRecord.points = points;
      handler.showFeedback(container, true, exercise);
      Utils.playSound('correct');

      setTimeout(() => {
        this.nextExercise();
      }, 1500);
    } else {
      this.handleWrongAnswer();
      answerRecord.points = 0;
      handler.showFeedback(container, false, exercise);
      Utils.playSound('wrong');

      setTimeout(() => {
        this.nextExercise();
      }, 3000);
    }

    this.state.answerHistory.push(answerRecord);
    this.updateUI();
  },

  /**
   * Handle correct answer
   * @param {Object} exercise - Exercise object
   * @returns {number} - Points earned
   */
  handleCorrectAnswer(exercise) {
    this.state.correctAnswers++;
    this.state.comboCount++;

    let points = exercise.points || this.POINTS_PER_QUESTION;
    let timeBonus = 0;
    let comboBonus = 0;

    const questionTime = Date.now() - this.questionStartTime;
    if (questionTime < this.TIME_BONUS_THRESHOLD) {
      timeBonus = this.TIME_BONUS_POINTS;
      points += timeBonus;
      this.state.timeBonusEarned += timeBonus;
    }

    if (this.state.comboCount >= 3) {
      const bonusPoints = Math.floor(points * (this.COMBO_MULTIPLIER - 1));
      comboBonus = bonusPoints;
      points = Math.floor(points * this.COMBO_MULTIPLIER);
      this.state.comboBonusEarned += comboBonus;
    }

    this.state.score += points;
    return points;
  },

  /**
   * Handle wrong answer
   */
  handleWrongAnswer() {
    this.state.comboCount = 0;
  },

  /**
   * Handle hint request
   * @param {Object} exercise - Exercise object
   */
  handleHint(exercise) {
    if (!exercise.hints || exercise.hints.length === 0) {
      Utils.showToast('No hints available for this question', 'info');
      return;
    }

    const hintIndex = this.state.hintsUsed % exercise.hints.length;
    const hint = exercise.hints[hintIndex];

    Utils.showToast(hint, 'info', 5000);
    this.state.hintsUsed++;
    this.state.score = Math.max(0, this.state.score - this.HINT_PENALTY);
    this.updateUI();
  },

  /**
   * Move to next exercise
   */
  nextExercise() {
    this.state.currentExerciseIndex++;
    this.renderCurrentExercise();
    this.updateUI();
  },

  /**
   * Complete the game
   */
  completeGame() {
    this.state.isPlaying = false;
    this.state.completed = true;

    const timeSpent = Math.floor((Date.now() - this.state.startTime) / 1000);
    const percentage = Utils.calculatePercentage(
      this.state.correctAnswers,
      this.state.totalQuestions
    );
    const stars = Utils.getStarRating(percentage);

    const progressData = {
      score: this.state.score,
      correctAnswers: this.state.correctAnswers,
      totalQuestions: this.state.totalQuestions,
      stars: stars,
      completed: true,
      timeSpent: timeSpent
    };

    Storage.saveUnitProgress(this.state.unitId, progressData);

    this.showCompletionScreen(percentage, stars, timeSpent);
    Utils.playSound('complete');
  },

  /**
   * Show completion screen
   * @param {number} percentage - Score percentage
   * @param {number} stars - Number of stars earned
   * @param {number} timeSpent - Time spent in seconds
   */
  showCompletionScreen(percentage, stars, timeSpent) {
    const container = document.getElementById('exercise-container');
    if (!container) return;

    container.innerHTML = '';

    // Main completion card
    const completionCard = Utils.createElement('div', {
      class: 'card completion-card fade-in'
    });

    // Title and stars
    const title = Utils.createElement('h2', { class: 'completion__title' }, '🎉 CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH!');

    const starsContainer = Utils.createElement('div', { class: 'stars completion__stars' });
    for (let i = 0; i < 3; i++) {
      const star = Utils.createElement('span', {
        class: i < stars ? 'star star--filled star--animating' : 'star'
      }, '★');
      starsContainer.appendChild(star);
    }

    // Score summary section
    const summarySection = Utils.createElement('div', { class: 'completion__summary' });
    summarySection.innerHTML = `
      <h3 class="completion__section-title">BẢNG ĐIỂM CHI TIẾT</h3>
      <div class="summary__grid">
        <div class="summary__item summary__item--highlight">
          <span class="summary__label">Tổng điểm</span>
          <span class="summary__value">⭐ ${this.state.score} điểm</span>
        </div>
        <div class="summary__item">
          <span class="summary__label">Số câu đúng</span>
          <span class="summary__value">${this.state.correctAnswers}/${this.state.totalQuestions} (${percentage}%)</span>
        </div>
        <div class="summary__item">
          <span class="summary__label">Thời gian</span>
          <span class="summary__value">${Utils.formatTime(timeSpent)}</span>
        </div>
        <div class="summary__item">
          <span class="summary__label">Gợi ý sử dụng</span>
          <span class="summary__value">${this.state.hintsUsed} (-${this.state.hintsUsed * this.HINT_PENALTY} điểm)</span>
        </div>
        <div class="summary__item summary__item--bonus">
          <span class="summary__label">Điểm thưởng combo</span>
          <span class="summary__value">+${this.state.comboBonusEarned} điểm</span>
        </div>
        <div class="summary__item summary__item--bonus">
          <span class="summary__label">Điểm thưởng thời gian</span>
          <span class="summary__value">+${this.state.timeBonusEarned} điểm</span>
        </div>
      </div>
    `;

    // Answer history table
    const historySection = this.createAnswerHistoryTable();

    // Corrections section (wrong answers only)
    const correctionsSection = this.createCorrectionsSection();

    // Action buttons
    const buttonContainer = Utils.createElement('div', {
      class: 'completion__actions'
    });

    const retryBtn = Utils.createElement('button', {
      class: 'btn btn--primary'
    }, '🔄 Làm lại');
    retryBtn.onclick = () => this.restart();

    const printBtn = Utils.createElement('button', {
      class: 'btn btn--secondary'
    }, '🖨️ In kết quả');
    printBtn.onclick = () => window.print();

    const homeBtn = Utils.createElement('button', {
      class: 'btn btn--secondary'
    }, '🏠 Về trang chủ');
    homeBtn.onclick = () => window.location.href = '../index.html';

    buttonContainer.appendChild(retryBtn);
    buttonContainer.appendChild(printBtn);
    buttonContainer.appendChild(homeBtn);

    // Assemble card
    completionCard.appendChild(title);
    completionCard.appendChild(starsContainer);
    completionCard.appendChild(summarySection);
    completionCard.appendChild(historySection);
    if (correctionsSection) {
      completionCard.appendChild(correctionsSection);
    }
    completionCard.appendChild(buttonContainer);

    container.appendChild(completionCard);
  },

  /**
   * Create answer history table
   * @returns {HTMLElement} - History table element
   */
  createAnswerHistoryTable() {
    const section = Utils.createElement('div', { class: 'completion__history' });
    section.innerHTML = '<h3 class="completion__section-title">CHI TIẾT CÂU TRẢ LỜI</h3>';

    const table = Utils.createElement('table', { class: 'history-table' });
    table.innerHTML = `
      <thead>
        <tr>
          <th>Câu</th>
          <th>Câu trả lời của bạn</th>
          <th>Đáp án đúng</th>
          <th>Kết quả</th>
          <th>Điểm</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    this.state.answerHistory.forEach((record, index) => {
      const row = tbody.insertRow();
      row.className = record.isCorrect ? 'history-row--correct' : 'history-row--wrong';

      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="history-cell--answer">${this.formatAnswer(record.userAnswer)}</td>
        <td class="history-cell--correct">${this.formatAnswer(record.correctAnswer)}</td>
        <td class="history-cell--status">${record.isCorrect ? '✓ Đúng' : '✗ Sai'}</td>
        <td class="history-cell--points">${record.points} điểm</td>
      `;
    });

    section.appendChild(table);
    return section;
  },

  /**
   * Create corrections section for wrong answers
   * @returns {HTMLElement|null} - Corrections section or null
   */
  createCorrectionsSection() {
    const wrongAnswers = this.state.answerHistory.filter(r => !r.isCorrect);
    if (wrongAnswers.length === 0) return null;

    const section = Utils.createElement('div', { class: 'completion__corrections' });
    section.innerHTML = `<h3 class="completion__section-title">CÂU SAI CẦN XEM LẠI (${wrongAnswers.length} câu)</h3>`;

    wrongAnswers.forEach((record, index) => {
      const correctionCard = Utils.createElement('div', { class: 'correction-item' });
      correctionCard.innerHTML = `
        <div class="correction__question">
          <strong>Câu ${this.state.answerHistory.indexOf(record) + 1}:</strong> ${record.questionText}
        </div>
        <div class="correction__answer correction__answer--wrong">
          ❌ Câu trả lời của bạn: <strong>${this.formatAnswer(record.userAnswer)}</strong>
        </div>
        <div class="correction__answer correction__answer--correct">
          ✓ Đáp án đúng: <strong>${this.formatAnswer(record.correctAnswer)}</strong>
        </div>
        ${record.exercise.explanation ? `
          <div class="correction__explanation">
            💡 Giải thích: ${record.exercise.explanation}
          </div>
        ` : ''}
      `;
      section.appendChild(correctionCard);
    });

    return section;
  },

  /**
   * Format answer for display
   * @param {any} answer - Answer to format
   * @returns {string} - Formatted answer
   */
  formatAnswer(answer) {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    if (typeof answer === 'object' && answer !== null) {
      return JSON.stringify(answer);
    }
    return String(answer || '(không trả lời)');
  },

  /**
   * Restart game
   */
  restart() {
    this.init(this.state.unitData, this.state.unitId);
  },

  /**
   * Update UI elements (score, progress, etc.)
   */
  updateUI() {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = `⭐ ${this.state.score}`;
    }

    const progressElement = document.getElementById('progress-count');
    if (progressElement) {
      progressElement.textContent = `${this.state.currentExerciseIndex + 1} / ${this.state.unitData.exercises.length}`;
    }

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const progress = Utils.calculatePercentage(
        this.state.currentExerciseIndex,
        this.state.unitData.exercises.length
      );
      progressBar.style.width = `${progress}%`;
    }

    const comboElement = document.getElementById('combo-count');
    if (comboElement) {
      comboElement.textContent = this.state.comboCount;
      comboElement.style.display = this.state.comboCount >= 3 ? 'inline' : 'none';
    }
  },

  /**
   * Get current game state
   * @returns {Object} - Current state
   */
  getState() {
    return { ...this.state };
  },

  /**
   * Pause game
   */
  pause() {
    this.state.isPlaying = false;
  },

  /**
   * Resume game
   */
  resume() {
    this.state.isPlaying = true;
    this.questionStartTime = Date.now();
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameEngine;
}
