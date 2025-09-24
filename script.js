const words = [
  {
    word: "SEGURANCA",
    clue: "Proteção contra perigos.",
    direction: "down",
    start: { x: 3, y: 1 },
  },
  {
    word: "DESMATAMENTO",
    clue: "Remoção da vegetação nativa em grande escala.",
    direction: "across",
    start: { x: 2, y: 2 },
  },
  {
    word: "GD",
    clue: "Super-herói.",
    direction: "across",
    start: { x: 3, y: 3 },
  },
  {
    word: "ASSOREAMENTO",
    clue: "Terra que entope rios.",
    direction: "across",
    start: { x: 3, y: 10 },
  },
  {
    word: "AGUA",
    clue: "Fórmula H₂O.",
    direction: "across",
    start: { x: 6, y: 6 },
  },
  {
    word: "AMAZONIA",
    clue: "Maior floresta tropical do mundo.",
    direction: "down",
    start: { x: 6, y: 6 },
  },
  {
    word: "NATUREZA",
    clue: "Mundo natural.",
    direction: "across",
    start: { x: 5, y: 7 },
  },
  {
    word: "TROPICAL",
    clue: "Clima quente e úmido.",
    direction: "across",
    start: { x: 10, y: 8 },
  },
  {
    word: "LIXOELETRONICO",
    clue: "Aparelhos descartados.",
    direction: "down",
    start: { x: 14, y: 7 },
  },
  {
    word: "TOXICOS",
    clue: "Substâncias perigosas.",
    direction: "down",
    start: { x: 4, y: 20 },
  },
  {
    word: "CONTAMINACAO",
    clue: "Poluição no ar, água ou solo.",
    direction: "across",
    start: { x: 3, y: 21 },
  },
  {
    word: "GUARDIOES",
    clue: "Protetores da floresta.",
    direction: "down",
    start: { x: 7, y: 19 },
  },
  {
    word: "RECICLAGEM",
    clue: "Reuso de materiais.",
    direction: "across",
    start: { x: 6, y: 26 },
  },
  {
    word: "VILA",
    clue: "Personagem má.",
    direction: "down",
    start: { x: 9, y: 20 },
  },
  {
    word: "LILA",
    clue: "Personagem feminina.",
    direction: "across",
    start: { x: 13, y: 11 },
  },
  {
    word: "MAX",
    clue: "Personagem masculino.",
    direction: "down",
    start: { x: 16, y: 16 },
  },
  {
    word: "TRADICOES",
    clue: "Costumes antigos.",
    direction: "down",
    start: { x: 17, y: 1 },
  },
  {
    word: "DIGITAIS",
    clue: "Relacionado às impressões dos dedos ou ao ambiente virtual.",
    direction: "across",
    start: { x: 1, y: 18 },
  },
];

let grid = [];
let currentWord = null;
let correctWords = new Set();

function initializeGrid() {
  const gridElement = document.getElementById("crosswordGrid");
  gridElement.innerHTML = "";

  // Initialize empty grid
  for (let y = 0; y < 30; y++) {
    grid[y] = [];
    for (let x = 0; x < 20; x++) {
      grid[y][x] = { letter: "", isBlack: true, wordIds: [], number: null };
    }
  }

  // Place words in grid
  words.forEach((wordData, index) => {
    const { word, direction, start } = wordData;
    for (let i = 0; i < word.length; i++) {
      const x = direction === "across" ? start.x + i : start.x;
      const y = direction === "down" ? start.y + i : start.y;

      if (x < 20 && y < 30) {
        grid[y][x].letter = word[i];
        grid[y][x].isBlack = false;
        grid[y][x].wordIds.push(index);

        // Add number for first letter
        if (i === 0) {
          grid[y][x].number = index + 1;
        }
      }
    }
  });

  // Create DOM elements
  for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 20; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (grid[y][x].isBlack) {
        cell.classList.add("black");
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.addEventListener("input", handleInput);
        input.addEventListener("keydown", handleKeyDown);
        input.addEventListener("focus", () => highlightWord(x, y));
        input.addEventListener("touchstart", () => highlightWord(x, y));
        cell.appendChild(input);

        if (grid[y][x].number) {
          const numberSpan = document.createElement("span");
          numberSpan.className = "cell-number";
          numberSpan.textContent = grid[y][x].number;
          cell.appendChild(numberSpan);
        }
      }

      gridElement.appendChild(cell);
    }
  }

  createCluesList();
}

function createCluesList() {
  const cluesList = document.getElementById("cluesList");
  cluesList.innerHTML = "";

  words.forEach((wordData, index) => {
    const clueItem = document.createElement("div");
    clueItem.className = "clue-item";
    clueItem.innerHTML = `<span class="clue-number">${index + 1}.</span>${
      wordData.clue
    }`;
    clueItem.addEventListener("click", () => highlightWordByIndex(index));
    clueItem.addEventListener("touchstart", () => highlightWordByIndex(index));
    cluesList.appendChild(clueItem);
  });
}

function handleInput(event) {
  const input = event.target;
  const cell = input.parentElement;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  input.value = input.value.toUpperCase();

  // Move to next cell
  if (input.value && currentWord !== null) {
    moveToNextCell(x, y);
  }

  updateProgress();
}

function handleKeyDown(event) {
  const input = event.target;
  const cell = input.parentElement;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  if (event.key === "Backspace" && !input.value) {
    moveToPreviousCell(x, y);
  } else if (event.key === "ArrowRight") {
    moveToNextCell(x, y);
  } else if (event.key === "ArrowLeft") {
    moveToPreviousCell(x, y);
  } else if (event.key === "ArrowDown") {
    moveToNextCell(x, y, true);
  } else if (event.key === "ArrowUp") {
    moveToPreviousCell(x, y, true);
  }
}

function moveToNextCell(x, y, forceDown = false) {
  if (currentWord === null) return;

  const wordData = words[currentWord];
  const direction = forceDown ? "down" : wordData.direction;
  const nextX = direction === "across" ? x + 1 : x;
  const nextY = direction === "down" ? y + 1 : y;

  const nextCell = document.querySelector(
    `[data-x="${nextX}"][data-y="${nextY}"]`
  );
  if (nextCell && !nextCell.classList.contains("black")) {
    const nextInput = nextCell.querySelector("input");
    if (nextInput) {
      nextInput.focus();
    }
  }
}

function moveToPreviousCell(x, y, forceUp = false) {
  if (currentWord === null) return;

  const wordData = words[currentWord];
  const direction = forceUp ? "down" : wordData.direction;
  const prevX = direction === "across" ? x - 1 : x;
  const prevY = direction === "down" ? y - 1 : y;

  const prevCell = document.querySelector(
    `[data-x="${prevX}"][data-y="${prevY}"]`
  );
  if (prevCell && !prevCell.classList.contains("black")) {
    const prevInput = prevCell.querySelector("input");
    if (prevInput) {
      prevInput.focus();
    }
  }
}

function highlightWord(x, y) {
  // Clear previous highlights
  document.querySelectorAll(".cell.active").forEach((cell) => {
    cell.classList.remove("active");
  });
  document.querySelectorAll(".clue-item.active").forEach((item) => {
    item.classList.remove("active");
  });

  // Find word at this position
  const wordIds = grid[y][x].wordIds;
  if (wordIds.length > 0) {
    currentWord = wordIds[0];
    highlightWordByIndex(currentWord);
  }
}

function highlightWordByIndex(wordIndex) {
  // Clear previous highlights
  document.querySelectorAll(".cell.active").forEach((cell) => {
    cell.classList.remove("active");
  });
  document.querySelectorAll(".clue-item.active").forEach((item) => {
    item.classList.remove("active");
  });

  currentWord = wordIndex;
  const wordData = words[wordIndex];

  // Highlight word cells
  for (let i = 0; i < wordData.word.length; i++) {
    const x =
      wordData.direction === "across" ? wordData.start.x + i : wordData.start.x;
    const y =
      wordData.direction === "down" ? wordData.start.y + i : wordData.start.y;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
      cell.classList.add("active");
    }
  }

  // Highlight clue
  const clueItems = document.querySelectorAll(".clue-item");
  if (clueItems[wordIndex]) {
    clueItems[wordIndex].classList.add("active");
    clueItems[wordIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

function checkAnswers() {
  let newCorrectCount = 0;

  words.forEach((wordData, index) => {
    let isCorrect = true;
    const cells = [];

    for (let i = 0; i < wordData.word.length; i++) {
      const x =
        wordData.direction === "across"
          ? wordData.start.x + i
          : wordData.start.x;
      const y =
        wordData.direction === "down" ? wordData.start.y + i : wordData.start.y;

      const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      const input = cell.querySelector("input");

      if (!input || input.value !== wordData.word[i]) {
        isCorrect = false;
      }
      cells.push(cell);
    }

    cells.forEach((cell) => {
      cell.classList.remove("correct", "incorrect");
      if (isCorrect) {
        cell.classList.add("correct");
        correctWords.add(index);
      } else {
        cell.classList.add("incorrect");
        correctWords.delete(index);
      }
    });

    if (isCorrect) {
      newCorrectCount++;
    }
  });

  updateProgress();

  if (correctWords.size === words.length) {
    setTimeout(() => {
      alert(
        "🎉 Parabéns, Guardião da Amazônia! Você completou toda a cruzadinha! 🌳🦋"
      );
      document.querySelector(".container").classList.add("celebration");
    }, 500);
  }
}

function clearGrid() {
  document.querySelectorAll(".cell input").forEach((input) => {
    input.value = "";
  });
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("correct", "incorrect", "active");
  });
  correctWords.clear();
  updateProgress();
}

function showHint() {
  if (currentWord !== null) {
    const wordData = words[currentWord];
    const firstEmptyIndex = findFirstEmptyCell(wordData);

    if (firstEmptyIndex !== -1) {
      const x =
        wordData.direction === "across"
          ? wordData.start.x + firstEmptyIndex
          : wordData.start.x;
      const y =
        wordData.direction === "down"
          ? wordData.start.y + firstEmptyIndex
          : wordData.start.y;

      const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      const input = cell.querySelector("input");

      if (input) {
        input.value = wordData.word[firstEmptyIndex];
        input.style.background = "rgba(255,193,7,0.8)";
        setTimeout(() => {
          input.style.background = "";
        }, 2000);
      }
    } else {
      alert("Esta palavra já está completa! 🌟");
    }
  } else {
    alert(
      "Toque em uma célula ou dica primeiro para selecionar uma palavra! 🌿"
    );
  }
}

function findFirstEmptyCell(wordData) {
  for (let i = 0; i < wordData.word.length; i++) {
    const x =
      wordData.direction === "across" ? wordData.start.x + i : wordData.start.x;
    const y =
      wordData.direction === "down" ? wordData.start.y + i : wordData.start.y;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    const input = cell.querySelector("input");

    if (!input.value) {
      return i;
    }
  }
  return -1;
}

function updateProgress() {
  const correctCount = correctWords.size;
  const totalWords = words.length;
  const percentage = Math.round((correctCount / totalWords) * 100);

  document.getElementById("correctCount").textContent = correctCount;
  document.getElementById("progressPercent").textContent = percentage + "%";
  document.getElementById("progressFill").style.width = percentage + "%";
}

// Initialize the game
initializeGrid();

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
