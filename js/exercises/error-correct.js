/**
 * Error Correct Exercise Type
 * Find and fix grammatical errors
 */

const ErrorCorrectExercise = {
  render(question, container, callbacks) {
    container.innerHTML = '';

    const exerciseCard = Utils.createElement('div', { class: 'card exercise' });

    const exerciseNum = Utils.createElement('span', {
      class: 'exercise__number'
    }, `Exercise ${question.id}`);

    const instructions = Utils.createElement('div', {
      class: 'exercise__instructions'
    }, 'Find and correct the mistake in this sentence');

    const wrongSentence = Utils.createElement('div', {
      class: 'exercise__question'
    });
    wrongSentence.innerHTML = `<strong>Wrong:</strong> ${question.wrongSentence}`;

    const inputLabel = Utils.createElement('label', {
      class: 'mb-1'
    }, 'Correct sentence:');

    const textarea = Utils.createElement('textarea', {
      class: 'input',
      id: `answer-${question.id}`,
      placeholder: 'Write the corrected sentence here...',
      rows: 2
    });

    const actions = Utils.createElement('div', { class: 'exercise__actions' });

    const submitBtn = Utils.createElement('button', {
      class: 'btn btn--primary'
    }, 'Submit Answer');

    submitBtn.onclick = () => {
      const userAnswer = textarea.value.trim();
      if (Utils.isEmpty(userAnswer)) {
        Utils.showToast('Please write the corrected sentence', 'error');
        return;
      }
      callbacks.onAnswer(userAnswer);
    };

    const hintBtn = Utils.createElement('button', {
      class: 'btn btn--secondary btn--small'
    }, '💡 Hint');

    hintBtn.onclick = () => callbacks.onHint();

    actions.appendChild(submitBtn);
    if (question.hints && question.hints.length > 0) {
      actions.appendChild(hintBtn);
    }

    exerciseCard.appendChild(exerciseNum);
    exerciseCard.appendChild(instructions);
    exerciseCard.appendChild(wrongSentence);
    exerciseCard.appendChild(inputLabel);
    exerciseCard.appendChild(textarea);
    exerciseCard.appendChild(actions);

    container.appendChild(exerciseCard);

    textarea.focus();
  },

  validate(userAnswer, question) {
    return Utils.compareAnswers(userAnswer, question.correctSentence);
  },

  getUserAnswer(container) {
    const textarea = container.querySelector('textarea');
    return textarea ? textarea.value.trim() : '';
  },

  showFeedback(container, isCorrect, question) {
    const textarea = container.querySelector('textarea');
    const actions = container.querySelector('.exercise__actions');

    if (textarea) textarea.disabled = true;

    const feedbackDiv = Utils.createElement('div', {
      class: isCorrect ? 'feedback feedback--success' : 'feedback feedback--error'
    });

    if (isCorrect) {
      if (textarea) textarea.classList.add('correct-answer');
      feedbackDiv.innerHTML = `
        <span class="feedback__icon">✓</span>
        <div>
          <div>Correct!</div>
          ${question.explanation ? `<div class="mt-1"><small>${question.explanation}</small></div>` : ''}
        </div>
      `;
    } else {
      if (textarea) textarea.classList.add('wrong-answer');
      feedbackDiv.innerHTML = `
        <span class="feedback__icon">✗</span>
        <div>
          <div>Not quite right.</div>
          <div class="feedback__correct-answer">
            <strong>Error:</strong> ${question.errorWord} → <strong>Correction:</strong> ${question.correction}
          </div>
          <div class="feedback__correct-answer">
            <strong>Correct sentence:</strong> ${question.correctSentence}
          </div>
          ${question.explanation ? `<div class="mt-1"><small>${question.explanation}</small></div>` : ''}
        </div>
      `;
    }

    actions.insertAdjacentElement('afterend', feedbackDiv);

    const buttons = actions.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
  },

  reset(container) {
    const textarea = container.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.disabled = false;
      textarea.classList.remove('correct-answer', 'wrong-answer');
      textarea.focus();
    }

    const feedback = container.querySelector('.feedback');
    if (feedback) feedback.remove();

    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = false);
  }
};

if (typeof GameEngine !== 'undefined') {
  GameEngine.registerExerciseHandler('error-correct', ErrorCorrectExercise);
}
