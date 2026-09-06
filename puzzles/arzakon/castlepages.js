function getQuestionStats(storageKey) {
  const defaults = {
    answeredWithHint: 0,
    answeredWithoutHint: 0,
    incorrect: 0,
    unanswered: 30,
  };

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return defaults;
    }

    const state = JSON.parse(raw);
    const questions = Array.isArray(state && state.questions)
      ? state.questions
      : [];

    return questions.reduce(
      (stats, question) => {
        const isAnswered = question && question.answered === true;
        const hasHint = question && question.hintRevealed === true;
        const isIncorrect =
          isAnswered &&
          (question.scored === false ||
            question.scored === 0 ||
            question.scored === "0");

        if (isAnswered) {
          stats.unanswered -= 1;
          const isScored =
            question.scored !== false &&
            question.scored !== 0 &&
            question.scored !== "0";

          if (isScored) {
            if (hasHint) {
              stats.answeredWithHint += 1;
            } else {
              stats.answeredWithoutHint += 1;
            }
          }

          if (isIncorrect) {
            stats.incorrect += 1;
          }
        }

        return stats;
      },
      { ...defaults },
    );
  } catch (e) {
    return defaults;
  }
}

function formatStats(stats) {
  return [
    `Answered Without Hint: ${stats.answeredWithoutHint}`,
    `Answered With Hint: ${stats.answeredWithHint}`,
    `Incorrect: ${stats.incorrect}`,
    `Unanswered: ${stats.unanswered}`,
  ]
    .map((stat) => `<div>${stat}</div>`)
    .join("");
}

function updateStatsForElement(storageKey, elementId) {
  const el = document.getElementById(elementId);
  if (!el) {
    return;
  }

  const stats = getQuestionStats(storageKey);
  el.innerHTML = formatStats(stats);
}

function updateGroupStats(group) {
  group.tests.forEach((test) => {
    updateStatsForElement(test.storageKey, test.elementId);
  });
}

function updateAllStats() {
  groupConfigs.forEach(updateGroupStats);
}
