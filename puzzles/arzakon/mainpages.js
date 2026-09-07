const groupConfigs = [
  {
    totalElementId: "wTotalStats",
    pointsPerTier: 10,
    tests: [
      { elementId: "w1Stats", storageKey: "W1State" },
      { elementId: "w2Stats", storageKey: "W2State" },
      { elementId: "w3Stats", storageKey: "W3State" },
    ],
  },
  {
    totalElementId: "uTotalStats",
    pointsPerTier: 10,
    tests: [
      { elementId: "u1Stats", storageKey: "U1State" },
      { elementId: "u2Stats", storageKey: "U2State" },
      { elementId: "u3Stats", storageKey: "U3State" },
    ],
  },
  {
    totalElementId: "bTotalStats",
    pointsPerTier: 10,
    tests: [
      { elementId: "b1Stats", storageKey: "B1State" },
      { elementId: "b2Stats", storageKey: "B2State" },
      { elementId: "b3Stats", storageKey: "B3State" },
    ],
  },
  {
    totalElementId: "rTotalStats",
    pointsPerTier: 10,
    tests: [
      { elementId: "r1Stats", storageKey: "R1State" },
      { elementId: "r2Stats", storageKey: "R2State" },
      { elementId: "r3Stats", storageKey: "R3State" },
    ],
  },
  {
    totalElementId: "gTotalStats",
    pointsPerTier: 10,
    tests: [
      { elementId: "g1Stats", storageKey: "G1State" },
      { elementId: "g2Stats", storageKey: "G2State" },
      { elementId: "g3Stats", storageKey: "G3State" },
    ],
  },
];

function clearData() {
  [
    "W1State",
    "W2State",
    "W3State",
    "U1State",
    "U2State",
    "U3State",
    "B1State",
    "B2State",
    "B3State",
    "R1State",
    "R2State",
    "R3State",
    "G1State",
    "G2State",
    "G3State",
    "quizSharedScore",
    "game_complete",
  ].forEach((storageKey) => localStorage.removeItem(storageKey));
  updateScore();
  updateAllStats();
}

function updateScore() {
  const el = document.getElementById("score");
  try {
    const raw = localStorage.getItem("quizSharedScore");
    const display = raw === null ? "0" : raw;
    el.textContent = display;
  } catch (e) {
    el.textContent = "Unable to load score";
  }
}

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
  return `Answered Without Hint: ${stats.answeredWithoutHint}\nAnswered With Hint: ${stats.answeredWithHint}\nIncorrect: ${stats.incorrect}\nUnanswered: ${stats.unanswered}`;
}

function getGroupScore(statsList, pointsPerTier) {
  return statsList.reduce(
    (score, stats, index) =>
      score +
      stats.answeredWithHint * pointsPerTier * (index + 1) +
      stats.answeredWithoutHint * pointsPerTier * 2 * (index + 1),
    0,
  );
}

function sumStats(statsList) {
  const defaults = {
    answeredWithHint: 0,
    answeredWithoutHint: 0,
    incorrect: 0,
    unanswered: 0,
  };

  return statsList.reduce(
    (total, stats) => {
      total.answeredWithHint += stats.answeredWithHint;
      total.answeredWithoutHint += stats.answeredWithoutHint;
      total.incorrect += stats.incorrect;
      total.unanswered += stats.unanswered;
      return total;
    },
    { ...defaults },
  );
}

function updateStatsForElement(storageKey, elementId) {
  const el = document.getElementById(elementId);
  if (!el) {
    return;
  }

  const stats = getQuestionStats(storageKey);
  el.textContent = formatStats(stats);
}

function updateGroupStats(group) {
  const statsList = group.tests.map((test) =>
    getQuestionStats(test.storageKey),
  );
  const totalStats = sumStats(statsList);
  const totalEl = document.getElementById(group.totalElementId);
  if (totalEl) {
    const totalScore = getGroupScore(statsList, group.pointsPerTier);
    totalEl.textContent = `${formatStats(totalStats)}\nCastle Score: ${totalScore}`;
  }

  group.tests.forEach((test) => {
    updateStatsForElement(test.storageKey, test.elementId);
  });
}

function updateAllStats() {
  groupConfigs.forEach(updateGroupStats);
}
