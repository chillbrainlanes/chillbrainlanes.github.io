console.log(localStorage.getItem("quizSharedScore"));
const SCORE_KEY = "quizSharedScore";
let score = 0;
function updateScore() {
  document.querySelector("#score .score-value").textContent = score;
  updateStats();
}
function updateStats() {
  const state = getState();
  let total = 0;
  let answeredWithoutHint = 0;
  let answeredWithHint = 0;
  let incorrect = 0;
  let unanswered = 0;
  if (state?.questions?.length) {
    total = state.questions.length;
    state.questions.forEach((question) => {
      const answered = question.answered === true;
      const scored = question.scored === true;
      const hintRevealed = question.hintRevealed === true;
      if (!answered) {
        unanswered++;
      } else {
        if (hintRevealed && scored) {
          answeredWithHint++;
        } else if (!hintRevealed && scored) {
          answeredWithoutHint++;
        }
        if (!scored) {
          incorrect++;
        }
      }
    });
  } else {
    const questions = document.querySelectorAll(".question");
    total = questions.length;
    questions.forEach((container) => {
      const answered = container.dataset.answered === "true";
      const scored = container.dataset.scored === "true";
      const hintRevealed = container.dataset.hintRevealed === "true";
      if (!answered) {
        unanswered++;
      } else {
        if (hintRevealed && scored) {
          answeredWithHint++;
        } else if (!hintRevealed && scored) {
          answeredWithoutHint++;
        }
        if (!scored) {
          incorrect++;
        }
      }
    });
  }
  const scoreBox = document.getElementById("score");
  scoreBox.querySelector(".total-count").textContent = total;
  scoreBox.querySelector(".without-hint-count").textContent =
    answeredWithoutHint;
  scoreBox.querySelector(".with-hint-count").textContent = answeredWithHint;
  scoreBox.querySelector(".incorrect-count").textContent = incorrect;
  scoreBox.querySelector(".unanswered-count").textContent = unanswered;
}
function getContainer(button) {
  return button.closest(".question");
}
function getAnswer(container) {
  return container.getAttribute("data-answer");
}
function getInputs(container) {
  return Array.from(container.querySelectorAll(".letter-box"));
}
function getHintText(container) {
  return container.querySelector(".hint-text");
}
function hideQuestionButtons(container) {
  container.querySelectorAll(".controls button").forEach((button) => {
    button.style.display = "none";
  });
}
function fillBoxes(container, answer) {
  const inputs = getInputs(container);
  let inputIndex = 0;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === " ") continue;
    const input = inputs[inputIndex++];
    if (input) input.value = answer[i];
  }
}
function revealHint(button) {
  const container = getContainer(button);
  container.dataset.hintRevealed = "true";
  const hintText = getHintText(container);
  if (hintText) {
    hintText.classList.add("visible");
  }
  saveState();
}
function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveScore() {
  localStorage.setItem(SCORE_KEY, String(score));
}
function restoreScore() {
  const rawScore = localStorage.getItem(SCORE_KEY);
  if (rawScore !== null) {
    score = Number(rawScore) || 0;
  }
}
function saveState() {
  const questions = document.querySelectorAll(".question");
  const state = {
    score,
    questions: Array.from(questions).map((container) => {
      return {
        inputs: getInputs(container).map((input) => input.value || ""),
        answered: container.dataset.answered === "true",
        scored: container.dataset.scored === "true",
        hintRevealed: container.dataset.hintRevealed === "true",
      };
    }),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveScore();
  updateStats();
}
function restoreState() {
  const state = getState();
  restoreScore();
  updateScore();
  if (!state) return;
  const questions = document.querySelectorAll(".question");
  questions.forEach((container, index) => {
    const savedQuestion = state.questions?.[index];
    if (!savedQuestion) return;
    const inputs = getInputs(container);
    savedQuestion.inputs.forEach((value, idx) => {
      if (inputs[idx]) inputs[idx].value = value;
    });
    container.dataset.answered = savedQuestion.answered ? "true" : "false";
    container.dataset.scored = savedQuestion.scored ? "true" : "false";
    container.dataset.hintRevealed = savedQuestion.hintRevealed
      ? "true"
      : "false";
    if (savedQuestion.hintRevealed) {
      const hintText = getHintText(container);
      if (hintText) {
        hintText.classList.add("visible");
      }
    }
    if (savedQuestion.scored) {
      container.classList.add("highlight-correct");
    } else if (savedQuestion.answered) {
      container.classList.add("highlight-wrong");
    }
    if (savedQuestion.answered) {
      hideQuestionButtons(container);
    }
  });
  updateStats();
}
function checkAnswer(button) {
  const container = getContainer(button);
  const answer = getAnswer(container);
  const inputs = getInputs(container);
  const typed = inputs
    .map((input) => input.value || "")
    .join("")
    .toUpperCase();
  const target = answer.replace(/ /g, "");
  const hasScored = container.dataset.scored === "true";
  const usedHint = container.dataset.hintRevealed === "true";
  const points = usedHint ? 1 : 2;
  container.dataset.answered = "true";
  if (typed === target) {
    if (!hasScored) {
      score += points;
      container.dataset.scored = "true";
      updateScore();
    }
    container.classList.remove("highlight-wrong");
    container.classList.add("highlight-correct");
  } else {
    container.classList.remove("highlight-correct");
    container.classList.add("highlight-wrong");
    fillBoxes(container, answer);
  }
  hideQuestionButtons(container);
  saveState();
}
function giveUp(button) {
  const container = getContainer(button);
  const answer = getAnswer(container);
  container.dataset.answered = "true";
  container.classList.remove("highlight-correct");
  container.classList.add("highlight-wrong");
  fillBoxes(container, answer);
  hideQuestionButtons(container);
  saveState();
}
document.querySelectorAll(".letter-box").forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.toUpperCase().slice(-1);
    const container = input.closest(".question");
    saveState();
    if (input.value) {
      const inputs = getInputs(container);
      const idx = inputs.indexOf(input);
      if (idx >= 0 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
        inputs[idx + 1].setSelectionRange(0, 1);
      }
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value) {
      const container = input.closest(".question");
      const inputs = getInputs(container);
      const idx = inputs.indexOf(input);
      if (idx > 0) {
        const prev = inputs[idx - 1];
        prev.focus();
        prev.value = "";
        saveState();
      }
    }
  });
});
restoreState();

window.checkAnswer = checkAnswer;
window.giveUp = giveUp;
window.revealHint = revealHint;
