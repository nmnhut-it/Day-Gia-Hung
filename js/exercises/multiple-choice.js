/**
 * Multiple Choice Exercise Type
 * Select correct answer from multiple options
 */

const MultipleChoiceExercise = {
  render(question, container, callbacks) {
    container.innerHTML = '';

    const exerciseCard = Utils.createElement('div', { class: 'card exercise' });

    const exerciseNum = Utils.createElement('span', {
      class: 'exercise__number'
    }, `Exercise ${question.id}`);

    const questionText = Utils.createElement('div', {
      class: 'exercise__question'
    }, question.question);

    const choiceList = Utils.createElement('ul', { class: 'choice-list' });

    question.options.forEach((option, index) => {
      const choiceItem = Utils.createElement('li', { class: 'choice-item' });

      const choiceLabel = Utils.createElement('label', { class: 'choice-label' });

      const radioInput = Utils.createElement('input', {
        type: 'radio',
        name: `question-${question.id}`,
        value: index,
        class: 'choice-input',
        id: `choice-${question.id}-${index}`
      });

      radioInput.addEventListener('change', () => {
        const labels = choiceList.querySelectorAll('.choice-label');
        labels.forEach(lbl => lbl.classList.remove('choice-label--selected'));
        choiceLabel.classList.add('choice-label--selected');
      });

      const choiceText = Utils.createElement('span', {
        class: 'choice-text'
      }, option);

      choiceLabel.appendChild(radioInput);
      choiceLabel.appendChild(choiceText);
      choiceItem.appendChild(choiceLabel);
      choiceList.appendChild(choiceItem);
    });

    const actions = Utils.createElement('div', { class: 'exercise__actions' });

    const submitBtn = Utils.createElement('button', {
      class: 'btn btn--primary'
    }, 'Nộp bài');

    submitBtn.onclick = () => {
      const selected = choiceList.querySelector('input[type="radio"]:checked');
      if (!selected) {
        Utils.showToast('Vui lòng chọn một câu trả lời', 'error');
        return;
      }
      callbacks.onAnswer(parseInt(selected.value));
    };

    const hintBtn = Utils.createElement('button', {
      class: 'btn btn--secondary btn--small'
    }, '💡 Gợi ý');

    hintBtn.onclick = () => callbacks.onHint();

    actions.appendChild(submitBtn);
    if (question.hints && question.hints.length > 0) {
      actions.appendChild(hintBtn);
    }

    exerciseCard.appendChild(exerciseNum);
    exerciseCard.appendChild(questionText);
    exerciseCard.appendChild(choiceList);
    exerciseCard.appendChild(actions);

    container.appendChild(exerciseCard);
  },

  validate(userAnswer, question) {
    return userAnswer === question.correctIndex;
  },

  getUserAnswer(container) {
    const selected = container.querySelector('input[type="radio"]:checked');
    return selected ? parseInt(selected.value) : null;
  },

  showFeedback(container, isCorrect, question, nextCallback) {
    const actions = container.querySelector('.exercise__actions');
    const inputs = container.querySelectorAll('input[type="radio"]');

    inputs.forEach(input => input.disabled = true);

    const feedbackDiv = Utils.createElement('div', {
      class: isCorrect ? 'feedback feedback--success' : 'feedback feedback--error'
    });

    if (isCorrect) {
      feedbackDiv.innerHTML = `
        <span class="feedback__icon">✓</span>
        <span>Đúng rồi! ${question.explanation || 'Giỏi lắm!'}</span>
      `;
    } else {
      const correctAnswer = question.options[question.correctIndex];
      feedbackDiv.innerHTML = `
        <span class="feedback__icon">✗</span>
        <div>
          <div>Chưa đúng.</div>
          <div class="feedback__correct-answer">Đáp án đúng: <strong>${correctAnswer}</strong></div>
          ${question.explanation ? `<div class="mt-1">${question.explanation}</div>` : ''}
        </div>
      `;
    }

    actions.insertAdjacentElement('afterend', feedbackDiv);

    const buttons = actions.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    // Add Next button
    if (nextCallback) {
      const nextBtn = Utils.createElement('button', {
        class: 'btn btn--primary mt-2'
      }, 'Câu tiếp theo →');

      nextBtn.onclick = nextCallback;
      feedbackDiv.appendChild(nextBtn);
    }
  },

  reset(container) {
    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
      input.checked = false;
      input.disabled = false;
    });

    const labels = container.querySelectorAll('.choice-label');
    labels.forEach(lbl => lbl.classList.remove('choice-label--selected'));

    const feedback = container.querySelector('.feedback');
    if (feedback) feedback.remove();

    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = false);
  }
};

if (typeof GameEngine !== 'undefined') {
  GameEngine.registerExerciseHandler('multiple-choice', MultipleChoiceExercise);
}
