const CONFIG = {
  // DEMO_MODE true mantiene el juego abierto para enseñárselo al cliente.
  // Cámbialo a false antes de publicar la campaña definitiva.
  DEMO_MODE: false,
  CAMPAIGN_START: "2026-10-01T06:00:00Z", // 08:00 en España peninsular
  CAMPAIGN_END: "2026-10-07T21:59:59Z",   // 23:59 en España peninsular
  TYPEFORM_URL: "https://www.typeform.com/"
};

const scenes = [
  {
    id: 1,
    image: "assets/escena-1.png",
    title: "Homer acaba de comprar una casa.",
    question: "¿Qué le recomendarías?",
    options: ["Propietario", "Inquilino", "Casero Blindado"],
    correct: 0,
    success: "¡Correcto! Has identificado la solución adecuada para un cliente que acaba de comprar una vivienda.",
    error: "Casi… Antes de recomendar, fíjate en la situación del cliente: Homer acaba de comprar una vivienda. Inténtalo de nuevo."
  },
  {
    id: 2,
    image: "assets/escena-2.png",
    title: "Los Simpson van a reformar la cocina.",
    question: "¿Qué harías como referenciador?",
    options: ["Esperar a que terminen la reforma", "Aprovechar la conversación para hablar de su seguro de hogar", "Hablarles del seguro de coche"],
    correct: 1,
    success: "¡Ahí está la oportunidad! Las reformas pueden ser un buen momento para revisar la protección del hogar.",
    error: "Casi… Una reforma es una buena ocasión para hablar de cómo está protegido el hogar. Inténtalo de nuevo."
  },
  {
    id: 3,
    image: "assets/escena-3.png",
    title: "Los Simpson se van de vacaciones y dejan la casa vacía.",
    question: "¿Qué harías como referenciador?",
    options: ["No haría nada, porque están fuera de casa", "Preguntaría cómo tienen protegida su vivienda cuando están fuera", "Les hablaría del seguro de viaje"],
    correct: 1,
    success: "¡Muy bien! Una casa vacía también necesita estar protegida.",
    error: "Casi… La oportunidad está en preguntar por la protección de la vivienda durante su ausencia. Inténtalo de nuevo."
  },
  {
    id: 4,
    image: "assets/escena-4.png",
    title: "Homer habla con un vecino que acaba de mudarse.",
    question: "¿Qué pregunta harías antes de recomendarle ASISA Hogar?",
    options: ["Cuánto paga de luz", "Si es propietario o inquilino", "Si tiene seguro de coche"],
    correct: 1,
    success: "¡Bien preguntado! Antes de recomendar, necesitamos conocer la situación del cliente. No es lo mismo ser propietario que inquilino.",
    error: "Casi… Primero, conoce su situación. Inténtalo de nuevo."
  },
  {
    id: 5,
    image: "assets/escena-5.png",
    title: "La casa de los Simpson está vacía.",
    question: "Llevan varios días fuera. ¿Qué harías como referenciador?",
    options: ["No haría nada, porque no están en casa", "Preguntaría cómo tienen protegida su vivienda cuando está vacía", "Les recomendaría únicamente un seguro de viaje"],
    correct: 1,
    success: "¡Buena vista! Has detectado una oportunidad para revisar la protección de una vivienda vacía.",
    error: "Casi… Aunque sus propietarios estén fuera, la vivienda sigue necesitando protección. Inténtalo de nuevo."
  },
  {
    id: 6,
    image: "assets/escena-6.png",
    title: "Homer está hablando con Flanders.",
    question: "Si Flanders te cuenta que tiene una vivienda alquilada, ¿qué harías?",
    options: ["Le hablaría del seguro de coche", "Le recomendaría un seguro para inquilinos", "Le preguntaría cómo tiene protegida su vivienda como propietario"],
    correct: 1,
    success: "¡Exacto! Has encontrado la sexta oportunidad.",
    error: "Casi… Fíjate en que se trata de una vivienda alquilada. Inténtalo de nuevo."
  }
];

const state = { completed: new Set(), current: null };
const grid = document.querySelector("#scene-grid");
const quizModal = document.querySelector("#quiz-modal");
const victoryModal = document.querySelector("#victory-modal");
const form = document.querySelector("#answer-form");
const optionsEl = document.querySelector("#answer-options");
const feedback = document.querySelector("#answer-feedback");
const validateButton = document.querySelector("#validate-answer");
const nextButton = document.querySelector("#next-scene");

function campaignStatus() {
  if (CONFIG.DEMO_MODE) return "open";
  const now = Date.now();
  if (now < Date.parse(CONFIG.CAMPAIGN_START)) return "upcoming";
  if (now > Date.parse(CONFIG.CAMPAIGN_END)) return "closed";
  return "open";
}

function applyLinks() {
  document.querySelectorAll('a[href="https://www.typeform.com/"]').forEach(link => {
    link.href = CONFIG.TYPEFORM_URL;
  });
}

function enforceCampaignWindow() {
  const status = campaignStatus();
  if (status === "open") return;
  document.querySelector(".site-header").hidden = true;
  document.querySelector("#top-progress").hidden = true;
  document.querySelector("#app").hidden = true;
  document.querySelector("footer").hidden = true;
  const screen = document.querySelector("#closed-screen");
  screen.hidden = false;
  screen.classList.add("visible");
  if (status === "upcoming") {
    document.querySelector("#closed-title").textContent = "El reto comenzará el 1 de octubre";
    screen.querySelector("p:not(.eyebrow)").textContent = "Podrás participar desde las 08:00. Vuelve pronto para encontrar las oportunidades de ASISA Hogar.";
  }
}

function renderScenes() {
  grid.innerHTML = scenes.map(scene => `
    <button class="scene-card" type="button" data-scene="${scene.id}" aria-label="Resolver escena ${scene.id}: ${scene.title}">
      <span class="scene-card-body">
        <span class="scene-index">${String(scene.id).padStart(2, "0")}</span>
        <img src="${scene.image}" alt="Escena ${scene.id}: ${scene.title}">
        <h3>${scene.title}</h3>
        <span class="scene-cta">Resolver escena</span>
      </span>
    </button>
  `).join("");
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => modal.querySelector("button, a")?.focus(), 30);
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openScene(id) {
  const scene = scenes.find(item => item.id === id);
  if (!scene) return;
  state.current = scene;
  document.querySelector("#modal-image").src = scene.image;
  document.querySelector("#modal-image").alt = `Escena ${scene.id}: ${scene.title}`;
  document.querySelector("#modal-number").textContent = `Escena ${String(scene.id).padStart(2, "0")}`;
  document.querySelector("#modal-title").textContent = scene.title;
  document.querySelector("#modal-question").textContent = scene.question;
  optionsEl.innerHTML = `<legend class="sr-only">Elige una respuesta</legend>` + scene.options.map((option, index) => `
    <label class="option">
      <input type="radio" name="answer" value="${index}">
      <span>${option}</span>
    </label>
  `).join("");
  feedback.textContent = "";
  feedback.className = "feedback";
  validateButton.disabled = false;
  validateButton.textContent = "Validar respuesta";
  nextButton.disabled = true;
  openModal(quizModal);
}

function updateProgress() {
  const count = state.completed.size;
  document.querySelector("#progress-text").textContent = `${count} de 6 oportunidades encontradas`;
  document.querySelector("#progress-fill").style.width = `${(count / scenes.length) * 100}%`;
  document.querySelectorAll("[data-progress-step]").forEach(step => {
    const sceneId = Number(step.dataset.progressStep);
    step.classList.toggle("done", state.completed.has(sceneId));
  });
  document.querySelectorAll(".scene-card").forEach(card => {
    const complete = state.completed.has(Number(card.dataset.scene));
    card.classList.toggle("completed", complete);
    card.querySelector(".scene-cta").textContent = complete ? "Oportunidad encontrada" : "Resolver escena";
  });
}

function nextIncompleteId() {
  return scenes.find(scene => !state.completed.has(scene.id))?.id ?? null;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const selected = form.querySelector('input[name="answer"]:checked');
  if (!selected) {
    feedback.textContent = "Selecciona una opción antes de validar tu respuesta.";
    feedback.className = "feedback error";
    return;
  }
  const selectedIndex = Number(selected.value);
  optionsEl.querySelectorAll(".option").forEach(option => option.classList.remove("correct", "wrong"));
  if (selectedIndex === state.current.correct) {
    selected.closest(".option").classList.add("correct");
    feedback.textContent = state.current.success;
    feedback.className = "feedback success";
    state.completed.add(state.current.id);
    validateButton.disabled = true;
    nextButton.disabled = false;
    nextButton.textContent = state.completed.size === scenes.length ? "Ver recompensa" : "Siguiente escena";
    updateProgress();
  } else {
    selected.closest(".option").classList.add("wrong");
    feedback.textContent = state.current.error;
    feedback.className = "feedback error";
    validateButton.textContent = "Intentar de nuevo";
  }
});

optionsEl.addEventListener("change", () => {
  if (!validateButton.disabled) {
    feedback.textContent = "";
    feedback.className = "feedback";
    optionsEl.querySelectorAll(".option").forEach(option => option.classList.remove("wrong"));
    validateButton.textContent = "Validar respuesta";
  }
});

nextButton.addEventListener("click", () => {
  closeModal(quizModal);
  if (state.completed.size === scenes.length) {
    setTimeout(() => openModal(victoryModal), 180);
    return;
  }
  const nextId = nextIncompleteId();
  if (nextId) setTimeout(() => openScene(nextId), 180);
});

grid.addEventListener("click", event => {
  const card = event.target.closest("[data-scene]");
  if (card) openScene(Number(card.dataset.scene));
});

document.querySelectorAll("[data-close-modal]").forEach(element => element.addEventListener("click", () => closeModal(quizModal)));
document.querySelector("#close-victory").addEventListener("click", () => closeModal(victoryModal));
document.querySelector("#download-reward").addEventListener("click", async event => {
  const button = event.currentTarget;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Preparando descarga…";
  try {
    const response = await fetch("assets/imagen-metas.png");
    if (!response.ok) throw new Error("No se pudo cargar la recompensa");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "Reto-octubre-2026-10-metas-ASISA-Hogar.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  } catch (error) {
    const fallback = document.createElement("a");
    fallback.href = "assets/imagen-metas.png";
    fallback.download = "Reto-octubre-2026-10-metas-ASISA-Hogar.png";
    fallback.target = "_blank";
    document.body.appendChild(fallback);
    fallback.click();
    fallback.remove();
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
document.querySelector("#start-game").addEventListener("click", () => document.querySelector("#juego").scrollIntoView({ behavior: "smooth" }));

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (quizModal.classList.contains("open")) closeModal(quizModal);
  if (victoryModal.classList.contains("open")) closeModal(victoryModal);
});

applyLinks();
renderScenes();
updateProgress();
enforceCampaignWindow();
