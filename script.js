const STORAGE_KEY = "flashcards-conducao-progress-v1";
const VALID_STATUSES = new Set(["right", "wrong", "hard"]);

const state = {
  progress: loadProgress(),
  sessionCards: [],
  currentIndex: 0,
  currentMode: "home",
  answerVisible: false
};

const els = {
  homeView: document.getElementById("homeView"),
  studyView: document.getElementById("studyView"),
  groupsContainer: document.getElementById("groupsContainer"),
  totalMastered: document.getElementById("totalMastered"),
  totalProgressBar: document.getElementById("totalProgressBar"),
  randomModeBtn: document.getElementById("randomModeBtn"),
  reviewWrongBtn: document.getElementById("reviewWrongBtn"),
  reviewHardBtn: document.getElementById("reviewHardBtn"),
  resetProgressBtn: document.getElementById("resetProgressBtn"),
  backHomeBtn: document.getElementById("backHomeBtn"),
  studyModeLabel: document.getElementById("studyModeLabel"),
  cardCounter: document.getElementById("cardCounter"),
  cardStats: document.getElementById("cardStats"),
  cardGroupLabel: document.getElementById("cardGroupLabel"),
  questionText: document.getElementById("questionText"),
  answerBox: document.getElementById("answerBox"),
  answerText: document.getElementById("answerText"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  gradeButtons: document.getElementById("gradeButtons"),
  wrongBtn: document.getElementById("wrongBtn"),
  hardBtn: document.getElementById("hardBtn"),
  rightBtn: document.getElementById("rightBtn"),
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
  els.reviewHardBtn.addEventListener("click", () => startSession("hard", getCardsByStatus("hard", true)));
  els.backHomeBtn.addEventListener("click", showHome);
  els.showAnswerBtn.addEventListener("click", showAnswer);
  els.wrongBtn.addEventListener("click", () => gradeCurrentCard("wrong"));
  els.hardBtn.addEventListener("click", () => gradeCurrentCard("hard"));
  els.rightBtn.addEventListener("click", () => gradeCurrentCard("right"));
  els.resetProgressBtn.addEventListener("click", resetProgress);
}

function renderHome() {
  const allCards = getAllCards();
  const totalCards = allCards.length;
  const mastered = allCards.filter(({ card }) => getCardStatus(card.id) === "right").length;
  const percent = totalCards === 0 ? 0 : Math.round((mastered / totalCards) * 100);

  els.totalMastered.textContent = `${mastered}/${totalCards}`;
  els.totalProgressBar.style.width = `${percent}%`;
  els.groupsContainer.innerHTML = "";

  FLASHCARD_GROUPS.forEach((group) => {
    const total = group.cards.length;
    const right = group.cards.filter((card) => getCardStatus(card.id) === "right").length;
    const wrong = group.cards.filter((card) => getCardStatus(card.id) === "wrong").length;
    const hard = group.cards.filter((card) => getCardStatus(card.id) === "hard").length;
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
        <span class="group-progress">${right}/${total} dominadas · ${wrong} erradas · ${hard} difíceis</span>
        <button class="primary-button" type="button">Estudar</button>
      </div>
    `;

    article.querySelector("button").addEventListener("click", () => {
      startSession("group", group.cards.map((card) => ({ group, card })));
    });

    els.groupsContainer.appendChild(article);
  });
}

function startSession(mode, cards) {
  state.currentMode = mode;
  state.sessionCards = Array.isArray(cards) ? cards : [];
  state.currentIndex = 0;
  state.answerVisible = false;

  const labels = {
    group: "Grupo de estudo",
    random: "Modo aleatório",
    wrong: "Rever erradas",
    hard: "Rever difíceis"
  };

  els.studyModeLabel.textContent = labels[mode] || "Estudo";
  els.homeView.classList.remove("active");
  els.studyView.classList.add("active");
  renderCurrentCard();
}

function renderCurrentCard() {
  const current = state.sessionCards[state.currentIndex];
  const total = state.sessionCards.length;

  els.emptyState.classList.toggle("hidden", total !== 0);
  els.showAnswerBtn.classList.toggle("hidden", total === 0);
  els.gradeButtons.classList.add("hidden");
  els.answerBox.classList.add("hidden");
  state.answerVisible = false;

  if (!current) {
    els.cardCounter.textContent = "0/0";
    els.cardStats.textContent = "0 certas · 0 erradas · 0 difíceis";
    els.cardGroupLabel.textContent = "";
    els.questionText.textContent = "Sem cartões para rever";
    els.answerText.textContent = "";
    return;
  }

  const stats = getSessionStats();
  els.cardCounter.textContent = `${state.currentIndex + 1}/${total}`;
  els.cardStats.textContent = `${stats.right} certas · ${stats.wrong} erradas · ${stats.hard} difíceis`;
  els.cardGroupLabel.textContent = current.group.title;
  els.questionText.textContent = current.card.pergunta;
  els.answerText.textContent = current.card.resposta;
  els.showAnswerBtn.textContent = "Mostrar resposta";
}

function showAnswer() {
  if (!state.sessionCards[state.currentIndex]) return;
  state.answerVisible = true;
  els.answerBox.classList.remove("hidden");
  els.showAnswerBtn.classList.add("hidden");
  els.gradeButtons.classList.remove("hidden");
}

function gradeCurrentCard(status) {
  const current = state.sessionCards[state.currentIndex];
  if (!current || !VALID_STATUSES.has(status)) return;

  state.progress[current.card.id] = {
    status,
    updatedAt: new Date().toISOString()
  };
  saveProgress();

  if (state.currentIndex < state.sessionCards.length - 1) {
    state.currentIndex += 1;
    renderCurrentCard();
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
    renderCurrentCard();
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
  const status = state.progress[cardId]?.status;
  return VALID_STATUSES.has(status) ? status : "new";
}

function getSessionStats() {
  return state.sessionCards.reduce(
    (acc, { card }) => {
      const status = getCardStatus(card.id);
      if (status === "right") acc.right += 1;
      if (status === "wrong") acc.wrong += 1;
      if (status === "hard") acc.hard += 1;
      return acc;
    },
    { right: 0, wrong: 0, hard: 0 }
  );
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
    Object.entries(progress).filter(([, value]) => value && VALID_STATUSES.has(value.status))
  );
}

function shuffle(items) {
  const arr = [...items];
  for (let index = arr.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
  }
  return arr;
}
