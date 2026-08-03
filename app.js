const audio = document.querySelector("#audio");
const audioArchiveTab = document.querySelector("#audioArchiveTab");
const filmArchiveTab = document.querySelector("#filmArchiveTab");
const audioArchiveView = document.querySelector("#audioArchiveView");
const filmArchiveView = document.querySelector("#filmArchiveView");
const audioArchiveCount = document.querySelector("#audioArchiveCount");
const filmPlayer = document.querySelector("#filmPlayer");
const filmNowTitle = document.querySelector("#filmNowTitle");
const filmNowMeta = document.querySelector("#filmNowMeta");
const filmYouTubeLink = document.querySelector("#filmYouTubeLink");
const filmCount = document.querySelector("#filmCount");
const filmGrid = document.querySelector("#filmGrid");
const filmMessage = document.querySelector("#filmMessage");
const filmSearchInput = document.querySelector("#filmSearchInput");
const filmSortSelect = document.querySelector("#filmSortSelect");
const refreshFilmsButton = document.querySelector("#refreshFilmsButton");
const yearGroups = document.querySelector("#yearGroups");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const message = document.querySelector("#message");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatButton = document.querySelector("#repeatButton");
const downloadCurrentButton = document.querySelector("#downloadCurrentButton");
const shuffleAllButton = document.querySelector("#shuffleAllButton");
const refreshButton = document.querySelector("#refreshButton");
const expandAllButton = document.querySelector("#expandAllButton");
const collapseAllButton = document.querySelector("#collapseAllButton");
const seekBar = document.querySelector("#seekBar");
const seekWrap = document.querySelector("#seekWrap");
const seekTooltip = document.querySelector("#seekTooltip");
const chapterMarkers = document.querySelector("#chapterMarkers");
const volumeBar = document.querySelector("#volumeBar");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const nowTitle = document.querySelector("#nowTitle");
const nowMeta = document.querySelector("#nowMeta");
const trackCount = document.querySelector("#trackCount");
const librarySummary = document.querySelector("#librarySummary");
const archiveRange = document.querySelector("#archiveRange");
const folderPath = document.querySelector("#folderPath");
const vaultTimeline = document.querySelector("#vaultTimeline");
const clearTimelineFilterButton = document.querySelector("#clearTimelineFilterButton");
const addTimestampButton = document.querySelector("#addTimestampButton");
const timestampComposer = document.querySelector("#timestampComposer");
const timestampComposerTime = document.querySelector("#timestampComposerTime");
const timestampInput = document.querySelector("#timestampInput");
const saveTimestampButton = document.querySelector("#saveTimestampButton");
const cancelTimestampButton = document.querySelector("#cancelTimestampButton");
const timestampList = document.querySelector("#timestampList");
const yearJumpSelect = document.querySelector("#yearJumpSelect");
const favoritesFilterButton = document.querySelector("#favoritesFilterButton");
const recentFilterButton = document.querySelector("#recentFilterButton");
const commentInput = document.querySelector("#commentInput");
const commentStatus = document.querySelector("#commentStatus");
const saveCommentButton = document.querySelector("#saveCommentButton");
const deleteCommentButton = document.querySelector("#deleteCommentButton");

let tracks = [];
let films = [];
let visibleFilms = [];
let currentFilm = null;
let visibleTracks = [];
let currentTrack = null;
let shuffled = false;
let repeatMode = 0;
let shuffledQueue = [];
let activeFilter = "all";
let timelineYearFilter = null;
let pendingTimestampSeconds = 0;
let timeDisplayMode = 0;
let showRemainingTime = true;

const FAVORITES_STORAGE_KEY = "gravitards-favorites";
const COMMENTS_STORAGE_KEY = "gravitards-comments";
const RECENT_STORAGE_KEY = "gravitards-recent";
const TIMESTAMPS_STORAGE_KEY = "gravitards-timestamps";

const favoriteIds = new Set(
  JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]")
);
const comments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || "{}");
let recentIds = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
const timestampNotes = JSON.parse(
  localStorage.getItem(TIMESTAMPS_STORAGE_KEY) || "{}"
);

const COLLAPSED_STORAGE_KEY = "gravitards-collapsed-years";
const collapsedYears = new Set(
  JSON.parse(localStorage.getItem(COLLAPSED_STORAGE_KEY) || "[]")
);

const savedVolume = Number(localStorage.getItem("gravitards-volume"));
audio.volume = Number.isFinite(savedVolume) ? savedVolume : 0.85;
volumeBar.value = audio.volume;

function formatTime(seconds, mode = 0) {
  if (!Number.isFinite(seconds)) return "0:00";

  const safeSeconds = Math.max(0, Math.floor(seconds));

  if (mode === 2) {
    return `${safeSeconds} s`;
  }

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const totalMinutes = Math.floor(safeSeconds / 60);
  const secs = (safeSeconds % 60).toString().padStart(2, "0");

  if (mode === 1) {
    return `${totalMinutes}:${secs}`;
  }

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs}`;
  }

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
    .replace(/^gravitards\s*[-–—:]\s*/i, "")
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

function saveFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favoriteIds]));
}

function saveComments() {
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
}

function saveRecent() {
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentIds));
}

function updateFilterButtons() {
  favoritesFilterButton.classList.toggle("active", activeFilter === "favorites");
  recentFilterButton.classList.toggle("active", activeFilter === "recent");
  favoritesFilterButton.textContent =
    `${activeFilter === "favorites" ? "★" : "☆"} Favoriter (${favoriteIds.size})`;
}

function loadCommentForCurrentTrack() {
  if (!currentTrack) {
    commentInput.value = "";
    commentInput.disabled = true;
    saveCommentButton.disabled = true;
    deleteCommentButton.disabled = true;
    commentStatus.textContent = "Ingen inspelning vald";
    return;
  }

  const value = comments[currentTrack.id] || "";
  commentInput.disabled = false;
  saveCommentButton.disabled = false;
  deleteCommentButton.disabled = !value;
  commentInput.value = value;
  commentStatus.textContent = currentTrack.displayTitle;
}

function addToRecent(trackId) {
  recentIds = [trackId, ...recentIds.filter(id => id !== trackId)].slice(0, 30);
  saveRecent();
}

function saveTimestampNotes() {
  localStorage.setItem(TIMESTAMPS_STORAGE_KEY, JSON.stringify(timestampNotes));
}

function renderTimeline() {
  const years = [...new Set(
    tracks
      .map(track => track.year)
      .filter(year => typeof year === "number")
  )].sort((a, b) => a - b);

  vaultTimeline.innerHTML = years.map(year => `
    <button class="timeline-year ${timelineYearFilter === String(year) ? "active" : ""}"
            type="button"
            data-timeline-year="${year}">
      ${year}
    </button>
  `).join("");

  clearTimelineFilterButton.classList.toggle("hidden", !timelineYearFilter);
}

function renderChapterMarkers() {
  chapterMarkers.innerHTML = "";

  if (!currentTrack || !Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }

  const notes = timestampNotes[currentTrack.id] || [];

  chapterMarkers.innerHTML = notes
    .filter(note => Number.isFinite(note.seconds) && note.seconds >= 0 && note.seconds <= audio.duration)
    .map(note => {
      const percentage = (note.seconds / audio.duration) * 100;
      return `<span class="chapter-marker"
                    style="left:${percentage}%"
                    title="${escapeHtml(`${formatTime(note.seconds)} – ${note.text}`)}"></span>`;
    })
    .join("");
}

function updateDisplayedTimes() {
  currentTime.textContent = formatTime(audio.currentTime, timeDisplayMode);

  if (!Number.isFinite(audio.duration)) {
    duration.textContent = "0:00";
    return;
  }

  if (showRemainingTime) {
    const remaining = Math.max(0, audio.duration - audio.currentTime);
    duration.textContent = `−${formatTime(remaining, timeDisplayMode)}`;
    duration.title = "Klicka för att visa total speltid";
  } else {
    duration.textContent = formatTime(audio.duration, timeDisplayMode);
    duration.title = "Klicka för att visa återstående tid";
  }
}

function renderTimestampNotes() {
  renderChapterMarkers();

  if (!currentTrack) {
    timestampList.innerHTML =
      '<p class="empty-timestamps">Välj en inspelning för att se anteckningar.</p>';
    addTimestampButton.disabled = true;
    return;
  }

  addTimestampButton.disabled = false;
  const notes = [...(timestampNotes[currentTrack.id] || [])]
    .sort((a, b) => a.seconds - b.seconds);

  if (!notes.length) {
    timestampList.innerHTML =
      '<p class="empty-timestamps">Inga tidsstämplade anteckningar ännu.</p>';
    return;
  }

  timestampList.innerHTML = notes.map((note, index) => `
    <div class="timestamp-note">
      <button class="timestamp-jump"
              type="button"
              data-jump-seconds="${note.seconds}">
        ${formatTime(note.seconds)}
      </button>
      <div class="timestamp-text">${escapeHtml(note.text)}</div>
      <button class="timestamp-delete"
              type="button"
              data-delete-timestamp="${index}"
              title="Ta bort">×</button>
    </div>
  `).join("");
}

function saveCollapsedYears() {
  localStorage.setItem(
    COLLAPSED_STORAGE_KEY,
    JSON.stringify([...collapsedYears])
  );
}

function updateYearJump() {
  const years = [...new Set(
    tracks
      .map(track => track.year)
      .filter(year => typeof year === "number")
  )].sort((a, b) => b - a);

  yearJumpSelect.innerHTML =
    '<option value="">Välj år</option>' +
    years.map(year => `<option value="${year}">${year}</option>`).join("");
}

function updateSummary() {
  const numericYears = tracks
    .map(track => track.year)
    .filter(year => typeof year === "number")
    .sort((a, b) => a - b);

  trackCount.textContent =
    `${tracks.length} ${tracks.length === 1 ? "Vault Entry" : "Vault Entries"}`;

  if (numericYears.length) {
    const first = numericYears[0];
    const last = numericYears.at(-1);
    archiveRange.textContent = first === last ? `${first}` : `${first}–${last}`;
  } else {
    archiveRange.textContent = "Årtal saknas";
  }

  const yearCount = new Set(tracks.map(track => String(track.year))).size;
  librarySummary.textContent =
    `${tracks.length} ${tracks.length === 1 ? "Vault Entry" : "Vault Entries"} · ${yearCount} ${yearCount === 1 ? "år" : "årsgrupper"}`;
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

  let filtered = tracks.filter(track =>
    `${track.displayTitle} ${track.folder} ${track.year}`
      .toLocaleLowerCase("sv")
      .includes(query)
  );

  if (timelineYearFilter) {
    filtered = filtered.filter(track => String(track.year) === timelineYearFilter);
  }

  if (activeFilter === "favorites") {
    filtered = filtered.filter(track => favoriteIds.has(track.id));
  }

  if (activeFilter === "recent") {
    const position = new Map(recentIds.map((id, index) => [id, index]));
    filtered = filtered
      .filter(track => position.has(track.id))
      .sort((a, b) => position.get(a.id) - position.get(b.id));
    visibleTracks = filtered;
  } else {
    visibleTracks = sortTracks(filtered);
  }

  updateFilterButtons();

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
        <div class="track ${active ? "active" : ""}" role="button" tabindex="0" data-id="${escapeHtml(track.id)}">
          <span class="track-index">${active && !audio.paused ? "▶" : "♫"}</span>
          <span class="track-copy">
            <span class="track-title">${escapeHtml(track.displayTitle)}${comments[track.id] ? '<span class="track-comment-badge" title="Har kommentar">●</span>' : ''}${timestampNotes[track.id]?.length ? '<span class="track-comment-badge" title="Har tidsanteckningar">◆</span>' : ''}</span>
            <span class="track-folder">${escapeHtml(cleanFolder(track.folder))}</span>
          </span>
          <span class="track-date">${escapeHtml(formatDate(track.modified))}</span>
          <span class="track-size">${formatSize(track.size)}</span>
          <button class="track-favorite ${favoriteIds.has(track.id) ? "on" : ""}"
                  type="button"
                  data-favorite-id="${escapeHtml(track.id)}"
                  title="Favorit">${favoriteIds.has(track.id) ? "★" : "☆"}</button>
          <a class="track-download"
             href="/api/download/${encodeURIComponent(track.id)}"
             data-download-id="${escapeHtml(track.id)}"
             title="Ladda ned filen"
             aria-label="Ladda ned ${escapeHtml(track.displayTitle)}">↓</a>
        </div>
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


function formatFilmDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs}`
    : `${minutes}:${secs}`;
}

function formatFilmDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function filmYear(film) {
  const date = new Date(film.publishedAt || film.addedAt);
  return Number.isNaN(date.getTime()) ? "Okänt år" : date.getFullYear();
}

function sortFilms(list) {
  const mode = filmSortSelect.value;

  return [...list].sort((a, b) => {
    if (mode === "newest") {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    }

    if (mode === "oldest") {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }

    if (mode === "title") {
      return a.title.localeCompare(b.title, "sv", {
        numeric: true,
        sensitivity: "base"
      });
    }

    if (mode === "duration") {
      return b.durationSeconds - a.durationSeconds;
    }

    return a.position - b.position;
  });
}

function renderFilms() {
  const query = filmSearchInput.value.trim().toLocaleLowerCase("sv");

  visibleFilms = sortFilms(
    films.filter((film) =>
      `${film.title} ${film.description} ${film.channelTitle}`
        .toLocaleLowerCase("sv")
        .includes(query)
    )
  );

  filmCount.textContent =
    `${visibleFilms.length} av ${films.length} ` +
    `${films.length === 1 ? "film" : "filmer"}`;

  if (!visibleFilms.length) {
    filmGrid.innerHTML =
      '<div class="message">Inga videor matchar sökningen.</div>';
    return;
  }

  const groupByYear =
    filmSortSelect.value === "newest" ||
    filmSortSelect.value === "oldest";

  let previousYear = null;
  const html = [];

  for (const film of visibleFilms) {
    const year = filmYear(film);

    if (groupByYear && year !== previousYear) {
      html.push(
        `<div class="film-year-heading">${escapeHtml(year)}</div>`
      );
      previousYear = year;
    }

    html.push(`
      <button class="film-entry ${currentFilm?.id === film.id ? "active" : ""}"
              type="button"
              data-film-id="${escapeHtml(film.id)}">
        <div class="film-thumbnail-wrap">
          <img class="film-thumbnail"
               src="${escapeHtml(film.thumbnail)}"
               alt=""
               loading="lazy">
          <span class="film-play-mark" aria-hidden="true">▶</span>
          ${film.durationSeconds
            ? `<span class="film-duration">${formatFilmDuration(film.durationSeconds)}</span>`
            : ""}
        </div>

        <div class="film-entry-copy">
          <strong class="film-entry-title">${escapeHtml(film.title)}</strong>
          <span class="film-entry-meta">
            <span>${escapeHtml(formatFilmDate(film.publishedAt))}</span>
            <span>${escapeHtml(film.channelTitle)}</span>
          </span>
        </div>
      </button>
    `);
  }

  filmGrid.innerHTML = html.join("");
}

function selectFilm(film) {
  if (!film) return;

  currentFilm = film;
  filmNowTitle.textContent = film.title;

  const pieces = [
    formatFilmDate(film.publishedAt),
    formatFilmDuration(film.durationSeconds),
    film.channelTitle
  ].filter(Boolean);

  filmNowMeta.textContent = pieces.join(" · ");
  filmPlayer.src =
    `https://www.youtube-nocookie.com/embed/${encodeURIComponent(film.id)}?autoplay=1&rel=0&list=PLA74wG8-e4XBIKCB6HkAg-s2nvVR1hFQ8`;
  filmYouTubeLink.href =
    `https://www.youtube.com/watch?v=${encodeURIComponent(film.id)}&list=PLA74wG8-e4XBIKCB6HkAg-s2nvVR1hFQ8`;

  renderFilms();
  filmPlayer.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function loadFilms(force = false) {
  filmMessage.classList.add("hidden");
  refreshFilmsButton.disabled = true;
  refreshFilmsButton.textContent = "Uppdaterar…";

  try {
    if (force) {
      const refreshResponse = await fetch("/api/videos/refresh", {
        method: "POST"
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error(
          refreshData.error || "Film Archive kunde inte uppdateras."
        );
      }
    }

    const response = await fetch("/api/videos");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Film Archive kunde inte läsas."
      );
    }

    films = data.videos || [];
    filmArchiveTab.querySelector("small").textContent =
      `${films.length} ${films.length === 1 ? "film" : "filmer"}`;

    renderFilms();

    if (films.length && !currentFilm) {
      selectFilm(films[0]);
    }
  } catch (error) {
    filmMessage.textContent = error.message;
    filmMessage.classList.remove("hidden");
    filmCount.textContent = "Film Archive kunde inte läsas";
  } finally {
    refreshFilmsButton.disabled = false;
    refreshFilmsButton.textContent = "Uppdatera";
  }
}

function setArchiveView(view) {
  const showAudio = view === "audio";

  audioArchiveTab.classList.toggle("active", showAudio);
  filmArchiveTab.classList.toggle("active", !showAudio);
  audioArchiveView.classList.toggle("hidden", !showAudio);
  filmArchiveView.classList.toggle("hidden", showAudio);

  localStorage.setItem("gravitards-archive-view", view);

  if (!showAudio && films.length === 0) {
    loadFilms();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
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
    audioArchiveCount.textContent =
      `${tracks.length} ${tracks.length === 1 ? "Vault Entry" : "Vault Entries"}`;
    folderPath.textContent = `▱ ${data.folder}`;
    updateSummary();
    updateYearJump();
    renderTimeline();
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
  downloadCurrentButton.disabled = false;
  addToRecent(track.id);
  nowTitle.textContent = track.displayTitle;
  nowMeta.textContent = `${track.year} · ${cleanFolder(track.folder)}`;
  audio.src = `/api/play/${encodeURIComponent(track.id)}?t=${Date.now()}`;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  chapterMarkers.innerHTML = "";
  loadCommentForCurrentTrack();
  renderTimestampNotes();
  timestampComposer.classList.add("hidden");
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
  const downloadLink = event.target.closest("[data-download-id]");

  if (downloadLink) {
    event.stopPropagation();
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite-id]");

  if (favoriteButton) {
    event.stopPropagation();
    const id = favoriteButton.dataset.favoriteId;
    favoriteIds.has(id) ? favoriteIds.delete(id) : favoriteIds.add(id);
    saveFavorites();
    renderTracks();
    return;
  }

  const yearButton = event.target.closest("[data-toggle-year]");

  if (yearButton) {
    const year = yearButton.dataset.toggleYear;
    collapsedYears.has(year) ? collapsedYears.delete(year) : collapsedYears.add(year);
    saveCollapsedYears();
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
  saveCollapsedYears();
  renderTracks();
});

collapseAllButton.addEventListener("click", () => {
  visibleTracks.forEach(track => collapsedYears.add(String(track.year)));
  saveCollapsedYears();
  renderTracks();
});


yearJumpSelect.addEventListener("change", () => {
  const year = yearJumpSelect.value;
  if (!year) return;

  collapsedYears.delete(year);
  saveCollapsedYears();
  renderTracks();

  requestAnimationFrame(() => {
    const group = document.querySelector(`.year-group[data-year="${CSS.escape(year)}"]`);
    if (!group) return;

    group.scrollIntoView({ behavior: "smooth", block: "start" });
    group.classList.add("flash-highlight");
    window.setTimeout(() => group.classList.remove("flash-highlight"), 1500);
  });

  yearJumpSelect.value = "";
});



vaultTimeline.addEventListener("click", event => {
  const button = event.target.closest("[data-timeline-year]");
  if (!button) return;

  timelineYearFilter =
    timelineYearFilter === button.dataset.timelineYear
      ? null
      : button.dataset.timelineYear;

  renderTimeline();
  renderTracks();

  if (timelineYearFilter) {
    requestAnimationFrame(() => {
      document.querySelector(".year-group")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }
});

clearTimelineFilterButton.addEventListener("click", () => {
  timelineYearFilter = null;
  renderTimeline();
  renderTracks();
});

addTimestampButton.addEventListener("click", () => {
  if (!currentTrack) return;

  pendingTimestampSeconds = Math.max(0, Math.floor(audio.currentTime || 0));
  timestampComposerTime.textContent = formatTime(pendingTimestampSeconds);
  timestampInput.value = "";
  timestampComposer.classList.remove("hidden");
  timestampInput.focus();
});

cancelTimestampButton.addEventListener("click", () => {
  timestampComposer.classList.add("hidden");
  timestampInput.value = "";
});

saveTimestampButton.addEventListener("click", () => {
  if (!currentTrack) return;

  const text = timestampInput.value.trim();
  if (!text) {
    timestampInput.focus();
    return;
  }

  timestampNotes[currentTrack.id] ||= [];
  timestampNotes[currentTrack.id].push({
    seconds: pendingTimestampSeconds,
    text,
    createdAt: new Date().toISOString()
  });

  saveTimestampNotes();
  timestampComposer.classList.add("hidden");
  timestampInput.value = "";
  renderTimestampNotes();
  renderTracks();
});

timestampInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    saveTimestampButton.click();
  }
});

timestampList.addEventListener("click", event => {
  const jumpButton = event.target.closest("[data-jump-seconds]");
  if (jumpButton) {
    audio.currentTime = Number(jumpButton.dataset.jumpSeconds);
    if (audio.paused) audio.play();
    return;
  }

  const deleteButton = event.target.closest("[data-delete-timestamp]");
  if (!deleteButton || !currentTrack) return;

  const notes = timestampNotes[currentTrack.id] || [];
  notes.splice(Number(deleteButton.dataset.deleteTimestamp), 1);

  if (!notes.length) delete timestampNotes[currentTrack.id];

  saveTimestampNotes();
  renderTimestampNotes();
  renderTracks();
});

favoritesFilterButton.addEventListener("click", () => {
  activeFilter = activeFilter === "favorites" ? "all" : "favorites";
  renderTracks();
});

recentFilterButton.addEventListener("click", () => {
  activeFilter = activeFilter === "recent" ? "all" : "recent";
  renderTracks();
});

saveCommentButton.addEventListener("click", () => {
  if (!currentTrack) return;

  const value = commentInput.value.trim();

  if (value) {
    comments[currentTrack.id] = value;
  } else {
    delete comments[currentTrack.id];
  }

  saveComments();
  loadCommentForCurrentTrack();
  renderTimestampNotes();
  timestampComposer.classList.add("hidden");
  renderTracks();
  commentStatus.textContent = value ? "Sparad" : currentTrack.displayTitle;

  window.setTimeout(() => {
    if (currentTrack) commentStatus.textContent = currentTrack.displayTitle;
  }, 1200);
});

deleteCommentButton.addEventListener("click", () => {
  if (!currentTrack) return;
  delete comments[currentTrack.id];
  saveComments();
  loadCommentForCurrentTrack();
  renderTimestampNotes();
  timestampComposer.classList.add("hidden");
  renderTracks();
});

commentInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    saveCommentButton.click();
  }
});

shuffleAllButton.addEventListener("click", () => {
  if (!tracks.length) return;
  shuffled = true;
  shuffledQueue = [];
  shuffleButton.classList.add("on");
  const queue = buildQueue();
  playTrack(queue[0]);
});

downloadCurrentButton.addEventListener("click", () => {
  if (!currentTrack) return;

  const link = document.createElement("a");
  link.href = `/api/download/${encodeURIComponent(currentTrack.id)}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
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
  updateDisplayedTimes();
  renderChapterMarkers();
});

audio.addEventListener("timeupdate", () => {
  updateDisplayedTimes();
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


duration.addEventListener("click", () => {
  showRemainingTime = !showRemainingTime;
  updateDisplayedTimes();
});

currentTime.addEventListener("dblclick", () => {
  timeDisplayMode = (timeDisplayMode + 1) % 3;
  updateDisplayedTimes();
  renderTimestampNotes();
});

duration.addEventListener("dblclick", event => {
  event.preventDefault();
  timeDisplayMode = (timeDisplayMode + 1) % 3;
  updateDisplayedTimes();
  renderTimestampNotes();
});

seekWrap.addEventListener("mousemove", event => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

  const rect = seekWrap.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const previewSeconds = ratio * audio.duration;

  seekTooltip.textContent = formatTime(previewSeconds, timeDisplayMode);
  seekTooltip.style.left = `${ratio * 100}%`;
  seekTooltip.classList.remove("hidden");
});

seekWrap.addEventListener("mouseleave", () => {
  seekTooltip.classList.add("hidden");
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
  const target = event.target;

  const isTyping =
    target instanceof HTMLElement &&
    (
      target.matches("input, textarea, select") ||
      target.isContentEditable
    );

  if (isTyping) return;

  if (event.code === "Space") {
    event.preventDefault();
    playButton.click();
  }

  if (event.code === "ArrowRight") step(1);
  if (event.code === "ArrowLeft") step(-1);
});


filmGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-film-id]");
  if (!button) return;

  selectFilm(films.find((film) => film.id === button.dataset.filmId));
});

filmSearchInput.addEventListener("input", renderFilms);
filmSortSelect.addEventListener("change", renderFilms);
refreshFilmsButton.addEventListener("click", () => loadFilms(true));

audioArchiveTab.addEventListener("click", () => setArchiveView("audio"));
filmArchiveTab.addEventListener("click", () => setArchiveView("film"));

const savedArchiveView = localStorage.getItem("gravitards-archive-view") || "audio";
setArchiveView(savedArchiveView === "film" ? "film" : "audio");

updateFilterButtons();
loadCommentForCurrentTrack();
renderTimestampNotes();
loadTracks();
