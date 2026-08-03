const audio = document.querySelector("#audio");
const trackList = document.querySelector("#trackList");
const searchInput = document.querySelector("#searchInput");
const libraryInfo = document.querySelector("#libraryInfo");
const message = document.querySelector("#message");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatButton = document.querySelector("#repeatButton");
const shuffleAllButton = document.querySelector("#shuffleAllButton");
const refreshButton = document.querySelector("#refreshButton");
const seekBar = document.querySelector("#seekBar");
const volumeBar = document.querySelector("#volumeBar");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const nowTitle = document.querySelector("#nowTitle");
const nowFolder = document.querySelector("#nowFolder");

let tracks = [];
let visibleTracks = [];
let currentTrack = null;
let shuffled = false;
let repeatMode = 0;

const savedVolume = Number(localStorage.getItem("player-volume"));
audio.volume = Number.isFinite(savedVolume) ? savedVolume : 0.85;
volumeBar.value = audio.volume;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.remove("hidden");
  message.classList.toggle("error", isError);
}

function hideMessage() {
  message.classList.add("hidden");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderTracks() {
  const query = searchInput.value.trim().toLocaleLowerCase("sv");
  visibleTracks = tracks.filter((track) =>
    `${track.title} ${track.folder}`.toLocaleLowerCase("sv").includes(query)
  );

  if (!visibleTracks.length) {
    trackList.innerHTML = `<div class="message">${tracks.length ? "Inga spår matchar sökningen." : "Inga ljudfiler hittades."}</div>`;
    return;
  }

  trackList.innerHTML = visibleTracks.map((track, index) => `
    <button class="track ${currentTrack?.id === track.id ? "active" : ""}"
            type="button" data-id="${escapeHtml(track.id)}">
      <span class="track-index">${currentTrack?.id === track.id && !audio.paused ? "▶" : index + 1}</span>
      <span class="track-copy">
        <span class="track-title">${escapeHtml(track.title)}</span>
        <span class="track-folder">${escapeHtml(track.folder)}</span>
      </span>
      <span class="track-size">${formatSize(track.size)}</span>
    </button>
  `).join("");
}

async function loadTracks(force = false) {
  hideMessage();
  refreshButton.disabled = true;
  libraryInfo.textContent = force ? "Uppdaterar Dropbox-mappen…" : "Laddar biblioteket…";

  try {
    if (force) {
      const refreshResponse = await fetch("/api/refresh", { method: "POST" });
      if (!refreshResponse.ok) throw new Error((await refreshResponse.json()).error || "Uppdateringen misslyckades.");
    }

    const response = await fetch("/api/tracks");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Biblioteket kunde inte läsas.");

    tracks = data.tracks;
    libraryInfo.textContent = `${data.count} spår • ${data.folder}`;
    renderTracks();

    if (!tracks.length) {
      showMessage("Mappen innehåller inga MP3- eller andra ljudfiler. Kontrollera DROPBOX_FOLDER.");
    }
  } catch (error) {
    libraryInfo.textContent = "Kunde inte läsa biblioteket";
    showMessage(error.message, true);
  } finally {
    refreshButton.disabled = false;
  }
}

function getQueue() {
  const base = searchInput.value.trim() ? visibleTracks : tracks;
  if (!shuffled) return base;
  return [...base].sort(() => Math.random() - 0.5);
}

async function playTrack(track) {
  if (!track) return;
  currentTrack = track;
  nowTitle.textContent = track.title;
  nowFolder.textContent = track.folder;
  audio.src = `/api/play/${encodeURIComponent(track.id)}?t=${Date.now()}`;
  renderTracks();

  try {
    await audio.play();
  } catch (error) {
    showMessage("Webbläsaren stoppade automatisk uppspelning. Tryck på play.", true);
  }
}

function step(direction) {
  const queue = getQueue();
  if (!queue.length) return;
  const currentIndex = queue.findIndex((track) => track.id === currentTrack?.id);
  let nextIndex = currentIndex + direction;

  if (currentIndex < 0) nextIndex = direction > 0 ? 0 : queue.length - 1;
  if (nextIndex >= queue.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = queue.length - 1;

  playTrack(queue[nextIndex]);
}

trackList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (!button) return;
  playTrack(tracks.find((track) => track.id === button.dataset.id));
});

searchInput.addEventListener("input", renderTracks);

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
  shuffleButton.classList.toggle("on", shuffled);
});

shuffleAllButton.addEventListener("click", () => {
  if (!tracks.length) return;
  shuffled = true;
  shuffleButton.classList.add("on");
  const queue = getQueue();
  playTrack(queue[0]);
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
  seekBar.value = audio.duration ? Math.round((audio.currentTime / audio.duration) * 1000) : 0;
});
audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play();
  } else {
    step(1);
  }
});
audio.addEventListener("error", () => {
  showMessage("Spåret kunde inte spelas. Dropbox-länken kan ha löpt ut; prova spåret igen.", true);
});

seekBar.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(seekBar.value) / 1000) * audio.duration;
});

volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value);
  localStorage.setItem("player-volume", String(audio.volume));
});

loadTracks();
