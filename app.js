const audio = document.querySelector("#audio");
const shareAudioButton = document.querySelector("#shareAudioButton");
const audioArchiveTab = document.querySelector("#audioArchiveTab");
const soundCloudIframe = document.querySelector("#soundCloudPlayer");
const filmArchiveTab = document.querySelector("#filmArchiveTab");
const filmArchiveCount = document.querySelector("#filmArchiveCount");
const audioArchiveView = document.querySelector("#audioArchiveView");
const filmArchiveView = document.querySelector("#filmArchiveView");
const audioArchiveCount = document.querySelector("#audioArchiveCount");
const dropboxFilmPlayer = document.querySelector("#dropboxFilmPlayer");
const filmDownloadLink = document.querySelector("#filmDownloadLink");
const shareFilmButton = document.querySelector("#shareFilmButton");
const filmPreviousButton = document.querySelector("#filmPreviousButton");
const filmNextButton = document.querySelector("#filmNextButton");
const youtubeFilmsTab = document.querySelector("#youtubeFilmsTab");
const facebookStreamsTab = document.querySelector("#facebookStreamsTab");
const instagramStreamsTab = document.querySelector("#instagramStreamsTab");
const youtubeFilmsCount = document.querySelector("#youtubeFilmsCount");
const facebookStreamsCount = document.querySelector("#facebookStreamsCount");
const instagramStreamsCount = document.querySelector("#instagramStreamsCount");
const filmTimelineCard = document.querySelector("#filmTimelineCard");
const filmLibraryTitle = document.querySelector("#filmLibraryTitle");
const filmArchiveContent = document.querySelector("#filmArchiveContent");
const filmPortalTitle = document.querySelector("#filmPortalTitle");
const filmPortalSubtitle = document.querySelector("#filmPortalSubtitle");
const filmCollectionGrid = document.querySelector(".film-collection-grid");
const shareToast = document.querySelector("#shareToast");
const filmNowTitle = document.querySelector("#filmNowTitle");
const filmNowMeta = document.querySelector("#filmNowMeta");
const filmCount = document.querySelector("#filmCount");
const filmGrid = document.querySelector("#filmGrid");
const filmMessage = document.querySelector("#filmMessage");
const filmSearchInput = document.querySelector("#filmSearchInput");
const filmSortSelect = document.querySelector("#filmSortSelect");
const refreshFilmsButton = document.querySelector("#refreshFilmsButton");
const filmTimeline = document.querySelector("#filmTimeline");
const clearFilmYearButton = document.querySelector("#clearFilmYearButton");
const filmCommentInput = document.querySelector("#filmCommentInput");
const filmCommentAuthorInput = document.querySelector("#filmCommentAuthorInput");
const filmCommentList = document.querySelector("#filmCommentList");
const filmCommentStatus = document.querySelector("#filmCommentStatus");
const saveFilmCommentButton = document.querySelector("#saveFilmCommentButton");
const filmCurrentTime = document.querySelector("#filmCurrentTime");
const filmTimestampInput = document.querySelector("#filmTimestampInput");
const saveFilmTimestampButton = document.querySelector("#saveFilmTimestampButton");
const filmTimestampList = document.querySelector("#filmTimestampList");
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
const commentAuthorInput = document.querySelector("#commentAuthorInput");
const audioCommentList = document.querySelector("#audioCommentList");
const commentStatus = document.querySelector("#commentStatus");
const saveCommentButton = document.querySelector("#saveCommentButton");

let tracks = [];
let films = [];
let youtubeFilms = [];
let facebookStreams = [];
let instagramStreams = [];
let visibleFilms = [];
let currentFilm = null;
let pendingSharedLocation = null;
let shareToastTimer = null;
let mediaSwitchInProgress = false;
let activeFilmSource = "";
let activeAudioSource = "vault";
let soundCloudWidget = null;
let soundCloudReady = false;
let audioSharedComments = [];
let filmSharedComments = [];
let filmYearFilter = null;
let filmClockTimer = null;

const FILM_TIMESTAMPS_STORAGE_KEY = "gravitards-film-timestamps";


const filmTimestampNotes = JSON.parse(
  localStorage.getItem(FILM_TIMESTAMPS_STORAGE_KEY) || "{}"
);
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
const COMMENT_AUTHOR_STORAGE_KEY = "gravitards-comment-author";
const RECENT_STORAGE_KEY = "gravitards-recent";
const TIMESTAMPS_STORAGE_KEY = "gravitards-timestamps";

const favoriteIds = new Set(
  JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]")
);
let savedCommentAuthor = localStorage.getItem(COMMENT_AUTHOR_STORAGE_KEY) || "";
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



function pauseVideoForAudio() {
  if (
    mediaSwitchInProgress ||
    !dropboxFilmPlayer ||
    dropboxFilmPlayer.paused
  ) {
    return;
  }

  mediaSwitchInProgress = true;
  dropboxFilmPlayer.pause();

  window.setTimeout(() => {
    mediaSwitchInProgress = false;
  }, 0);
}

function pauseAudioForVideo() {
  if (
    mediaSwitchInProgress ||
    !audio ||
    audio.paused
  ) {
    return;
  }

  mediaSwitchInProgress = true;
  audio.pause();

  window.setTimeout(() => {
    mediaSwitchInProgress = false;
  }, 0);
}


function pauseSoundCloudPlayer() {
  if (soundCloudWidget && soundCloudReady) soundCloudWidget.pause();
}
function initializeSoundCloudWidget() {
  if (!soundCloudIframe || !window.SC?.Widget) return;
  soundCloudWidget = window.SC.Widget(soundCloudIframe);
  soundCloudWidget.bind(window.SC.Widget.Events.READY, () => { soundCloudReady = true; });
  soundCloudWidget.bind(window.SC.Widget.Events.PLAY, () => {
    audio.pause();
    dropboxFilmPlayer.pause();
  });
}

function showShareToast(message = "Link copied") {
  shareToast.textContent = message;
  shareToast.classList.remove("hidden");

  window.clearTimeout(shareToastTimer);
  shareToastTimer = window.setTimeout(() => {
    shareToast.classList.add("hidden");
  }, 2200);
}

async function copyTextToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function buildVaultShareUrl({ archive, source = "", entryId, seconds = null }) {
  const url = new URL(window.location.href);
  url.hash = "";

  const params = new URLSearchParams({
    archive,
    id: entryId
  });

  if (source) params.set("source", source);

  if (Number.isFinite(seconds) && seconds > 0) {
    params.set("t", String(Math.floor(seconds)));
  }

  url.hash = params.toString();
  return url.toString();
}

function parseVaultShareLocation() {
  const rawHash = window.location.hash.replace(/^#/, "");
  if (!rawHash) return null;

  const params = new URLSearchParams(rawHash);
  const archive = params.get("archive");
  const id = params.get("id");

  if (!["audio", "video"].includes(archive) || !id) return null;

  const secondsValue = Number(params.get("t"));

  return {
    archive,
    source: params.get("source") || "",
    id,
    seconds:
      Number.isFinite(secondsValue) && secondsValue >= 0
        ? Math.floor(secondsValue)
        : null
  };
}

function seekSharedAudio(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return;

  const applySeek = () => {
    audio.currentTime = Math.max(0, seconds);
    audio.play().catch(() => {});
  };

  if (audio.readyState >= 1) {
    applySeek();
  } else {
    audio.addEventListener("loadedmetadata", applySeek, { once: true });
  }
}

function seekSharedFilm(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return;

  const applySeek = () => {
    dropboxFilmPlayer.currentTime = Math.max(0, seconds);
    dropboxFilmPlayer.play().catch(() => {});
  };

  if (dropboxFilmPlayer.readyState >= 1) {
    applySeek();
  } else {
    dropboxFilmPlayer.addEventListener(
      "loadedmetadata",
      applySeek,
      { once: true }
    );
  }
}

function addTimestampShareButtons(container, archive) {
  container
    .querySelectorAll("[data-audio-jump], [data-film-jump]")
    .forEach(button => {
      const note = button.closest(".timestamp-note");
      if (!note || note.querySelector(".timestamp-share")) return;

      const seconds = Number(
        button.dataset.audioJump ?? button.dataset.filmJump
      );

      const shareButton = document.createElement("button");
      shareButton.className = "timestamp-share";
      shareButton.type = "button";
      shareButton.title = "Copy link to this timestamp";
      shareButton.setAttribute("aria-label", "Copy timestamp link");
      shareButton.textContent = "↗";

      shareButton.addEventListener("click", async event => {
        event.stopPropagation();

        let url = "";

        if (archive === "audio" && currentTrack) {
          url = buildVaultShareUrl({
            archive: "audio",
            entryId: currentTrack.id,
            seconds
          });
        }

        if (archive === "video" && currentFilm) {
          url = buildVaultShareUrl({
            archive: "video",
            source: activeFilmSource,
            entryId: currentFilm.id,
            seconds
          });
        }

        if (!url) return;

        await copyTextToClipboard(url);
        showShareToast("Timestamp link copied");
      });

      const deleteButton = note.querySelector(".timestamp-delete");

      if (deleteButton) {
        note.insertBefore(shareButton, deleteButton);
      } else {
        note.appendChild(shareButton);
      }
    });
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


function savePreferredAuthor(author) {
  savedCommentAuthor = String(author || "").trim();
  localStorage.setItem(COMMENT_AUTHOR_STORAGE_KEY, savedCommentAuthor);
}

function saveRecent() {
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentIds));
}


function formatSharedCommentDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function renderSharedCommentList(element, comments, emptyText) {
  element.classList.remove("shared-comment-loading");

  if (!comments.length) {
    element.innerHTML =
      `<p class="shared-comments-empty">${escapeHtml(emptyText)}</p>`;
    return;
  }

  element.innerHTML = comments.map(comment => `
    <article class="shared-comment-item">
      <div class="shared-comment-meta">
        <strong class="shared-comment-author">${escapeHtml(comment.author)}</strong>
        <time class="shared-comment-date"
              datetime="${escapeHtml(comment.created_at || "")}">
          ${escapeHtml(formatSharedCommentDate(comment.created_at))}
        </time>
      </div>
      <p class="shared-comment-text">${escapeHtml(comment.comment)}</p>
    </article>
  `).join("");

  element.scrollTop = element.scrollHeight;
}

async function fetchSharedComments(entryType, entryId) {
  const params = new URLSearchParams({
    type: entryType,
    id: entryId
  });

  const response = await fetch(`/api/comments?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kommentarerna kunde inte hämtas.");
  }

  return data.comments || [];
}

async function postSharedComment(entryType, entryId, author, comment) {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      entry_type: entryType,
      entry_id: entryId,
      author,
      comment
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kommentaren kunde inte sparas.");
  }

  return data.comment;
}

function updateFilterButtons() {
  favoritesFilterButton.classList.toggle("active", activeFilter === "favorites");
  recentFilterButton.classList.toggle("active", activeFilter === "recent");
  favoritesFilterButton.textContent =
    `${activeFilter === "favorites" ? "★" : "☆"} Favoriter (${favoriteIds.size})`;
}

async function loadCommentForCurrentTrack() {
  if (!currentTrack) {
    commentInput.value = "";
    commentAuthorInput.value = savedCommentAuthor;
    commentInput.disabled = true;
    commentAuthorInput.disabled = true;
    saveCommentButton.disabled = true;
    commentStatus.textContent = "Ingen inspelning vald";
    audioSharedComments = [];
    renderSharedCommentList(
      audioCommentList,
      [],
      "Välj en inspelning för att läsa kommentarer."
    );
    return;
  }

  const requestedId = currentTrack.id;

  commentInput.disabled = false;
  commentAuthorInput.disabled = false;
  saveCommentButton.disabled = false;
  commentAuthorInput.value = savedCommentAuthor;
  commentStatus.textContent = "Läser kommentarer…";
  audioCommentList.classList.add("shared-comment-loading");

  try {
    const loaded = await fetchSharedComments("audio", requestedId);

    if (currentTrack?.id !== requestedId) return;

    audioSharedComments = loaded;
    renderSharedCommentList(
      audioCommentList,
      audioSharedComments,
      "Det finns inga kommentarer ännu."
    );

    commentStatus.textContent =
      `${audioSharedComments.length} ` +
      `${audioSharedComments.length === 1 ? "kommentar" : "kommentarer"}`;
  } catch (error) {
    if (currentTrack?.id !== requestedId) return;

    audioSharedComments = [];
    renderSharedCommentList(
      audioCommentList,
      [],
      error.message
    );
    commentStatus.textContent = "Kunde inte läsa kommentarer";
  }
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
              title="Delete">×</button>
    </div>
  `).join("");
  addTimestampShareButtons(timestampList, "audio");
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
      `<div class="message">${tracks.length ? "No recordings match your search." : "Inga ljudfiler hittades."}</div>`;
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
            <span class="track-title">${escapeHtml(track.displayTitle)}${timestampNotes[track.id]?.length ? '<span class="track-comment-badge" title="Has timestamp notes">◆</span>' : ''}</span>
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


function saveFilmTimestampNotes() {
  localStorage.setItem(
    FILM_TIMESTAMPS_STORAGE_KEY,
    JSON.stringify(filmTimestampNotes)
  );
}

function getCurrentFilmSeconds() {
  return Number.isFinite(dropboxFilmPlayer.currentTime)
    ? Math.max(0, Math.floor(dropboxFilmPlayer.currentTime))
    : 0;
}

function updateFilmCurrentTime() {
  filmCurrentTime.textContent =
    formatFilmDuration(getCurrentFilmSeconds()) || "0:00";
}

function startFilmClock() {
  window.clearInterval(filmClockTimer);
  filmClockTimer = window.setInterval(updateFilmCurrentTime, 500);
}

function renderFilmTimeline() {
  const years = [...new Set(
    films
      .map(film => filmYear(film))
      .filter(year => typeof year === "number")
  )].sort((a, b) => a - b);

  filmTimelineCard.classList.toggle("hidden", years.length === 0);

  if (!years.length) {
    filmYearFilter = null;
    filmTimeline.innerHTML = "";
    clearFilmYearButton.classList.add("hidden");
    return;
  }

  filmTimeline.innerHTML = years.map(year => `
    <button class="timeline-year ${filmYearFilter === String(year) ? "active" : ""}"
            type="button"
            data-film-year="${year}">
      ${year}
    </button>
  `).join("");

  clearFilmYearButton.classList.toggle("hidden", !filmYearFilter);
}

async function loadFilmComment() {
  if (!currentFilm) {
    filmCommentInput.value = "";
    filmCommentAuthorInput.value = savedCommentAuthor;
    filmCommentInput.disabled = true;
    filmCommentAuthorInput.disabled = true;
    saveFilmCommentButton.disabled = true;
    filmCommentStatus.textContent = "Ingen video vald";
    filmSharedComments = [];
    renderSharedCommentList(
      filmCommentList,
      [],
      "Välj en video för att läsa kommentarer."
    );
    return;
  }

  const requestedId = currentFilm.id;

  filmCommentInput.disabled = false;
  filmCommentAuthorInput.disabled = false;
  saveFilmCommentButton.disabled = false;
  filmCommentAuthorInput.value = savedCommentAuthor;
  filmCommentStatus.textContent = "Läser kommentarer…";
  filmCommentList.classList.add("shared-comment-loading");

  try {
    const loaded = await fetchSharedComments("video", requestedId);

    if (currentFilm?.id !== requestedId) return;

    filmSharedComments = loaded;
    renderSharedCommentList(
      filmCommentList,
      filmSharedComments,
      "Det finns inga kommentarer ännu."
    );

    filmCommentStatus.textContent =
      `${filmSharedComments.length} ` +
      `${filmSharedComments.length === 1 ? "kommentar" : "kommentarer"}`;
  } catch (error) {
    if (currentFilm?.id !== requestedId) return;

    filmSharedComments = [];
    renderSharedCommentList(
      filmCommentList,
      [],
      error.message
    );
    filmCommentStatus.textContent = "Kunde inte läsa kommentarer";
  }
}

function renderFilmTimestampNotes() {
  if (!currentFilm) {
    filmTimestampList.innerHTML =
      '<p class="empty-timestamps">Välj en video för att se anteckningar.</p>';
    saveFilmTimestampButton.disabled = true;
    return;
  }

  saveFilmTimestampButton.disabled = false;

  const notes = [...(filmTimestampNotes[currentFilm.id] || [])]
    .sort((a, b) => a.seconds - b.seconds);

  if (!notes.length) {
    filmTimestampList.innerHTML =
      '<p class="empty-timestamps">Inga tidsanteckningar för videon ännu.</p>';
    return;
  }

  filmTimestampList.innerHTML = notes.map((note, index) => `
    <div class="timestamp-note">
      <button class="timestamp-jump"
              type="button"
              data-film-jump="${note.seconds}">
        ${formatFilmDuration(note.seconds)}
      </button>
      <div class="timestamp-text">${escapeHtml(note.text)}</div>
      <button class="timestamp-delete"
              type="button"
              data-film-timestamp-delete="${index}"
              title="Delete">×</button>
    </div>
  `).join("");
  addTimestampShareButtons(filmTimestampList, "video");
}

function renderFilms() {
  const query = filmSearchInput.value.trim().toLocaleLowerCase("sv");

  let filteredFilms = films.filter(film =>
    `${film.title} ${film.description || ""} ${film.channelTitle || ""} ${film.originalName || ""}`
      .toLocaleLowerCase("sv")
      .includes(query)
  );

  if (activeFilmSource === "youtube" && filmYearFilter) {
    filteredFilms = filteredFilms.filter(
      film => String(filmYear(film)) === filmYearFilter
    );
  }

  visibleFilms =
    activeFilmSource === "youtube"
      ? sortFilms(filteredFilms)
      : [...filteredFilms].sort((a, b) => a.position - b.position);

  filmCount.textContent =
    `${visibleFilms.length} av ${films.length} ` +
    `${films.length === 1 ? "film" : "films"}`;

  if (!visibleFilms.length) {
    filmGrid.innerHTML =
      '<div class="message">No videos match your search.</div>';
    return;
  }

  const groupByYear =
    activeFilmSource === "youtube" &&
    (filmSortSelect.value === "newest" ||
     filmSortSelect.value === "oldest");

  let previousYear = null;
  const html = [];

  for (const film of visibleFilms) {
    const year = activeFilmSource === "youtube"
      ? filmYear(film)
      : null;

    if (groupByYear && year !== previousYear) {
      html.push(
        `<div class="film-year-heading">${escapeHtml(year)}</div>`
      );
      previousYear = year;
    }

    const coverImage =
      activeFilmSource === "youtube"
        ? "youtube-cover.jpg"
        : activeFilmSource === "facebook"
          ? "facebook-cover.jpg"
          : "instagram-cover.jpg";

    const thumbnail = `
      <img class="film-thumbnail vault-stream-thumbnail"
           src="${coverImage}"
           alt=""
           loading="lazy">
    `;

    const duration =
      film.durationSeconds
        ? `<span class="film-duration">${formatFilmDuration(film.durationSeconds)}</span>`
        : "";

    const meta =
      activeFilmSource === "youtube"
        ? `<span>YouTube Archive</span>
           <span>${formatSize(film.size)}</span>`
        : activeFilmSource === "facebook"
          ? `<span>Facebook Live</span>
             <span>${formatSize(film.size)}</span>`
          : `<span>Instagram</span>
             <span>${formatSize(film.size)}</span>`;

    const originalName =
      `<span class="facebook-original-name"
               title="${escapeHtml(film.originalName)}">
           ${escapeHtml(film.originalName)}
         </span>`;

    html.push(`
      <button class="film-entry ${currentFilm?.id === film.id ? "active" : ""}"
              type="button"
              data-film-id="${escapeHtml(film.id)}">
        <div class="film-thumbnail-wrap">
          ${thumbnail}
          <span class="film-play-mark" aria-hidden="true">▶</span>
          ${duration}
        </div>

        <div class="film-entry-copy">
          <strong class="film-entry-title">${escapeHtml(film.title)}${filmTimestampNotes[film.id]?.length ? '<span class="film-entry-note-badge" title="Has timestamp notes">◆</span>' : ''}</strong>
          ${originalName}
          <span class="film-entry-meta">
            ${meta}
          </span>
        </div>
      </button>
    `);
  }

  filmGrid.innerHTML = html.join("");
  updateFilmNavigationControls();
}


function updateAudioNavigationControls() {
  const queue = visibleTracks.length ? visibleTracks : tracks;
  const hasSelection = Boolean(currentTrack);
  const canNavigate = hasSelection && queue.length > 0;

  shareAudioButton.disabled = !hasSelection;
}

function updateFilmNavigationControls() {
  const queue = visibleFilms.length ? visibleFilms : films;
  const hasSelection = Boolean(currentFilm);
  const canNavigate = hasSelection && queue.length > 0;

  filmPreviousButton.disabled = !canNavigate;
  filmNextButton.disabled = !canNavigate;
  shareFilmButton.disabled = !hasSelection;

  filmDownloadLink.classList.toggle(
    "disabled-link",
    !hasSelection
  );

  filmDownloadLink.setAttribute(
    "aria-disabled",
    hasSelection ? "false" : "true"
  );
}

function selectFilm(film) {
  if (!film) return;

  currentFilm = film;
  filmCurrentTime.textContent = "0:00";
  filmNowTitle.textContent = film.title;

  const sourceLabel =
    activeFilmSource === "youtube"
      ? "YouTube Archive"
      : activeFilmSource === "facebook"
        ? "Facebook Live"
        : "Instagram";

  const pieces = [
    sourceLabel,
    formatSize(film.size),
    film.originalName
  ].filter(Boolean);

  filmNowMeta.textContent = pieces.join(" · ");

  const playEndpoint =
    activeFilmSource === "youtube"
      ? `/api/videos/play/${encodeURIComponent(film.dropboxId)}`
      : activeFilmSource === "facebook"
        ? `/api/facebook-streams/play/${encodeURIComponent(film.dropboxId)}`
        : `/api/instagram-streams/play/${encodeURIComponent(film.dropboxId)}`;

  const downloadEndpoint =
    activeFilmSource === "youtube"
      ? `/api/videos/download/${encodeURIComponent(film.dropboxId)}`
      : activeFilmSource === "facebook"
        ? `/api/facebook-streams/download/${encodeURIComponent(film.dropboxId)}`
        : `/api/instagram-streams/download/${encodeURIComponent(film.dropboxId)}`;

  dropboxFilmPlayer.src = playEndpoint;
  filmDownloadLink.href = downloadEndpoint;
  filmDownloadLink.classList.remove("hidden");
  updateFilmNavigationControls();

  dropboxFilmPlayer.play().catch(() => {});
  saveFilmTimestampButton.disabled = false;

  loadFilmComment();
  renderFilmTimestampNotes();
  renderFilms();

  dropboxFilmPlayer.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


function stepFilm(direction) {
  const queue = visibleFilms.length ? visibleFilms : films;

  if (!queue.length) return;

  const currentIndex = queue.findIndex(
    film => film.id === currentFilm?.id
  );

  let nextIndex = currentIndex + direction;

  if (currentIndex < 0) {
    nextIndex = direction > 0 ? 0 : queue.length - 1;
  }

  if (nextIndex >= queue.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = queue.length - 1;

  selectFilm(queue[nextIndex]);
}


function updateFilmArchiveCount() {
  const total =
    youtubeFilms.length +
    facebookStreams.length +
    instagramStreams.length;

  if (filmArchiveCount) {
    filmArchiveCount.textContent =
      `${total} ${total === 1 ? "FILM" : "FILMER"}`;
  }
}

async function preloadFilmCounts(force = false) {
  try {
    await Promise.all([
      loadYouTubeFilms(force),
      loadFacebookStreams(force),
      loadInstagramStreams(force)
    ]);

    updateFilmArchiveCount();
  } catch (error) {
    console.error("Could not load film counters:", error);
  }
}

async function loadYouTubeFilms(force = false) {
  if (youtubeFilms.length && !force) return youtubeFilms;

  if (force) {
    const refreshResponse = await fetch("/api/videos/refresh", {
      method: "POST"
    });

    const refreshData = await refreshResponse.json();

    if (!refreshResponse.ok) {
      throw new Error(
        refreshData.error || "The YouTube folder could not be refreshed."
      );
    }
  }

  const response = await fetch("/api/videos");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "The YouTube folder could not be loaded."
    );
  }

  youtubeFilms = data.videos || [];
  updateFilmArchiveCount();
  youtubeFilmsCount.textContent =
    `${youtubeFilms.length} ${youtubeFilms.length === 1 ? "video" : "videos"}`;

  return youtubeFilms;
}

async function loadFacebookStreams(force = false) {
  if (facebookStreams.length && !force) return facebookStreams;

  if (force) {
    const refreshResponse = await fetch(
      "/api/facebook-streams/refresh",
      { method: "POST" }
    );

    const refreshData = await refreshResponse.json();

    if (!refreshResponse.ok) {
      throw new Error(
        refreshData.error || "Facebook Streams could not be refreshed."
      );
    }
  }

  const response = await fetch("/api/facebook-streams");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Facebook Streams could not be loaded."
    );
  }

  facebookStreams = data.streams || [];
  updateFilmArchiveCount();
  facebookStreamsCount.textContent =
    `${facebookStreams.length} ${facebookStreams.length === 1 ? "stream" : "streams"}`;

  return facebookStreams;
}


async function loadInstagramStreams(force = false) {
  if (instagramStreams.length && !force) return instagramStreams;

  if (force) {
    const refreshResponse = await fetch(
      "/api/instagram-streams/refresh",
      { method: "POST" }
    );
    const refreshData = await refreshResponse.json();
    if (!refreshResponse.ok) {
      throw new Error(
        refreshData.error || "Instagram Streams could not be refreshed."
      );
    }
  }

  const response = await fetch("/api/instagram-streams");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Instagram Streams could not be loaded."
    );
  }

  instagramStreams = data.streams || [];
  updateFilmArchiveCount();
  instagramStreamsCount.textContent =
    `${instagramStreams.length} ${
      instagramStreams.length === 1 ? "stream" : "streams"
    }`;

  return instagramStreams;
}

async function loadFilms(force = false) {
  filmMessage.classList.add("hidden");
  refreshFilmsButton.disabled = true;
  refreshFilmsButton.textContent = "Refreshing…";

  try {
    films =
      activeFilmSource === "facebook"
        ? await loadFacebookStreams(force)
        : activeFilmSource === "instagram"
          ? await loadInstagramStreams(force)
          : await loadYouTubeFilms(force);

    filmLibraryTitle.textContent =
      activeFilmSource === "facebook"
        ? "Alla Facebook Streams"
        : activeFilmSource === "instagram"
          ? "Alla Instagram Streams"
          : "Alla YouTube-videos";

    filmSortSelect.disabled = activeFilmSource === "facebook";
    renderFilmTimeline();
    renderFilms();
    window.setTimeout(tryOpenSharedFilm, 0);

    if (!currentFilm || currentFilm.source !== activeFilmSource) {
      currentFilm = null;

      if (films.length) {
        selectFilm(films[0]);
      } else {
        filmNowTitle.textContent = "No videos found";
        filmNowMeta.textContent = "";
        loadFilmComment();
        renderFilmTimestampNotes();
      }
    }

    updateFilmArchiveCount();
  } catch (error) {
    filmMessage.textContent = error.message;
    filmMessage.classList.remove("hidden");
    filmCount.textContent = "Film Archive could not be loaded";
  } finally {
    refreshFilmsButton.disabled = false;
    refreshFilmsButton.textContent = "Refresh";
  }
}


function filmSourceLabel(source) {
  if (source === "facebook") return "Facebook Streams";
  if (source === "instagram") return "Instagram Streams";
  return "YouTube Videos";
}

function updateFilmPortalState() {
  const cards = [
    youtubeFilmsTab,
    facebookStreamsTab,
    instagramStreamsTab
  ];

  for (const card of cards) {
    const active = card.dataset.filmSource === activeFilmSource;
    card.classList.toggle("active", active);
    card.setAttribute("aria-pressed", active ? "true" : "false");
  }

  filmCollectionGrid.classList.toggle(
    "has-selection",
    Boolean(activeFilmSource)
  );

  if (!activeFilmSource) {
    filmPortalTitle.textContent = "Choose a collection";
    filmPortalSubtitle.textContent =
      "Enter one of the three moving-image vaults.";
    filmArchiveContent.classList.add("hidden");
    return;
  }

  filmPortalTitle.textContent = filmSourceLabel(activeFilmSource);
  filmPortalSubtitle.textContent =
    `Currently exploring ${filmSourceLabel(activeFilmSource)}.`;

  filmArchiveContent.classList.remove("hidden");
}

function setFilmSource(source) {
  activeFilmSource =
    source === "facebook"
      ? "facebook"
      : source === "instagram"
        ? "instagram"
        : "youtube";

  updateFilmPortalState();
  filmArchiveContent.classList.add("is-switching");
  currentFilm = null;
  filmYearFilter = null;

  youtubeFilmsTab.classList.toggle(
    "active",
    activeFilmSource === "youtube"
  );

  facebookStreamsTab.classList.toggle(
    "active",
    activeFilmSource === "facebook"
  );

  instagramStreamsTab.classList.toggle(
    "active",
    activeFilmSource === "instagram"
  );

  localStorage.setItem(
    "gravitards-film-source",
    activeFilmSource
  );

  loadFilms().finally(() => {
    window.setTimeout(() => {
      filmArchiveContent.classList.remove("is-switching");
    }, 120);
  });
}


function tryOpenSharedAudio() {
  if (
    !pendingSharedLocation ||
    pendingSharedLocation.archive !== "audio" ||
    !tracks.length
  ) {
    return false;
  }

  const track = tracks.find(
    item => item.id === pendingSharedLocation.id
  );

  if (!track) {
    showShareToast("The track in this link could not be found");
    pendingSharedLocation = null;
    return false;
  }

  activeAudioSource = "vault";
  setArchiveView("audio");
  selectTrack(track);

  if (pendingSharedLocation.seconds !== null) {
    seekSharedAudio(pendingSharedLocation.seconds);
  }

  pendingSharedLocation = null;
  return true;
}

async function tryOpenSharedFilm() {
  if (
    !pendingSharedLocation ||
    pendingSharedLocation.archive !== "video"
  ) {
    return false;
  }

  const source =
    pendingSharedLocation.source === "facebook"
      ? "facebook"
      : pendingSharedLocation.source === "instagram"
        ? "instagram"
        : "youtube";

  setArchiveView("film");

  if (activeFilmSource !== source) {
    activeFilmSource = source;

    youtubeFilmsTab.classList.toggle(
      "active",
      source === "youtube"
    );

    facebookStreamsTab.classList.toggle(
      "active",
      source === "facebook"
    );

    instagramStreamsTab.classList.toggle(
      "active",
      source === "instagram"
    );

    updateFilmPortalState();
  }

  const sourceFilms =
    source === "facebook"
      ? await loadFacebookStreams()
      : source === "instagram"
        ? await loadInstagramStreams()
        : await loadYouTubeFilms();

  const film = sourceFilms.find(
    item => item.id === pendingSharedLocation.id
  );

  if (!film) {
    showShareToast("The video in this link could not be found");
    pendingSharedLocation = null;
    return false;
  }

  films = sourceFilms;
  renderFilmTimeline();
  renderFilms();
  selectFilm(film);

  if (pendingSharedLocation.seconds !== null) {
    seekSharedFilm(pendingSharedLocation.seconds);
  }

  pendingSharedLocation = null;
  return true;
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
  refreshButton.textContent = "↻ Refreshing…";

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
    window.setTimeout(tryOpenSharedAudio, 0);

    if (!tracks.length) {
      showMessage("Mappen innehåller inga ljudfiler. Kontrollera DROPBOX_FOLDER.");
    }
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "↻ Refresh";
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
  updateAudioNavigationControls();
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

saveCommentButton.addEventListener("click", async () => {
  if (!currentTrack) return;

  const comment = commentInput.value.trim();
  const author = commentAuthorInput.value.trim();

  if (!author) {
    commentAuthorInput.focus();
    commentStatus.textContent = "Skriv ditt namn";
    return;
  }

  if (!comment) {
    commentInput.focus();
    commentStatus.textContent = "Skriv en kommentar";
    return;
  }

  const requestedId = currentTrack.id;
  savePreferredAuthor(author);
  saveCommentButton.disabled = true;
  saveCommentButton.textContent = "Skickar…";

  try {
    await postSharedComment("audio", requestedId, author, comment);

    if (currentTrack?.id !== requestedId) return;

    commentInput.value = "";
    await loadCommentForCurrentTrack();
  } catch (error) {
    commentStatus.textContent = error.message;
  } finally {
    saveCommentButton.disabled = !currentTrack;
    saveCommentButton.textContent = "Skicka kommentar";
  }
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



filmTimeline.addEventListener("click", event => {
  const button = event.target.closest("[data-film-year]");
  if (!button) return;

  filmYearFilter =
    filmYearFilter === button.dataset.filmYear
      ? null
      : button.dataset.filmYear;

  renderFilmTimeline();
  renderFilms();
});

clearFilmYearButton.addEventListener("click", () => {
  filmYearFilter = null;
  renderFilmTimeline();
  renderFilms();
});

saveFilmCommentButton.addEventListener("click", async () => {
  if (!currentFilm) return;

  const comment = filmCommentInput.value.trim();
  const author = filmCommentAuthorInput.value.trim();

  if (!author) {
    filmCommentAuthorInput.focus();
    filmCommentStatus.textContent = "Skriv ditt namn";
    return;
  }

  if (!comment) {
    filmCommentInput.focus();
    filmCommentStatus.textContent = "Skriv en kommentar";
    return;
  }

  const requestedId = currentFilm.id;
  savePreferredAuthor(author);
  saveFilmCommentButton.disabled = true;
  saveFilmCommentButton.textContent = "Skickar…";

  try {
    await postSharedComment("video", requestedId, author, comment);

    if (currentFilm?.id !== requestedId) return;

    filmCommentInput.value = "";
    await loadFilmComment();
  } catch (error) {
    filmCommentStatus.textContent = error.message;
  } finally {
    saveFilmCommentButton.disabled = !currentFilm;
    saveFilmCommentButton.textContent = "Skicka kommentar";
  }
});

saveFilmTimestampButton.addEventListener("click", () => {
  if (!currentFilm) {
    return;
  }

  const text = filmTimestampInput.value.trim();

  if (!text) {
    filmTimestampInput.focus();
    return;
  }

  const seconds = getCurrentFilmSeconds();

  filmTimestampNotes[currentFilm.id] ||= [];
  filmTimestampNotes[currentFilm.id].push({
    seconds,
    text,
    createdAt: new Date().toISOString()
  });

  saveFilmTimestampNotes();
  filmTimestampInput.value = "";
  renderFilmTimestampNotes();
  renderFilms();
});

filmTimestampList.addEventListener("click", event => {
  const jumpButton = event.target.closest("[data-film-jump]");

  if (jumpButton && currentFilm) {
    const seconds = Number(jumpButton.dataset.filmJump);

    dropboxFilmPlayer.currentTime = Math.max(0, seconds);
    dropboxFilmPlayer.play().catch(() => {});
    dropboxFilmPlayer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    return;
  }

  const deleteButton = event.target.closest("[data-film-timestamp-delete]");
  if (!deleteButton || !currentFilm) return;

  const notes = filmTimestampNotes[currentFilm.id] || [];
  notes.splice(Number(deleteButton.dataset.filmTimestampDelete), 1);

  if (!notes.length) delete filmTimestampNotes[currentFilm.id];

  saveFilmTimestampNotes();
  renderFilmTimestampNotes();
  renderFilms();
});

filmCommentInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    saveFilmCommentButton.click();
  }
});

filmTimestampInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    saveFilmTimestampButton.click();
  }
});

youtubeFilmsTab.addEventListener("click", () => {
  setFilmSource("youtube");
});

facebookStreamsTab.addEventListener("click", () => {
  setFilmSource("facebook");
});

instagramStreamsTab.addEventListener("click", () => {
  setFilmSource("instagram");
});

audio.addEventListener("play", () => {
  pauseVideoForAudio();
  pauseSoundCloudPlayer();
});
dropboxFilmPlayer.addEventListener("play", () => {
  pauseAudioForVideo();
  pauseSoundCloudPlayer();
});

dropboxFilmPlayer.addEventListener("timeupdate", updateFilmCurrentTime);
dropboxFilmPlayer.addEventListener("loadedmetadata", updateFilmCurrentTime);

filmPreviousButton.addEventListener("click", () => {
  stepFilm(-1);
});

filmNextButton.addEventListener("click", () => {
  stepFilm(1);
});

dropboxFilmPlayer.addEventListener("ended", () => {
  stepFilm(1);
});

filmGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-film-id]");
  if (!button) return;

  selectFilm(films.find((film) => film.id === button.dataset.filmId));
});

filmSearchInput.addEventListener("input", renderFilms);
filmSortSelect.addEventListener("change", renderFilms);
refreshFilmsButton.addEventListener("click", async () => {
  await preloadFilmCounts(true);

  if (activeFilmSource) {
    await loadFilms();
  }
});


shareAudioButton.addEventListener("click", async () => {
  if (!currentTrack) return;

  const seconds =
    Number.isFinite(audio.currentTime) && audio.currentTime > 0
      ? Math.floor(audio.currentTime)
      : null;

  const url = buildVaultShareUrl({
    archive: "audio",
    entryId: currentTrack.id,
    seconds
  });

  await copyTextToClipboard(url);
  showShareToast(
    seconds ? "Link with current time copied" : "Link copied"
  );
});

shareFilmButton.addEventListener("click", async () => {
  if (!currentFilm) return;

  const seconds = getCurrentFilmSeconds();

  const url = buildVaultShareUrl({
    archive: "video",
    source: activeFilmSource,
    entryId: currentFilm.id,
    seconds: seconds > 0 ? seconds : null
  });

  await copyTextToClipboard(url);
  showShareToast(
    seconds > 0
      ? "Link with current time copied"
      : "Link copied"
  );
});

window.addEventListener("hashchange", () => {
  pendingSharedLocation = parseVaultShareLocation();

  if (!pendingSharedLocation) return;

  if (pendingSharedLocation.archive === "audio") {
    tryOpenSharedAudio();
  } else {
    tryOpenSharedFilm();
  }
});

audioArchiveTab.addEventListener("click", () => setArchiveView("audio"));
filmArchiveTab.addEventListener("click", () => setArchiveView("film"));

pendingSharedLocation = parseVaultShareLocation();

const savedFilmSource =
  localStorage.getItem("gravitards-film-source") || "";

activeFilmSource =
  pendingSharedLocation?.archive === "video"
    ? (
        pendingSharedLocation.source === "facebook"
          ? "facebook"
          : pendingSharedLocation.source === "instagram"
            ? "instagram"
            : "youtube"
      )
    : "";

updateFilmPortalState();

preloadFilmCounts();

activeAudioSource = "vault";
initializeSoundCloudWidget();

const savedArchiveView =
  localStorage.getItem("gravitards-archive-view") || "audio";

setArchiveView(
  pendingSharedLocation?.archive === "video"
    ? "film"
    : pendingSharedLocation?.archive === "audio"
      ? "audio"
      : (savedArchiveView === "film" ? "film" : "audio")
);

commentAuthorInput.value = savedCommentAuthor;
filmCommentAuthorInput.value = savedCommentAuthor;
updateAudioNavigationControls();
updateFilmNavigationControls();
loadFilmComment();
renderFilmTimestampNotes();
updateFilterButtons();
loadCommentForCurrentTrack();
renderTimestampNotes();
loadTracks();
