const audio = document.querySelector("#audio");
const trackList = document.querySelector("#trackList");
const searchInput = document.querySelector("#searchInput");
const message = document.querySelector("#message");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatButton = document.querySelector("#repeatButton");
const refreshButton = document.querySelector("#refreshButton");
const seekBar = document.querySelector("#seekBar");
const volumeBar = document.querySelector("#volumeBar");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const nowTitle = document.querySelector("#nowTitle");
const nowFolder = document.querySelector("#nowFolder");
const trackCount = document.querySelector("#trackCount");
const librarySummary = document.querySelector("#librarySummary");
const folderPath = document.querySelector("#folderPath");

let tracks = [];
let visibleTracks = [];
let currentTrack = null;
let shuffled = false;
let repeatMode = 0;
let shuffledQueue = [];

const savedVolume = Number(localStorage.getItem("gravitards-volume"));
audio.volume = Number.isFinite(savedVolume) ? savedVolume : 0.85;
volumeBar.value = audio.volume;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

function cleanFolder(folder) {
  if (!folder) return "Gravitards";
  return folder.split("/").filter(Boolean).at(-1) || "Gravitards";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.remove("hidden");
  message.classList.toggle("error", isError);
}

function hideMessage() {
  message.classList.add("hidden");
}

function updateSummary() {
  trackCount.textContent = `${tracks.length} ${tracks.length === 1 ? "låt" : "låtar"}`;
  const folders = new Set(tracks.map(track => track.folder));
  librarySummary.textContent =
    `${tracks.length} ${tracks.length === 1 ? "låt" : "låtar"} · ${folders.size} ${folders.size === 1 ? "mapp" : "mappar"}`;
}

function renderTracks() {
  const query = searchInput.value.trim().toLocaleLowerCase("sv");

  visibleTracks = tracks.filter(track =>
    `${track.title} ${track.folder}`.toLocaleLowerCase("sv").includes(query)
  );

  if (!visibleTracks.length) {
    trackList.innerHTML = `<div class="message">${
      tracks.length ? "Inga spår matchar sökningen." : "Inga ljudfiler hittades."
    }</div>`;
    return;
  }

  trackList.innerHTML = visibleTracks.map((track, index) => {
    const active = currentTrack?.id === track.id;
    return `
      <button class="track ${active ? "active" : ""}" type="button" data-id="${escapeHtml(track.id)}">
        <span class="track-index">${active && !audio.paused ? "▶" : "♫"}</span>
        <span class="track-copy">
          <span class="track-title">${escapeHtml(track.title)}</span>
          <span class="track-folder">${escapeHtml(cleanFolder(track.folder))}</span>
        </span>
        <span class="track-size">${formatSize(track.size)}</span>
      </button>
    `;
  }).join("");
}

async function loadTracks(force = false) {
  hideMessage();
  refreshButton.disabled = true;
  refreshButton.lastElementChild && (refreshButton.lastElementChild.textContent = "Uppdaterar");

  try {
    if (force) {
      const refreshResponse = await fetch("/api/refresh", { method: "POST" });
      const refreshData = await refreshResponse.json();
      if (!refreshResponse.ok) throw new Error(refreshData.error || "Uppdateringen misslyckades.");
    }

    const response = await fetch("/api/tracks");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Biblioteket kunde inte läsas.");

    tracks = data.tracks;
    folderPath.textContent = `▱ ${data.folder}`;
    updateSummary();
    renderTracks();

    if (!tracks.length) {
      showMessage("Mappen innehåller inga ljudfiler. Kontrollera DROPBOX_FOLDER.");
    }
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    refreshButton.disabled = false;
  }
}

function buildQueue() {
  const base = searchInput.value.trim() ? visibleTracks : tracks;
  if (!shuffled) return base;

  if (
    shuffledQueue.length !== base.length ||
    !shuffledQueue.every(item => base.some(track => track.id === item.id))
  ) {
    shuffledQueue = [...base].sort(() => Math.random() - 0.5);
  }

  return shuffledQueue;
}

async function playTrack(track) {
  if (!track) return;

  currentTrack = track;
  nowTitle.textContent = track.title;
  nowFolder.textContent = cleanFolder(track.folder);
  audio.src = `/api/play/${encodeURIComponent(track.id)}?t=${Date.now()}`;
  renderTracks();

  try {
    await audio.play();
  } catch {
    showMessage("Tryck på play för att starta uppspelningen.", true);
  }
}

function step(direction) {
  const queue = buildQueue();
  if (!queue.length) return;

  const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
  let nextIndex = currentIndex + direction;

  if (currentIndex < 0) nextIndex = direction > 0 ? 0 : queue.length - 1;
  if (nextIndex >= queue.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = queue.length - 1;

  playTrack(queue[nextIndex]);
}

trackList.addEventListener("click", event => {
  const button = event.target.closest("[data-id]");
  if (!button) return;
  playTrack(tracks.find(track => track.id === button.dataset.id));
});

searchInput.addEventListener("input", () => {
  shuffledQueue = [];
  renderTracks();
});

playButton.addEventListener("click", () => {
  if (!currentTrack) return playTrack(visibleTracks[0] || tracks[0]);
  audio.paused ? audio.play() : audio.pause();
});

prevButton.addEventListener("click", () => {
  if (audio.currentTime > 4) audio.currentTime = 0;
  else step(-1);
});

nextButton.addEventListener("click", () => step(1));

shuffleButton.addEventListener("click", () => {
  shuffled = !shuffled;
  shuffledQueue = [];
  shuffleButton.classList.toggle("on", shuffled);
});

repeatButton.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatButton.classList.toggle("on", repeatMode > 0);
  repeatButton.textContent = repeatMode === 2 ? "↻¹" : "↻";
  repeatButton.title = ["Upprepa av", "Upprepa kö", "Upprepa spår"][repeatMode];
});

refreshButton.addEventListener("click", () => loadTracks(true));

audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  renderTracks();
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  renderTracks();
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  seekBar.value = audio.duration
    ? Math.round((audio.currentTime / audio.duration) * 1000)
    : 0;
});

audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatMode === 1 || currentTrack !== tracks.at(-1)) {
    step(1);
  }
});

audio.addEventListener("error", () => {
  showMessage("Spåret kunde inte spelas. Prova att klicka på det igen.", true);
});

seekBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (Number(seekBar.value) / 1000) * audio.duration;
  }
});

volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value);
  localStorage.setItem("gravitards-volume", String(audio.volume));
});

document.addEventListener("keydown", event => {
  if (event.target.matches("input")) return;

  if (event.code === "Space") {
    event.preventDefault();
    playButton.click();
  }

  if (event.code === "ArrowRight") step(1);
  if (event.code === "ArrowLeft") step(-1);
});

loadTracks();
