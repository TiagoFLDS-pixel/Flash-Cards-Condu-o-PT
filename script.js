const STORAGE_KEY = "quiz-conducao-progress-v1";
const VALID_STATUSES = new Set(["right", "wrong"]);

const state = {
  progress: loadProgress(),
  sessionCards: [],
  currentIndex: 0,
  currentMode: "home",
  answered: false
};

const els = {
  homeView: document.getElementById("homeView"),
  studyView: document.getElementById("studyView"),
  groupsContainer: document.getElementById("groupsContainer"),
  totalMastered: document.getElementById("totalMastered"),
  totalProgressBar: document.getElementById("totalProgressBar"),
  randomModeBtn: document.getElementById("randomModeBtn"),
  reviewWrongBtn: document.getElementById("reviewWrongBtn"),
  resetProgressBtn: document.getElementById("resetProgressBtn"),
  backHomeBtn: document.getElementById("backHomeBtn"),
  studyModeLabel: document.getElementById("studyModeLabel"),
  cardCounter: document.getElementById("cardCounter"),
  cardStats: document.getElementById("cardStats"),
  cardGroupLabel: document.getElementById("cardGroupLabel"),
  questionText: document.getElementById("questionText"),
  optionsContainer: document.getElementById("optionsContainer"),
  feedbackBox: document.getElementById("feedbackBox"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  explanationText: document.getElementById("explanationText"),
  nextQuestionBtn: document.getElementById("nextQuestionBtn"),
  emptyState: document.getElementById("emptyState")
};

init();

function init() {
  renderHome();
  bindEvents();
}

function bindEvents() {
  els.randomModeBtn.addEventListener("click", () => startSession("random", getAllCards(true)));
  els.reviewWrongBtn.addEventListener("click", () => startSession("wrong", getCardsByStatus("wrong", true)));
  els.backHomeBtn.addEventListener("click", showHome);
  els.nextQuestionBtn.addEventListener("click", goToNextQuestion);
  els.resetProgressBtn.addEventListener("click", resetProgress);
}

function renderHome() {
  const allCards = getAllCards();
  const totalCards = allCards.length;
  const correct = allCards.filter(({ card }) => getCardStatus(card.id) === "right").length;
  const wrong = allCards.filter(({ card }) => getCardStatus(card.id) === "wrong").length;
  const attempts = allCards.reduce((sum, { card }) => sum + getQuestionProgress(card.id).attempts, 0);
  const percent = totalCards === 0 ? 0 : Math.round((correct / totalCards) * 100);

  els.totalMastered.textContent = `${correct}/${totalCards}`;
  els.totalProgressBar.style.width = `${percent}%`;
  els.groupsContainer.innerHTML = "";

  FLASHCARD_GROUPS.forEach((group) => {
    const total = group.cards.length;
    const right = group.cards.filter((card) => getCardStatus(card.id) === "right").length;
    const wrongCount = group.cards.filter((card) => getCardStatus(card.id) === "wrong").length;
    const groupAttempts = group.cards.reduce((sum, card) => sum + getQuestionProgress(card.id).attempts, 0);
    const groupPercent = total === 0 ? 0 : Math.round((right / total) * 100);

    const article = document.createElement("article");
    article.className = "group-card";
    article.innerHTML = `
      <h3>${group.title}</h3>
      <p>${group.description}</p>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" style="width: ${groupPercent}%"></div>
      </div>
      <div class="group-footer">
        <span class="group-progress">${right}/${total} certas · ${wrongCount} erradas · ${groupAttempts} tentativas</span>
        <button class="primary-button" type="button">Estudar</button>
      </div>
    `;

    article.querySelector("button").addEventListener("click", () => {
      startSession("group", group.cards.map((card) => ({ group, card })));
    });

    els.groupsContainer.appendChild(article);
  });

  els.reviewWrongBtn.disabled = wrong === 0;
  els.reviewWrongBtn.textContent = wrong === 0 ? "Rever erradas" : `Rever erradas (${wrong})`;
  els.cardStats.textContent = `${correct} certas · ${wrong} erradas · ${attempts} tentativas`;
}

function startSession(mode, cards) {
  state.currentMode = mode;
  state.sessionCards = Array.isArray(cards) ? cards : [];
  state.currentIndex = 0;
  state.answered = false;

  const labels = {
    group: "Grupo de estudo",
    random: "Modo aleatório",
    wrong: "Rever erradas"
  };

  els.studyModeLabel.textContent = labels[mode] || "Quiz";
  els.homeView.classList.remove("active");
  els.studyView.classList.add("active");
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const current = state.sessionCards[state.currentIndex];
  const total = state.sessionCards.length;

  els.emptyState.classList.toggle("hidden", total !== 0);
  els.nextQuestionBtn.classList.add("hidden");
  els.feedbackBox.className = "feedback-box hidden";
  els.feedbackTitle.textContent = "";
  els.explanationText.textContent = "";
  els.optionsContainer.innerHTML = "";
  state.answered = false;

  if (!current) {
    els.cardCounter.textContent = "0/0";
    els.cardStats.textContent = "0 certas · 0 erradas · 0 tentativas";
    els.cardGroupLabel.textContent = "";
    els.questionText.textContent = "Sem perguntas para rever";
    return;
  }

  const stats = getSessionStats();
  els.cardCounter.textContent = `${state.currentIndex + 1}/${total}`;
  els.cardStats.textContent = `${stats.right} certas · ${stats.wrong} erradas · ${stats.attempts} tentativas`;
  els.cardGroupLabel.textContent = `${current.card.categoria} · ${current.group.title}`;
  els.questionText.textContent = current.card.pergunta;
  els.nextQuestionBtn.textContent = state.currentIndex < total - 1 ? "Próxima pergunta" : "Terminar";

  current.card.opcoes.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => selectOption(option));
    els.optionsContainer.appendChild(button);
  });
}

function selectOption(selectedOption) {
  const current = state.sessionCards[state.currentIndex];
  if (!current || state.answered) return;

  const isCorrect = selectedOption === current.card.respostaCorreta;
  state.answered = true;
  saveAnswer(current.card.id, isCorrect);
  markOptions(selectedOption, current.card.respostaCorreta);
  showFeedback(isCorrect, current.card.explicacao);
  els.nextQuestionBtn.classList.remove("hidden");

  const stats = getSessionStats();
  els.cardStats.textContent = `${stats.right} certas · ${stats.wrong} erradas · ${stats.attempts} tentativas`;
}

function markOptions(selectedOption, correctOption) {
  Array.from(els.optionsContainer.children).forEach((button) => {
    button.disabled = true;

    if (button.textContent === correctOption) {
      button.classList.add("correct");
    }

    if (button.textContent === selectedOption && selectedOption !== correctOption) {
      button.classList.add("wrong");
    }
  });
}

function showFeedback(isCorrect, explanation) {
  els.feedbackBox.classList.remove("hidden", "correct", "wrong");
  els.feedbackBox.classList.add(isCorrect ? "correct" : "wrong");
  els.feedbackTitle.textContent = isCorrect ? "Resposta certa" : "Resposta errada";
  els.explanationText.textContent = explanation;
}

function goToNextQuestion() {
  if (state.currentIndex < state.sessionCards.length - 1) {
    state.currentIndex += 1;
    renderCurrentQuestion();
    return;
  }

  showHome();
}

function showHome() {
  els.studyView.classList.remove("active");
  els.homeView.classList.add("active");
  renderHome();
}

function resetProgress() {
  const confirmed = window.confirm("Quer mesmo reiniciar todo o progresso?");
  if (!confirmed) return;

  state.progress = {};
  saveProgress();
  renderHome();
  if (els.studyView.classList.contains("active")) {
    renderCurrentQuestion();
  }
}

function getAllCards(shuffled = false) {
  const cards = FLASHCARD_GROUPS.flatMap((group) => group.cards.map((card) => ({ group, card })));
  return shuffled ? shuffle(cards) : cards;
}

function getCardsByStatus(status, shuffled = false) {
  const cards = getAllCards().filter(({ card }) => getCardStatus(card.id) === status);
  return shuffled ? shuffle(cards) : cards;
}

function getCardStatus(cardId) {
  const status = getQuestionProgress(cardId).status;
  return VALID_STATUSES.has(status) ? status : "new";
}

function getQuestionProgress(cardId) {
  return normalizeQuestionProgress(state.progress[cardId]);
}

function getSessionStats() {
  return state.sessionCards.reduce(
    (acc, { card }) => {
      const progress = getQuestionProgress(card.id);
      if (progress.status === "right") acc.right += 1;
      if (progress.status === "wrong") acc.wrong += 1;
      acc.attempts += progress.attempts;
      return acc;
    },
    { right: 0, wrong: 0, attempts: 0 }
  );
}

function saveAnswer(cardId, isCorrect) {
  const current = getQuestionProgress(cardId);

  state.progress[cardId] = {
    status: isCorrect ? "right" : "wrong",
    attempts: current.attempts + 1,
    correctAnswers: current.correctAnswers + (isCorrect ? 1 : 0),
    wrongAnswers: current.wrongAnswers + (isCorrect ? 0 : 1),
    updatedAt: new Date().toISOString()
  };

  saveProgress();
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return normalizeProgress(raw ? JSON.parse(raw) : {});
  } catch (error) {
    console.warn("Não foi possível carregar o progresso.", error);
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch (error) {
    console.warn("Não foi possível guardar o progresso.", error);
  }
}

function normalizeProgress(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(progress).map(([cardId, value]) => [cardId, normalizeQuestionProgress(value)])
  );
}

function normalizeQuestionProgress(value) {
  if (!value || typeof value !== "object") {
    return {
      status: "new",
      attempts: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    };
  }

  const status = VALID_STATUSES.has(value.status) ? value.status : "new";
  const attempts = toSafeNumber(value.attempts);
  const correctAnswers = toSafeNumber(value.correctAnswers);
  const wrongAnswers = toSafeNumber(value.wrongAnswers);

  return {
    status,
    attempts,
    correctAnswers,
    wrongAnswers
  };
}

function toSafeNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0;
}

function shuffle(items) {
  const arr = [...items];
  for (let index = arr.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
  }
  return arr;
}
