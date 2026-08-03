const audio = document.querySelector("#audio");
const yearGroups = document.querySelector("#yearGroups");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const message = document.querySelector("#message");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatButton = document.querySelector("#repeatButton");
const shuffleAllButton = document.querySelector("#shuffleAllButton");
const refreshButton = document.querySelector("#refreshButton");
const expandAllButton = document.querySelector("#expandAllButton");
const collapseAllButton = document.querySelector("#collapseAllButton");
const seekBar = document.querySelector("#seekBar");
const volumeBar = document.querySelector("#volumeBar");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const nowTitle = document.querySelector("#nowTitle");
const nowMeta = document.querySelector("#nowMeta");
const trackCount = document.querySelector("#trackCount");
const librarySummary = document.querySelector("#librarySummary");
const archiveRange = document.querySelector("#archiveRange");
const folderPath = document.querySelector("#folderPath");

let tracks = [];
let visibleTracks = [];
let currentTrack = null;
let shuffled = false;
let repeatMode = 0;
let shuffledQueue = [];
const collapsedYears = new Set();

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

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function extractYear(track) {
  const source = `${track.name || ""} ${track.path || ""} ${track.folder || ""}`;
  const matches = source.match(/(?:19|20)\d{2}/g);

  if (matches?.length) {
    const plausible = matches
      .map(Number)
      .filter(year => year >= 1950 && year <= new Date().getFullYear() + 1);

    if (plausible.length) return Math.max(...plausible);
  }

  const modified = new Date(track.modified);
  if (!Number.isNaN(modified.getTime())) return modified.getFullYear();

  return "Okänt år";
}

function cleanTitle(track) {
  let title = track.title || track.name || "Namnlös inspelning";

  title = title
    .replace(/^(?:19|20)\d{2}[-_. /]*/i, "")
    .replace(/^\d{4}[-_.]\d{1,2}[-_.]\d{1,2}[-_. ]*/i, "")
    .replace(/^\d{1,2}[-_.]\d{1,2}[-_.](?:19|20)\d{2}[-_. ]*/i, "")
    .replace(/[_]+/g, " ")
    .trim();

  return title || track.title;
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

function decorateTracks(rawTracks) {
  return rawTracks.map(track => ({
    ...track,
    year: extractYear(track),
    displayTitle: cleanTitle(track)
  }));
}

function sortTracks(list) {
  const mode = sortSelect.value;
  return [...list].sort((a, b) => {
    if (mode === "title-asc") {
      return a.displayTitle.localeCompare(b.displayTitle, "sv", { numeric: true });
    }

    if (mode === "modified-desc") {
      return new Date(b.modified) - new Date(a.modified);
    }

    const ay = typeof a.year === "number" ? a.year : -Infinity;
    const by = typeof b.year === "number" ? b.year : -Infinity;

    if (mode === "year-asc") {
      return ay - by || a.displayTitle.localeCompare(b.displayTitle, "sv", { numeric: true });
    }

    return by - ay || a.displayTitle.localeCompare(b.displayTitle, "sv", { numeric: true });
  });
}

function updateSummary() {
  const numericYears = tracks
    .map(track => track.year)
    .filter(year => typeof year === "number")
    .sort((a, b) => a - b);

  trackCount.textContent =
    `${tracks.length} ${tracks.length === 1 ? "inspelning" : "inspelningar"}`;

  if (numericYears.length) {
    const first = numericYears[0];
    const last = numericYears.at(-1);
    archiveRange.textContent = first === last ? `${first}` : `${first}–${last}`;
  } else {
    archiveRange.textContent = "Årtal saknas";
  }

  const yearCount = new Set(tracks.map(track => String(track.year))).size;
  librarySummary.textContent =
    `${tracks.length} ${tracks.length === 1 ? "inspelning" : "inspelningar"} · ${yearCount} ${yearCount === 1 ? "år" : "årsgrupper"}`;
}

function groupByYear(list) {
  const groups = new Map();

  list.forEach(track => {
    const key = String(track.year);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(track);
  });

  return groups;
}

function renderTracks() {
  const query = searchInput.value.trim().toLocaleLowerCase("sv");

  visibleTracks = sortTracks(
    tracks.filter(track =>
      `${track.displayTitle} ${track.folder} ${track.year}`
        .toLocaleLowerCase("sv")
        .includes(query)
    )
  );

  if (!visibleTracks.length) {
    yearGroups.innerHTML =
      `<div class="message">${tracks.length ? "Inga inspelningar matchar sökningen." : "Inga ljudfiler hittades."}</div>`;
    return;
  }

  const groups = groupByYear(visibleTracks);

  yearGroups.innerHTML = [...groups.entries()].map(([year, items]) => {
    const collapsed = collapsedYears.has(year);
    const tracksHtml = items.map(track => {
      const active = currentTrack?.id === track.id;

      return `
        <button class="track ${active ? "active" : ""}" type="button" data-id="${escapeHtml(track.id)}">
          <span class="track-index">${active && !audio.paused ? "▶" : "♫"}</span>
          <span class="track-copy">
            <span class="track-title">${escapeHtml(track.displayTitle)}</span>
            <span class="track-folder">${escapeHtml(cleanFolder(track.folder))}</span>
          </span>
          <span class="track-date">${escapeHtml(formatDate(track.modified))}</span>
          <span class="track-size">${formatSize(track.size)}</span>
        </button>
      `;
    }).join("");

    return `
      <section class="year-group ${collapsed ? "collapsed" : ""}" data-year="${escapeHtml(year)}">
        <button class="year-heading" type="button" data-toggle-year="${escapeHtml(year)}">
          <span class="year-number">${escapeHtml(year)}</span>
          <span class="year-count">${items.length} ${items.length === 1 ? "inspelning" : "inspelningar"}</span>
          <span class="chevron">▾</span>
        </button>
        <div class="year-tracks">${tracksHtml}</div>
      </section>
    `;
  }).join("");
}

async function loadTracks(force = false) {
  hideMessage();
  refreshButton.disabled = true;
  refreshButton.textContent = "↻ Uppdaterar…";

  try {
    if (force) {
      const refreshResponse = await fetch("/api/refresh", { method: "POST" });
      const refreshData = await refreshResponse.json();
      if (!refreshResponse.ok) {
        throw new Error(refreshData.error || "Uppdateringen misslyckades.");
      }
    }

    const response = await fetch("/api/tracks");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Arkivet kunde inte läsas.");

    tracks = decorateTracks(data.tracks);
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
    refreshButton.textContent = "↻ Uppdatera";
  }
}

function buildQueue() {
  const base = visibleTracks.length ? visibleTracks : tracks;

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
  nowTitle.textContent = track.displayTitle;
  nowMeta.textContent = `${track.year} · ${cleanFolder(track.folder)}`;
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

yearGroups.addEventListener("click", event => {
  const yearButton = event.target.closest("[data-toggle-year]");

  if (yearButton) {
    const year = yearButton.dataset.toggleYear;
    collapsedYears.has(year) ? collapsedYears.delete(year) : collapsedYears.add(year);
    renderTracks();
    return;
  }

  const trackButton = event.target.closest("[data-id]");
  if (!trackButton) return;

  playTrack(tracks.find(track => track.id === trackButton.dataset.id));
});

searchInput.addEventListener("input", () => {
  shuffledQueue = [];
  renderTracks();
});

sortSelect.addEventListener("change", () => {
  shuffledQueue = [];
  renderTracks();
});

expandAllButton.addEventListener("click", () => {
  collapsedYears.clear();
  renderTracks();
});

collapseAllButton.addEventListener("click", () => {
  visibleTracks.forEach(track => collapsedYears.add(String(track.year)));
  renderTracks();
});

shuffleAllButton.addEventListener("click", () => {
  if (!tracks.length) return;
  shuffled = true;
  shuffledQueue = [];
  shuffleButton.classList.add("on");
  const queue = buildQueue();
  playTrack(queue[0]);
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
  repeatButton.title = ["Upprepa av", "Upprepa kö", "Upprepa inspelning"][repeatMode];
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
  } else {
    step(1);
  }
});

audio.addEventListener("error", () => {
  showMessage("Inspelningen kunde inte spelas. Prova att klicka på den igen.", true);
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
  if (event.target.matches("input, select")) return;

  if (event.code === "Space") {
    event.preventDefault();
    playButton.click();
  }

  if (event.code === "ArrowRight") step(1);
  if (event.code === "ArrowLeft") step(-1);
});

loadTracks();
