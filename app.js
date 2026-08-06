const audio = document.querySelector("#audio");
const audioArchiveTab = document.querySelector("#audioArchiveTab");
const soundCloudIframe = document.querySelector("#soundCloudPlayer");
const filmArchiveTab = document.querySelector("#filmArchiveTab");
const activityArchiveTab = document.querySelector("#activityArchiveTab");
const activityArchiveView = document.querySelector("#activityArchiveView");
const latestActivityList = document.querySelector("#latestActivityList");
const latestActivityCount = document.querySelector("#latestActivityCount");
const activityFilterButtons =
  document.querySelectorAll("[data-activity-filter]");
const forumSearchInput =
  document.querySelector("#forumSearchInput");
const filmArchiveCount = document.querySelector("#filmArchiveCount");
const audioArchiveView = document.querySelector("#audioArchiveView");
const bottomPlayerDock = document.querySelector(".bottom-player-dock");
const audioShareMenuButton =
  document.querySelector("#audioShareMenuButton");
const audioShareMenu =
  document.querySelector("#audioShareMenu");
const copyRecordingLinkButton =
  document.querySelector("#copyRecordingLinkButton");
const copyRecordingTimeLinkButton =
  document.querySelector("#copyRecordingTimeLinkButton");
const filmArchiveView = document.querySelector("#filmArchiveView");
const audioArchiveCount = document.querySelector("#audioArchiveCount");
const dropboxFilmPlayer = document.querySelector("#dropboxFilmPlayer");
const filmDownloadLink = document.querySelector("#filmDownloadLink");
const filmShareMenuButton =
  document.querySelector("#filmShareMenuButton");
const filmShareMenu =
  document.querySelector("#filmShareMenu");
const copyVideoLinkButton =
  document.querySelector("#copyVideoLinkButton");
const copyVideoTimeLinkButton =
  document.querySelector("#copyVideoTimeLinkButton");
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
const filmTimestampAuthorInput =
  document.querySelector("#filmTimestampAuthorInput");
const saveFilmTimestampButton = document.querySelector("#saveFilmTimestampButton");
const filmTimestampList = document.querySelector("#filmTimestampList");
const filmTimestampPanel =
  filmTimestampList.closest(".film-timestamp-card") ||
  filmTimestampList.closest(".timestamp-card");
const yearGroups = document.querySelector("#yearGroups");
const searchInput = document.querySelector("#searchInput");
const sortSelect = null;
const message = document.querySelector("#message");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatButton = document.querySelector("#repeatButton");
const downloadCurrentButton = document.querySelector("#downloadCurrentButton");
const shuffleAllButton = null;
const refreshButton = document.querySelector("#refreshButton");
const expandAllButton = null;
const collapseAllButton = null;
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
const timestampAuthorInput =
  document.querySelector("#timestampAuthorInput");
const mobileCommentComposer =
  document.querySelector("#mobileCommentComposer");
const mobileComposerBackButton =
  document.querySelector("#mobileComposerBackButton");
const mobileComposerCancel =
  document.querySelector("#mobileComposerCancel");
const mobileComposerSubmit =
  document.querySelector("#mobileComposerSubmit");
const mobileComposerAuthor =
  document.querySelector("#mobileComposerAuthor");
const mobileComposerText =
  document.querySelector("#mobileComposerText");
const mobileComposerMode =
  document.querySelector("#mobileComposerMode");
const mobileComposerTitle =
  document.querySelector("#mobileComposerTitle");
const mobileComposerContext =
  document.querySelector("#mobileComposerContext");
const mobileComposerTextLabel =
  document.querySelector("#mobileComposerTextLabel");

const saveTimestampButton = document.querySelector("#saveTimestampButton");
const cancelTimestampButton = document.querySelector("#cancelTimestampButton");
const timestampList = document.querySelector("#timestampList");
const audioTimestampPanel =
  document.querySelector("#audioTimestampPanel");
const mobileNotesButton =
  document.querySelector("#mobileNotesButton");
const closeMobileNotesPanel =
  document.querySelector("#closeMobileNotesPanel");
const yearJumpSelect = null;
const favoritesFilterButton = null;
const recentFilterButton = null;
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
let activeActivityFilter = "latest";
let activityReplies = {};
let commentLikeCounts = {};
const likedCommentIds = new Set();
const expandedAudioTimestampThreads = new Set();
const expandedFilmTimestampThreads = new Set();
const openAudioTimestampReplyForms = new Set();
const openFilmTimestampReplyForms = new Set();

let mobileComposerAction = null;
let mobileComposerTrigger = null;

const vaultVoterId = (() => {
  const storageKey = "gravitards-voter-id";
  const saved = localStorage.getItem(storageKey);

  if (saved) return saved;

  const generated =
    globalThis.crypto?.randomUUID?.() ||
    `vault-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(storageKey, generated);
  return generated;
})();

const expandedActivityThreads = new Set();
const openActivityReplyForms = new Set();

const savedTimestampAuthor =
  localStorage.getItem("gravitards-timestamp-author") || "";

timestampAuthorInput.value = savedTimestampAuthor;
filmTimestampAuthorInput.value = savedTimestampAuthor;


const FILM_TIMESTAMPS_STORAGE_KEY = "gravitards-film-timestamps";


let filmTimestampNotes = JSON.parse(
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
let timestampNotes = JSON.parse(
  localStorage.getItem(TIMESTAMPS_STORAGE_KEY) || "{}"
);

const COLLAPSED_STORAGE_KEY = "gravitards-collapsed-years";
const collapsedYears = new Set(
  JSON.parse(localStorage.getItem(COLLAPSED_STORAGE_KEY) || "[]")
);

const storedVolume = localStorage.getItem("gravitards-volume");
const savedVolume =
  storedVolume === null
    ? 0.85
    : Number(storedVolume);

audio.volume =
  Number.isFinite(savedVolume) &&
  savedVolume >= 0 &&
  savedVolume <= 1
    ? savedVolume
    : 0.85;

audio.muted = false;
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


async function copyAudioShareLink(includeCurrentTime) {
  if (!currentTrack) {
    showShareToast("Select a track first");
    return;
  }

  const seconds =
    includeCurrentTime &&
    Number.isFinite(audio.currentTime) &&
    audio.currentTime > 0
      ? Math.floor(audio.currentTime)
      : null;

  const entryId = String(
    currentTrack.id ||
    currentTrack.dropboxId ||
    ""
  ).replace(/^(?:id:)+/i, "");

  const url = buildVaultShareUrl({
    archive: "audio",
    source: "dropbox",
    entryId,
    seconds
  });

  await copyTextToClipboard(url);

  showShareToast(
    seconds
      ? "Link with current time copied"
      : "Recording link copied"
  );
}

function showShareToast(message = "Link copied") {
  if (!shareToast) return;

  shareToast.textContent = message;
  shareToast.classList.remove("hidden");

  window.clearTimeout(shareToastTimer);
  shareToastTimer = window.setTimeout(() => {
    shareToast.classList.add("hidden");
  }, 2400);
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
        showShareToast("Link with current time copied");
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

  return "Unknown year";
}

function cleanTitle(track) {
  let title = track.title || track.name || "Untitled recording";

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
  const mode = sortSelect?.value || "year-desc";
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

function saveFavoritees() {
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
    throw new Error(data.error || "Comments could not be loaded.");
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
    throw new Error(data.error || "The comment could not be saved.");
  }

  return data.comment;
}

function updateFilterButtons() {}

async function loadCommentForCurrentTrack() {
  if (!currentTrack) {
    commentInput.value = "";
    commentAuthorInput.value = savedCommentAuthor;
    commentInput.disabled = true;
    commentAuthorInput.disabled = true;
    saveCommentButton.disabled = true;
    commentStatus.textContent = "No recording selected";
    audioSharedComments = [];
    renderSharedCommentList(
      audioCommentList,
      [],
      "Select a recording to view comments."
    );
    return;
  }

  const requestedId = currentTrack.id;

  commentInput.disabled = false;
  commentAuthorInput.disabled = false;
  saveCommentButton.disabled = false;
  commentAuthorInput.value = savedCommentAuthor;
  commentStatus.textContent = "Loading comments…";
  audioCommentList.classList.add("shared-comment-loading");

  try {
    const loaded = await fetchSharedComments("audio", requestedId);

    if (currentTrack?.id !== requestedId) return;

    audioSharedComments = loaded;
    renderSharedCommentList(
      audioCommentList,
      audioSharedComments,
      "No comments yet."
    );

    commentStatus.textContent =
      `${audioSharedComments.length} ` +
      `${audioSharedComments.length === 1 ? "comment" : "comments"}`;
  } catch (error) {
    if (currentTrack?.id !== requestedId) return;

    audioSharedComments = [];
    renderSharedCommentList(
      audioCommentList,
      [],
      error.message
    );
    commentStatus.textContent = "Kunde inte läsa comments";
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
    duration.title = "Click to show total duration";
  } else {
    duration.textContent = formatTime(audio.duration, timeDisplayMode);
    duration.title = "Click to show remaining time";
  }
}

function renderTimestampNotes() {
  renderChapterMarkers();

  if (!currentTrack) {
    timestampList.innerHTML =
      '<p class="empty-timestamps">Select a recording to view timestamp notes.</p>';
    addTimestampButton.disabled = true;
    return;
  }

  addTimestampButton.disabled = false;
  const notes = [...(timestampNotes[currentTrack.id] || [])]
    .sort((a, b) => a.seconds - b.seconds);

  if (!notes.length) {
    timestampList.innerHTML =
      '<p class="empty-timestamps">No timestamp notes yet.</p>';
    return;
  }

  timestampList.innerHTML = notes.map((note, index) => {
    const noteId = String(note.id || "");
    const replies = activityReplies[noteId] || [];
    const expanded = expandedAudioTimestampThreads.has(noteId);
    const replyOpen = openAudioTimestampReplyForms.has(noteId);
    const author =
      timestampAuthorInput?.value.trim() ||
      localStorage.getItem("gravitards-timestamp-author") ||
      "";

    return `
      <article class="timestamp-note timestamp-discussion"
               data-timestamp-note-id="${escapeHtml(noteId)}"
               data-timestamp-entry-type="audio"
               data-timestamp-entry-id="${escapeHtml(currentTrack.id)}"
               data-timestamp-entry-title="${escapeHtml(
                 currentTrack.displayTitle ||
                 currentTrack.title ||
                 currentTrack.name ||
                 "Audio recording"
               )}"
               data-timestamp-source="dropbox">
        <div class="timestamp-discussion-main">
          <button class="timestamp-jump"
                  type="button"
                  data-jump-seconds="${note.seconds}">
            ${formatTime(note.seconds)}
          </button>

          <div class="timestamp-text">
            ${escapeHtml(note.text)}
            <span class="timestamp-note-author">
              ${escapeHtml(note.author || "Anonymous")}
            </span>

            <div class="timestamp-discussion-actions">
              ${renderLikeButton(note.id)}
              <button type="button"
                      data-timestamp-reply-toggle="${escapeHtml(noteId)}">
                Reply
              </button>
              ${
                replies.length
                  ? `<button type="button"
                             data-timestamp-thread-toggle="${escapeHtml(noteId)}">
                       ${expanded ? "Hide" : "Show"} ${replies.length}
                       ${replies.length === 1 ? "reply" : "replies"}
                     </button>`
                  : ""
              }
            </div>
          </div>

          <button class="timestamp-delete"
                  type="button"
                  data-delete-timestamp="${index}"
                  title="Delete">×</button>
        </div>

        <div class="timestamp-inline-reply-form ${replyOpen ? "" : "hidden"}">
          <input class="timestamp-inline-author"
                 type="text"
                 maxlength="80"
                 autocomplete="name"
                 value="${escapeHtml(author)}"
                 placeholder="Your name">
          <textarea class="timestamp-inline-text"
                    rows="3"
                    maxlength="2000"
                    placeholder="Write a reply…"></textarea>
          <div>
            <button type="button"
                    data-timestamp-reply-submit="${escapeHtml(noteId)}">
              Post reply
            </button>
            <button type="button"
                    data-timestamp-reply-cancel="${escapeHtml(noteId)}">
              Cancel
            </button>
          </div>
        </div>

        <div class="timestamp-thread-replies ${expanded ? "" : "hidden"}">
          ${replies.map(renderTimestampReply).join("")}
        </div>
      </article>
    `;
  }).join("");

  addTimestampShareButtons(timestampList, "audio");
}

function saveCollapsedYears() {
  localStorage.setItem(
    COLLAPSED_STORAGE_KEY,
    JSON.stringify([...collapsedYears])
  );
}

function updateYearJump() {}

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
    archiveRange.textContent = "Year unavailable";
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
      `<div class="message">${tracks.length ? "No recordings match your search." : "No audio files found."}</div>`;
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
                  title="Favorite">${favoriteIds.has(track.id) ? "★" : "☆"}</button>
          <a class="track-download"
             href="/api/download/${encodeURIComponent(track.id)}"
             data-download-id="${escapeHtml(track.id)}"
             title="Download file"
             aria-label="Download ${escapeHtml(track.displayTitle)}">↓</a>
        </div>
      `;
    }).join("");

    return `
      <section class="year-group ${collapsed ? "collapsed" : ""}" data-year="${escapeHtml(year)}">
        <button class="year-heading" type="button" data-toggle-year="${escapeHtml(year)}">
          <span class="year-number">${escapeHtml(year)}</span>
          <span class="year-count">${items.length} ${items.length === 1 ? "recording" : "recordings"}</span>
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
  return Number.isNaN(date.getTime()) ? "Unknown year" : date.getFullYear();
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
    filmCommentStatus.textContent = "No video selected";
    filmSharedComments = [];
    renderSharedCommentList(
      filmCommentList,
      [],
      "Select a video to view comments."
    );
    return;
  }

  const requestedId = currentFilm.id;

  filmCommentInput.disabled = false;
  filmCommentAuthorInput.disabled = false;
  saveFilmCommentButton.disabled = false;
  filmCommentAuthorInput.value = savedCommentAuthor;
  filmCommentStatus.textContent = "Loading comments…";
  filmCommentList.classList.add("shared-comment-loading");

  try {
    const loaded = await fetchSharedComments("video", requestedId);

    if (currentFilm?.id !== requestedId) return;

    filmSharedComments = loaded;
    renderSharedCommentList(
      filmCommentList,
      filmSharedComments,
      "No comments yet."
    );

    filmCommentStatus.textContent =
      `${filmSharedComments.length} ` +
      `${filmSharedComments.length === 1 ? "comment" : "comments"}`;
  } catch (error) {
    if (currentFilm?.id !== requestedId) return;

    filmSharedComments = [];
    renderSharedCommentList(
      filmCommentList,
      [],
      error.message
    );
    filmCommentStatus.textContent = "Kunde inte läsa comments";
  }
}

function renderFilmTimestampNotes() {
  if (!currentFilm) {
    filmTimestampList.innerHTML =
      '<p class="empty-timestamps">Select a video to view timestamp notes.</p>';
    saveFilmTimestampButton.disabled = true;
    return;
  }

  saveFilmTimestampButton.disabled = false;

  const notes = [...(filmTimestampNotes[currentFilm.id] || [])]
    .sort((a, b) => a.seconds - b.seconds);

  if (!notes.length) {
    filmTimestampList.innerHTML =
      '<p class="empty-timestamps">No timestamp notes for this video yet.</p>';
    return;
  }

  filmTimestampList.innerHTML = notes.map((note, index) => {
    const noteId = String(note.id || "");
    const replies = activityReplies[noteId] || [];
    const expanded = expandedFilmTimestampThreads.has(noteId);
    const replyOpen = openFilmTimestampReplyForms.has(noteId);
    const author =
      filmTimestampAuthorInput?.value.trim() ||
      localStorage.getItem("gravitards-timestamp-author") ||
      "";

    return `
      <article class="timestamp-note timestamp-discussion"
               data-timestamp-note-id="${escapeHtml(noteId)}"
               data-timestamp-entry-type="video"
               data-timestamp-entry-id="${escapeHtml(currentFilm.id)}"
               data-timestamp-entry-title="${escapeHtml(
                 currentFilm.title ||
                 currentFilm.originalName ||
                 "Video"
               )}"
               data-timestamp-source="${escapeHtml(activeFilmSource)}">
        <div class="timestamp-discussion-main">
          <button class="timestamp-jump"
                  type="button"
                  data-film-jump="${note.seconds}">
            ${formatFilmDuration(note.seconds)}
          </button>

          <div class="timestamp-text">
            ${escapeHtml(note.text)}
            <span class="timestamp-note-author">
              ${escapeHtml(note.author || "Anonymous")}
            </span>

            <div class="timestamp-discussion-actions">
              ${renderLikeButton(note.id)}
              <button type="button"
                      data-timestamp-reply-toggle="${escapeHtml(noteId)}">
                Reply
              </button>
              ${
                replies.length
                  ? `<button type="button"
                             data-timestamp-thread-toggle="${escapeHtml(noteId)}">
                       ${expanded ? "Hide" : "Show"} ${replies.length}
                       ${replies.length === 1 ? "reply" : "replies"}
                     </button>`
                  : ""
              }
            </div>
          </div>

          <button class="timestamp-delete"
                  type="button"
                  data-film-timestamp-delete="${index}"
                  title="Delete">×</button>
        </div>

        <div class="timestamp-inline-reply-form ${replyOpen ? "" : "hidden"}">
          <input class="timestamp-inline-author"
                 type="text"
                 maxlength="80"
                 autocomplete="name"
                 value="${escapeHtml(author)}"
                 placeholder="Your name">
          <textarea class="timestamp-inline-text"
                    rows="3"
                    maxlength="2000"
                    placeholder="Write a reply…"></textarea>
          <div>
            <button type="button"
                    data-timestamp-reply-submit="${escapeHtml(noteId)}">
              Post reply
            </button>
            <button type="button"
                    data-timestamp-reply-cancel="${escapeHtml(noteId)}">
              Cancel
            </button>
          </div>
        </div>

        <div class="timestamp-thread-replies ${expanded ? "" : "hidden"}">
          ${replies.map(renderTimestampReply).join("")}
        </div>
      </article>
    `;
  }).join("");

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
    `${visibleFilms.length} of ${films.length} ` +
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


function updateAudioNavigationControls() {}

function updateFilmNavigationControls() {
  const queue = visibleFilms.length ? visibleFilms : films;
  const hasSelection = Boolean(currentFilm);
  const canNavigate = hasSelection && queue.length > 0;

  filmPreviousButton.disabled = !canNavigate;
  filmNextButton.disabled = !canNavigate;
  if (filmShareMenuButton) {
    filmShareMenuButton.disabled = !hasSelection;
  }

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


async function tryOpenSharedAudio() {
  if (
    !pendingSharedLocation ||
    pendingSharedLocation.archive !== "audio" ||
    !tracks.length
  ) {
    return false;
  }

  const normalizeSharedId = value =>
    decodeURIComponent(String(value || ""))
      .replace(/^(?:id:)+/i, "")
      .trim();

  const wantedId = normalizeSharedId(
    pendingSharedLocation.id
  );

  const track = tracks.find(item => {
    const candidates = [
      item.id,
      item.dropboxId,
      item.pathLower,
      item.pathDisplay
    ];

    return candidates.some(
      candidate =>
        normalizeSharedId(candidate) === wantedId
    );
  });

  if (!track) {
    showShareToast("The track in this link could not be found");
    return false;
  }

  const targetSeconds = pendingSharedLocation.seconds;

  activeAudioSource = "vault";
  setArchiveView("audio");

  pendingSharedLocation = null;

  await playTrack(track);

  if (targetSeconds !== null) {
    seekSharedAudio(targetSeconds);
  }

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



function normalizeVaultTimestampComment(row) {
  return {
    id: row.id,
    seconds: Math.max(0, Number(row.seconds || 0)),
    text: row.comment || row.text || "",
    author: row.author || "Anonymous",
    createdAt: row.created_at || row.createdAt || "",
    entryTitle: row.entry_title || row.entryTitle || "",
    source: row.source || "",
    parentId:
      row.parent_id === null ||
      row.parent_id === undefined
        ? null
        : Number(row.parent_id)
  };
}

function groupVaultTimestampComments(rows) {
  const audio = {};
  const video = {};
  const replies = {};

  for (const row of rows || []) {
    const normalized =
      normalizeVaultTimestampComment(row);

    if (normalized.parentId) {
      replies[normalized.parentId] ||= [];
      replies[normalized.parentId].push(normalized);
      continue;
    }

    if (
      row.seconds === null ||
      row.seconds === undefined
    ) {
      continue;
    }

    const target =
      row.entry_type === "video"
        ? video
        : audio;

    target[row.entry_id] ||= [];
    target[row.entry_id].push(normalized);
  }

  for (const threadReplies of Object.values(replies)) {
    threadReplies.sort((a, b) => {
      return (
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
      );
    });
  }

  return { audio, video, replies };
}

async function loadCentralTimestampComments() {
  const response = await fetch(
    "/api/comments?latest=1&limit=1000",
    { cache: "no-store" }
  );

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(
      rawText || "Could not load timestamp notes."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || "Could not load timestamp notes."
    );
  }

  const grouped = groupVaultTimestampComments(
    data.comments || []
  );

  timestampNotes = grouped.audio;
  filmTimestampNotes = grouped.video;
  activityReplies = grouped.replies;

  saveTimestampNotes();
  saveFilmTimestampNotes();

  renderTimestampNotes();
  renderFilmTimestampNotes();
  renderTracks();
  renderFilms();
  renderLatestActivity();
}

async function createCentralTimestampComment(payload) {
  const response = await fetch(
    "/api/comments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(
      rawText || "Could not save timestamp note."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || "Could not save timestamp note."
    );
  }

  return normalizeVaultTimestampComment(
    data.comment || {}
  );
}


async function loadCommentLikes() {
  const response = await fetch(
    `/api/comment-likes?voter_id=${encodeURIComponent(vaultVoterId)}`,
    { cache: "no-store" }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load likes.");
  }

  commentLikeCounts = data.counts || {};
  likedCommentIds.clear();

  for (const id of data.liked || []) {
    likedCommentIds.add(String(id));
  }

  renderTimestampNotes();
  renderFilmTimestampNotes();
  renderLatestActivity();
}

async function toggleCommentLike(commentId) {
  const id = String(commentId || "");
  if (!id) return;

  const response = await fetch(
    "/api/comment-likes/toggle",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment_id: Number(id),
        voter_id: vaultVoterId
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not update like.");
  }

  const current = Number(commentLikeCounts[id] || 0);

  if (data.liked) {
    likedCommentIds.add(id);
    commentLikeCounts[id] = current + 1;
  } else {
    likedCommentIds.delete(id);
    commentLikeCounts[id] = Math.max(0, current - 1);
  }

  renderTimestampNotes();
  renderFilmTimestampNotes();
  renderLatestActivity();
}

function renderLikeButton(commentId) {
  const id = String(commentId || "");
  const count = Number(commentLikeCounts[id] || 0);
  const liked = likedCommentIds.has(id);

  return `
    <button class="timestamp-like ${liked ? "liked" : ""}"
            type="button"
            data-comment-like="${escapeHtml(id)}"
            aria-pressed="${liked ? "true" : "false"}">
      ${liked ? "♥" : "♡"} ${count}
    </button>
  `;
}

function renderTimestampReply(reply) {
  return `
    <div class="timestamp-thread-reply">
      <div class="timestamp-thread-reply-meta">
        <strong>${escapeHtml(reply.author || "Anonymous")}</strong>
        <span>${escapeHtml(formatActivityDate(reply.createdAt))}</span>
      </div>
      <p>${escapeHtml(reply.text || "")}</p>
      ${renderLikeButton(reply.id)}
    </div>
  `;
}

async function createActivityReply(payload) {
  const response = await fetch(
    "/api/comments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(
      rawText || "Could not post reply."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || "Could not post reply."
    );
  }

  return normalizeVaultTimestampComment(
    data.comment || {}
  );
}

async function deleteCentralTimestampComment(id) {
  if (!id) return;

  const response = await fetch(
    `/api/comments/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const rawText = await response.text();
    throw new Error(
      rawText || "Could not delete timestamp note."
    );
  }
}

function formatActivityDate(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function getFilmSourceFromId(id) {
  const text = String(id || "");

  if (text.startsWith("facebook:")) return "facebook";
  if (text.startsWith("instagram:")) return "instagram";
  return "youtube";
}

function getLatestActivityEntries() {
  const entries = [];

  const createEntry = ({
    note,
    type,
    id,
    source,
    title
  }) => {
    const replies = activityReplies[note.id] || [];
    const replyDates = replies
      .map(reply => new Date(reply.createdAt || 0).getTime())
      .filter(Number.isFinite);

    const rootDate =
      new Date(note.createdAt || 0).getTime();

    const lastActivityAt = Math.max(
      Number.isFinite(rootDate) ? rootDate : 0,
      ...replyDates,
      0
    );

    const firstLine =
      String(note.text || "")
        .split(/\r?\n/)[0]
        .trim();

    entries.push({
      noteId: note.id,
      type,
      id,
      source,
      title,
      threadTitle:
        firstLine.length > 86
          ? `${firstLine.slice(0, 83)}…`
          : firstLine || "Untitled thread",
      seconds: Number(note.seconds || 0),
      text: note.text || "",
      author: note.author || "Anonymous",
      createdAt: note.createdAt || "",
      lastActivityAt,
      replies
    });
  };

  for (const [trackId, notes] of Object.entries(timestampNotes)) {
    const track = tracks.find(item => item.id === trackId);

    for (const note of notes || []) {
      createEntry({
        note,
        type: "audio",
        id: trackId,
        source: "dropbox",
        title:
          track?.displayTitle ||
          track?.title ||
          note.entryTitle ||
          "Audio recording"
      });
    }
  }

  const allFilms = [
    ...youtubeFilms,
    ...facebookStreams,
    ...instagramStreams
  ];

  for (const [filmId, notes] of Object.entries(filmTimestampNotes)) {
    const film = allFilms.find(item => item.id === filmId);

    for (const note of notes || []) {
      createEntry({
        note,
        type: "video",
        id: filmId,
        source: film?.source || getFilmSourceFromId(filmId),
        title:
          film?.title ||
          note.entryTitle ||
          "Video"
      });
    }
  }

  return entries;
}

function renderLatestActivity() {
  const allEntries = getLatestActivityEntries();
  const query =
    forumSearchInput?.value
      .trim()
      .toLocaleLowerCase("en") || "";

  let entries = allEntries.filter(entry => {
    if (activeActivityFilter === "audio") {
      return entry.type === "audio";
    }

    if (activeActivityFilter === "video") {
      return entry.type === "video";
    }

    if (activeActivityFilter === "unanswered") {
      return !entry.replies?.length;
    }

    return true;
  });

  if (query) {
    entries = entries.filter(entry =>
      [
        entry.threadTitle,
        entry.text,
        entry.title,
        entry.author,
        ...(entry.replies || []).flatMap(reply => [
          reply.text,
          reply.author
        ])
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("en")
        .includes(query)
    );
  }

  if (activeActivityFilter === "popular") {
    entries.sort((a, b) => {
      const aLikes =
        Number(commentLikeCounts[String(a.noteId)] || 0);
      const bLikes =
        Number(commentLikeCounts[String(b.noteId)] || 0);

      const aScore =
        aLikes * 2 + (a.replies?.length || 0) * 3;
      const bScore =
        bLikes * 2 + (b.replies?.length || 0) * 3;

      return (
        bScore - aScore ||
        b.lastActivityAt - a.lastActivityAt
      );
    });
  } else {
    entries.sort(
      (a, b) => b.lastActivityAt - a.lastActivityAt
    );
  }

  const replyCount = allEntries.reduce(
    (total, entry) =>
      total + (entry.replies?.length || 0),
    0
  );

  if (latestActivityCount) {
    latestActivityCount.textContent =
      `${allEntries.length} ${
        allEntries.length === 1 ? "thread" : "threads"
      } · ${replyCount} ${
        replyCount === 1 ? "reply" : "replies"
      }`;
  }

  activityFilterButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.activityFilter ===
        activeActivityFilter
    );
  });

  if (!entries.length) {
    latestActivityList.innerHTML =
      '<p class="activity-empty">No forum threads match this view.</p>';
    return;
  }

  latestActivityList.innerHTML = entries
    .slice(0, 150)
    .map(entry => {
      const replies = entry.replies || [];
      const likes = Number(
        commentLikeCounts[String(entry.noteId)] || 0
      );

      const lastReply = replies.at(-1);
      const lastActivityLabel = lastReply
        ? `Last reply by ${escapeHtml(
            lastReply.author || "Anonymous"
          )}`
        : "No replies yet";

      return `
        <article class="activity-thread forum-thread"
                 data-activity-note-id="${entry.noteId}"
                 data-activity-type="${entry.type}"
                 data-activity-id="${escapeHtml(entry.id)}"
                 data-activity-source="${escapeHtml(entry.source)}"
                 data-activity-seconds="${entry.seconds}"
                 data-activity-title="${escapeHtml(entry.title)}">
          <button class="forum-thread-open"
                  type="button">
            <span class="activity-type-icon" aria-hidden="true">
              ${entry.type === "audio" ? "♫" : "▸"}
            </span>

            <span class="forum-thread-copy">
              <span class="forum-thread-source">
                ${escapeHtml(entry.title)}
                <b>${formatTime(entry.seconds)}</b>
              </span>

              <strong class="forum-thread-title">
                ${escapeHtml(entry.threadTitle)}
              </strong>

              <span class="forum-thread-excerpt">
                ${escapeHtml(entry.text)}
              </span>

              <span class="activity-entry-meta forum-thread-meta">
                <span>Started by ${escapeHtml(
                  entry.author || "Anonymous"
                )}</span>
                <span>♡ ${likes}</span>
                <span>💬 ${replies.length}</span>
                <span>${lastActivityLabel}</span>
                <span>${escapeHtml(
                  formatActivityDate(
                    new Date(entry.lastActivityAt).toISOString()
                  )
                )}</span>
              </span>
            </span>

            <span class="forum-open-label">
              Open thread →
            </span>
          </button>
        </article>
      `;
    })
    .join("");
}

async function loadLatestActivityData() {
  if (!tracks.length) {
    await loadTracks();
  }

  await Promise.allSettled([
    loadYouTubeFilms(),
    loadFacebookStreams(),
    loadInstagramStreams()
  ]);

  renderLatestActivity();
}


function scrollToOpenedDiscussion({
  type,
  noteId
}) {
  if (!isMobileComposerLayout()) return;

  const panel =
    type === "audio"
      ? audioTimestampPanel
      : filmTimestampPanel;

  const list =
    type === "audio"
      ? timestampList
      : filmTimestampList;

  if (!panel || !list) return;

  window.setTimeout(() => {
    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    window.setTimeout(() => {
      const discussion = list.querySelector(
        `.timestamp-discussion[data-timestamp-note-id="${CSS.escape(String(noteId || ""))}"]`
      );

      discussion?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      if (discussion) {
        discussion.classList.add(
          "opened-discussion-highlight"
        );

        window.setTimeout(() => {
          discussion.classList.remove(
            "opened-discussion-highlight"
          );
        }, 2600);
      }
    }, 600);
  }, 200);
}

async function openActivityEntry(button) {
  const type = button.dataset.activityType;
  const noteId = button.dataset.activityNoteId;
  const id = button.dataset.activityId;
  const source = button.dataset.activitySource;
  const seconds = Number(button.dataset.activitySeconds || 0);

  if (type === "audio") {
    const track = tracks.find(item => item.id === id);

    if (!track) {
      showShareToast("The recording could not be found");
      return;
    }

    expandedAudioTimestampThreads.add(
      String(button.dataset.activityNoteId || "")
    );

    setArchiveView("audio");
    await playTrack(track);
    renderTimestampNotes();

    if (isMobileComposerLayout()) {
      setMobileNotesPanel(true, noteId);
    } else {
      scrollToOpenedDiscussion({
        type: "audio",
        noteId
      });
    }

    if (seconds > 0) {
      seekSharedAudio(seconds);
    }

    return;
  }

  setFilmSource(source);
  setArchiveView("film");

  const sourceFilms =
    source === "facebook"
      ? await loadFacebookStreams()
      : source === "instagram"
        ? await loadInstagramStreams()
        : await loadYouTubeFilms();

  films = sourceFilms;
  renderFilmTimeline();
  renderFilms();

  const film = sourceFilms.find(item => item.id === id);

  if (!film) {
    showShareToast("The video could not be found");
    return;
  }

  expandedFilmTimestampThreads.add(
    String(button.dataset.activityNoteId || "")
  );

  selectFilm(film);
  renderFilmTimestampNotes();

  scrollToOpenedDiscussion({
    type: "video",
    noteId
  });

  if (seconds > 0) {
    seekSharedFilm(seconds);
  }
}

function setArchiveView(view) {
  const showAudio = view === "audio";
  const showFilm = view === "film";
  const showActivity = view === "activity";

  audioArchiveTab.classList.toggle("active", showAudio);
  filmArchiveTab.classList.toggle("active", showFilm);
  activityArchiveTab.classList.toggle("active", showActivity);

  audioArchiveView.classList.toggle("hidden", !showAudio);
  filmArchiveView.classList.toggle("hidden", !showFilm);
  activityArchiveView.classList.toggle("hidden", !showActivity);

  if (bottomPlayerDock) {
    bottomPlayerDock.classList.toggle("hidden", !showAudio);
  }

  if (!showAudio && isMobileComposerLayout()) {
    setMobileNotesPanel(false);
  }

  localStorage.setItem("gravitards-archive-view", view);

  if (showFilm && films.length === 0) {
    loadFilms();
  }

  if (showActivity) {
    void loadLatestActivityData();
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
        throw new Error(refreshData.error || "Refresh failed.");
      }
    }

    const response = await fetch("/api/tracks");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The archive could not be loaded.");

    tracks = decorateTracks(data.tracks);
    audioArchiveCount.textContent =
      `${tracks.length} ${tracks.length === 1 ? "Vault Entry" : "Vault Entries"}`;
    folderPath.textContent = `▱ ${data.folder}`;
    updateSummary();
    updateYearJump();
    renderTimeline();
    renderTracks();
    window.setTimeout(() => { void tryOpenSharedAudio(); }, 0);

    if (!tracks.length) {
      showMessage("The folder contains no audio files. Check DROPBOX_FOLDER.");
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

  if (audioShareMenuButton) {
    audioShareMenuButton.disabled = false;
  }

  if (mobileNotesButton) {
    mobileNotesButton.disabled = false;
  }
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
    showMessage("Press play to start playback.", true);
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
    saveFavoritees();
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

vaultTimeline.addEventListener("click", event => {
  const button = event.target.closest("[data-timeline-year]");
  if (!button) return;

  const selectedYear = button.dataset.timelineYear;

  timelineYearFilter =
    timelineYearFilter === selectedYear
      ? null
      : selectedYear;

  // A year button should always show the complete year.
  activeFilter = "all";
  searchInput.value = "";

  if (timelineYearFilter) {
    collapsedYears.delete(String(timelineYearFilter));
    saveCollapsedYears();
  }

  renderTimeline();
  renderTracks();

  if (timelineYearFilter) {
    requestAnimationFrame(() => {
      document
        .querySelector(
          `.year-group[data-year="${CSS.escape(timelineYearFilter)}"]`
        )
        ?.scrollIntoView({
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

addTimestampButton.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();

  if (!currentTrack) return;

  pendingTimestampSeconds = Math.max(
    0,
    Math.floor(audio.currentTime || 0)
  );

  if (isMobileComposerLayout()) {
    setMobileNotesPanel(true);

    openMobileCommentComposer({
      mode: "Timestamp note",
      title: "Add note",
      context: `${
        currentTrack.displayTitle ||
        currentTrack.title ||
        "Audio recording"
      } · ${formatTime(pendingTimestampSeconds)}`,
      textLabel: "Note",
      placeholder: "What happens here?",
      author: timestampAuthorInput.value,
      trigger: event.currentTarget,
      action: async ({ author, text }) => {
        await saveAudioTimestampNote(author, text);
      }
    });
    return;
  }

  timestampComposerTime.textContent =
    formatTime(pendingTimestampSeconds);

  timestampInput.value = "";
  timestampComposer.classList.remove("hidden");

  window.setTimeout(() => {
    timestampComposer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    timestampAuthorInput.focus({
      preventScroll: true
    });
  }, 80);
});

cancelTimestampButton.addEventListener("click", () => {
  timestampComposer.classList.add("hidden");
  timestampInput.value = "";
});

async function saveAudioTimestampNote(author, text) {
  if (!currentTrack) return;

  const saved = await createCentralTimestampComment({
    entry_type: "audio",
    entry_id: currentTrack.id,
    entry_title:
      currentTrack.displayTitle ||
      currentTrack.title ||
      currentTrack.name ||
      "Audio recording",
    source: "dropbox",
    author,
    comment: text,
    seconds: pendingTimestampSeconds
  });

  timestampNotes[currentTrack.id] ||= [];
  timestampNotes[currentTrack.id].push(saved);

  saveTimestampNotes();
  timestampComposer.classList.add("hidden");
  timestampInput.value = "";

  renderTimestampNotes();
  renderTracks();
  renderLatestActivity();
  showShareToast("Timestamp note posted");
}

saveTimestampButton.addEventListener("click", async event => {
  event.preventDefault();
  event.stopPropagation();

  const author = timestampAuthorInput.value.trim();
  const text = timestampInput.value.trim();

  if (!author) {
    timestampAuthorInput.focus();
    return;
  }

  if (!text) {
    timestampInput.focus();
    return;
  }

  saveTimestampButton.disabled = true;

  try {
    localStorage.setItem(
      "gravitards-timestamp-author",
      author
    );
    filmTimestampAuthorInput.value = author;
    await saveAudioTimestampNote(author, text);
  } catch (error) {
    showShareToast(error.message);
  } finally {
    saveTimestampButton.disabled = false;
  }
});

timestampInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    saveTimestampButton.click();
  }
});




function setMobileNotesPanel(open, noteId = null) {
  if (
    !audioTimestampPanel ||
    !mobileNotesButton ||
    !isMobileComposerLayout()
  ) {
    return;
  }

  const shouldOpen = Boolean(open);

  audioTimestampPanel.classList.toggle(
    "mobile-notes-panel-open",
    shouldOpen
  );

  document.body.classList.toggle(
    "mobile-notes-panel-active",
    shouldOpen
  );

  mobileNotesButton.setAttribute(
    "aria-expanded",
    shouldOpen ? "true" : "false"
  );

  if (!shouldOpen) return;

  requestAnimationFrame(() => {
    audioTimestampPanel.scrollTop = 0;

    if (!noteId) return;

    requestAnimationFrame(() => {
      const discussion = timestampList.querySelector(
        `.timestamp-discussion[data-timestamp-note-id="${CSS.escape(String(noteId))}"]`
      );

      if (!discussion) return;

      discussion.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      discussion.classList.add(
        "opened-discussion-highlight"
      );

      window.setTimeout(() => {
        discussion.classList.remove(
          "opened-discussion-highlight"
        );
      }, 2600);
    });
  });
}

function isMobileComposerLayout() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function closeMobileCommentComposer() {
  mobileCommentComposer.classList.add("hidden");
  document.body.classList.remove("mobile-composer-open");
  mobileComposerAction = null;

  const trigger = mobileComposerTrigger;
  mobileComposerTrigger = null;

  if (trigger?.isConnected) {
    trigger.focus({ preventScroll: true });
  }
}

function openMobileCommentComposer({
  mode,
  title,
  context,
  textLabel,
  placeholder,
  author,
  action,
  trigger
}) {
  mobileComposerMode.textContent = mode;
  mobileComposerTitle.textContent = title;
  mobileComposerContext.textContent = context || "";
  mobileComposerTextLabel.textContent = textLabel;
  mobileComposerText.placeholder = placeholder;
  mobileComposerAuthor.value =
    author ||
    localStorage.getItem("gravitards-timestamp-author") ||
    "";
  mobileComposerText.value = "";

  mobileComposerAction = action;
  mobileComposerTrigger = trigger || document.activeElement;

  mobileCommentComposer.classList.remove("hidden");
  document.body.classList.add("mobile-composer-open");

  window.setTimeout(() => {
    const field = mobileComposerAuthor.value
      ? mobileComposerText
      : mobileComposerAuthor;

    field.focus({ preventScroll: true });
  }, 120);
}

async function submitMobileCommentComposer() {
  if (!mobileComposerAction) return;

  const author = mobileComposerAuthor.value.trim();
  const text = mobileComposerText.value.trim();

  if (!author) {
    mobileComposerAuthor.focus();
    return;
  }

  if (!text) {
    mobileComposerText.focus();
    return;
  }

  mobileComposerSubmit.disabled = true;

  try {
    localStorage.setItem(
      "gravitards-timestamp-author",
      author
    );

    timestampAuthorInput.value = author;
    filmTimestampAuthorInput.value = author;

    await mobileComposerAction({ author, text });
    closeMobileCommentComposer();
  } catch (error) {
    showShareToast(error.message);
  } finally {
    mobileComposerSubmit.disabled = false;
  }
}

async function handleTimestampDiscussionAction(
  event,
  listType
) {
  const discussion =
    event.target.closest(".timestamp-discussion");

  const likeButton =
    event.target.closest("[data-comment-like]");

  if (likeButton) {
    try {
      await toggleCommentLike(
        likeButton.dataset.commentLike
      );
    } catch (error) {
      showShareToast(error.message);
    }
    return true;
  }

  if (!discussion) return false;

  const noteId = String(
    discussion.dataset.timestampNoteId || ""
  );

  const expandedSet =
    listType === "audio"
      ? expandedAudioTimestampThreads
      : expandedFilmTimestampThreads;

  const formSet =
    listType === "audio"
      ? openAudioTimestampReplyForms
      : openFilmTimestampReplyForms;

  if (event.target.closest("[data-timestamp-reply-toggle]")) {
    if (isMobileComposerLayout()) {
      const title =
        discussion.dataset.timestampEntryTitle ||
        "Timestamp discussion";

      const secondsButton =
        discussion.querySelector(".timestamp-jump");

      openMobileCommentComposer({
        mode: "Reply to timestamp",
        title: "Reply",
        context: `${title} · ${secondsButton?.textContent.trim() || ""}`,
        textLabel: "Reply",
        placeholder: "Write a reply…",
        author:
          timestampAuthorInput.value ||
          filmTimestampAuthorInput.value,
        trigger: event.target.closest(
          "[data-timestamp-reply-toggle]"
        ),
        action: async ({ author, text }) => {
          const saved = await createActivityReply({
            entry_type:
              discussion.dataset.timestampEntryType,
            entry_id:
              discussion.dataset.timestampEntryId,
            entry_title:
              discussion.dataset.timestampEntryTitle,
            source:
              discussion.dataset.timestampSource,
            author,
            comment: text,
            seconds: null,
            parent_id: Number(noteId)
          });

          activityReplies[noteId] ||= [];
          activityReplies[noteId].push(saved);
          expandedSet.add(noteId);

          if (listType === "audio") {
            renderTimestampNotes();
          } else {
            renderFilmTimestampNotes();
          }

          renderLatestActivity();
          showShareToast("Reply posted");
        }
      });

      return true;
    }

    formSet.add(noteId);

    if (listType === "audio") {
      renderTimestampNotes();
    } else {
      renderFilmTimestampNotes();
    }

    window.setTimeout(() => {
      const list =
        listType === "audio"
          ? timestampList
          : filmTimestampList;

      list.querySelector(
        `.timestamp-discussion[data-timestamp-note-id="${CSS.escape(noteId)}"] .timestamp-inline-text`
      )?.focus();
    }, 0);

    return true;
  }

  if (event.target.closest("[data-timestamp-reply-cancel]")) {
    formSet.delete(noteId);

    if (listType === "audio") {
      renderTimestampNotes();
    } else {
      renderFilmTimestampNotes();
    }

    return true;
  }

  if (event.target.closest("[data-timestamp-thread-toggle]")) {
    if (expandedSet.has(noteId)) {
      expandedSet.delete(noteId);
    } else {
      expandedSet.add(noteId);
    }

    if (listType === "audio") {
      renderTimestampNotes();
    } else {
      renderFilmTimestampNotes();
    }

    return true;
  }

  if (event.target.closest("[data-timestamp-reply-submit]")) {
    const authorInput =
      discussion.querySelector(".timestamp-inline-author");
    const textInput =
      discussion.querySelector(".timestamp-inline-text");

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (!author) {
      authorInput.focus();
      return true;
    }

    if (!text) {
      textInput.focus();
      return true;
    }

    const submitButton =
      event.target.closest("[data-timestamp-reply-submit]");

    submitButton.disabled = true;

    try {
      localStorage.setItem(
        "gravitards-timestamp-author",
        author
      );

      timestampAuthorInput.value = author;
      filmTimestampAuthorInput.value = author;

      const saved = await createActivityReply({
        entry_type: discussion.dataset.timestampEntryType,
        entry_id: discussion.dataset.timestampEntryId,
        entry_title: discussion.dataset.timestampEntryTitle,
        source: discussion.dataset.timestampSource,
        author,
        comment: text,
        seconds: null,
        parent_id: Number(noteId)
      });

      activityReplies[noteId] ||= [];
      activityReplies[noteId].push(saved);

      formSet.delete(noteId);
      expandedSet.add(noteId);

      if (listType === "audio") {
        renderTimestampNotes();
      } else {
        renderFilmTimestampNotes();
      }

      renderLatestActivity();
      showShareToast("Reply posted");
    } catch (error) {
      submitButton.disabled = false;
      showShareToast(error.message);
    }

    return true;
  }

  return false;
}

timestampList.addEventListener("click", async event => {
  if (await handleTimestampDiscussionAction(event, "audio")) {
    return;
  }

  const jumpButton = event.target.closest("[data-jump-seconds]");
  if (jumpButton) {
    audio.currentTime = Number(jumpButton.dataset.jumpSeconds);
    if (audio.paused) audio.play();
    return;
  }

  const deleteButton = event.target.closest("[data-delete-timestamp]");
  if (!deleteButton || !currentTrack) return;

  const notes = timestampNotes[currentTrack.id] || [];
  const noteIndex =
    Number(deleteButton.dataset.deleteTimestamp);
  const note = notes[noteIndex];

  try {
    await deleteCentralTimestampComment(note?.id);
    notes.splice(noteIndex, 1);

    if (!notes.length) {
      delete timestampNotes[currentTrack.id];
    }

    saveTimestampNotes();
    renderTimestampNotes();
    renderTracks();
    renderLatestActivity();
  } catch (error) {
    showShareToast(error.message);
  }
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
    commentStatus.textContent = "Skriv en comment";
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
    saveCommentButton.textContent = "Skicka comment";
  }
});

commentInput.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    saveCommentButton.click();
  }
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
  repeatButton.title = ["Upprepa av", "Upprepa kö", "Upprepa recording"][repeatMode];
});

refreshButton.addEventListener("click", () => loadTracks(true));


timestampAuthorInput.addEventListener("input", () => {
  filmTimestampAuthorInput.value =
    timestampAuthorInput.value;
});

filmTimestampAuthorInput.addEventListener("input", () => {
  timestampAuthorInput.value =
    filmTimestampAuthorInput.value;
});

mobileComposerSubmit.addEventListener(
  "click",
  () => {
    void submitMobileCommentComposer();
  }
);

mobileComposerCancel.addEventListener(
  "click",
  closeMobileCommentComposer
);

mobileComposerBackButton.addEventListener(
  "click",
  closeMobileCommentComposer
);

mobileCommentComposer.addEventListener(
  "click",
  event => {
    if (event.target.closest("[data-mobile-composer-close]")) {
      closeMobileCommentComposer();
    }
  }
);

mobileComposerText.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      void submitMobileCommentComposer();
    }
  }
);

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
  showMessage("The recording could not be played. Try clicking it again.", true);
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
    filmCommentStatus.textContent = "Skriv en comment";
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
    saveFilmCommentButton.textContent = "Skicka comment";
  }
});

async function saveVideoTimestampNote(author, text) {
  if (!currentFilm) return;

  const seconds = Math.max(
    0,
    Math.floor(getCurrentFilmSeconds())
  );

  const saved = await createCentralTimestampComment({
    entry_type: "video",
    entry_id: currentFilm.id,
    entry_title:
      currentFilm.title ||
      currentFilm.originalName ||
      "Video",
    source: activeFilmSource,
    author,
    comment: text,
    seconds
  });

  filmTimestampNotes[currentFilm.id] ||= [];
  filmTimestampNotes[currentFilm.id].push(saved);

  saveFilmTimestampNotes();
  filmTimestampInput.value = "";

  renderFilmTimestampNotes();
  renderFilms();
  renderLatestActivity();
  showShareToast("Timestamp note posted");
}

saveFilmTimestampButton.addEventListener("click", async event => {
  event.preventDefault();
  event.stopPropagation();

  const author = filmTimestampAuthorInput.value.trim();
  const text = filmTimestampInput.value.trim();

  if (!author) {
    filmTimestampAuthorInput.focus();
    return;
  }

  if (!text) {
    filmTimestampInput.focus();
    return;
  }

  saveFilmTimestampButton.disabled = true;

  try {
    localStorage.setItem(
      "gravitards-timestamp-author",
      author
    );
    timestampAuthorInput.value = author;
    await saveVideoTimestampNote(author, text);
  } catch (error) {
    showShareToast(error.message);
  } finally {
    saveFilmTimestampButton.disabled = false;
  }
});

filmTimestampList.addEventListener("click", async event => {
  if (await handleTimestampDiscussionAction(event, "film")) {
    return;
  }

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
  const noteIndex =
    Number(deleteButton.dataset.filmTimestampDelete);
  const note = notes[noteIndex];

  try {
    await deleteCentralTimestampComment(note?.id);
    notes.splice(noteIndex, 1);

    if (!notes.length) {
      delete filmTimestampNotes[currentFilm.id];
    }

    saveFilmTimestampNotes();
    renderFilmTimestampNotes();
    renderFilms();
    renderLatestActivity();
  } catch (error) {
    showShareToast(error.message);
  }
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

  audio.muted = false;

  if (audio.volume === 0) {
    audio.volume = 0.85;
    volumeBar.value = audio.volume;
    localStorage.setItem(
      "gravitards-volume",
      String(audio.volume)
    );
  }
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


function positionShareMenu(button, menu) {
  if (window.matchMedia("(max-width: 700px)").matches) {
    menu.style.removeProperty("position");
    menu.style.removeProperty("top");
    menu.style.removeProperty("right");
    menu.style.removeProperty("bottom");
    menu.style.removeProperty("left");
    return;
  }

  const buttonRect = button.getBoundingClientRect();
  const menuWidth = Math.min(310, window.innerWidth - 24);
  const estimatedHeight = 156;
  const margin = 12;

  const left = Math.min(
    Math.max(margin, buttonRect.right - menuWidth),
    window.innerWidth - menuWidth - margin
  );

  const roomAbove = buttonRect.top - margin;
  const roomBelow = window.innerHeight - buttonRect.bottom - margin;

  const top =
    roomAbove >= estimatedHeight || roomAbove >= roomBelow
      ? Math.max(margin, buttonRect.top - estimatedHeight - 8)
      : Math.min(
          window.innerHeight - estimatedHeight - margin,
          buttonRect.bottom + 8
        );

  menu.style.position = "fixed";
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.right = "auto";
  menu.style.bottom = "auto";
}

function setShareMenuOpen(button, menu, open) {
  button.setAttribute("aria-expanded", open ? "true" : "false");
  menu.classList.toggle("hidden", !open);

  if (open) {
    positionShareMenu(button, menu);
  } else {
    menu.style.removeProperty("position");
    menu.style.removeProperty("top");
    menu.style.removeProperty("right");
    menu.style.removeProperty("bottom");
    menu.style.removeProperty("left");
  }
}

function closeAllShareMenus() {
  if (audioShareMenuButton && audioShareMenu) {
    setShareMenuOpen(
      audioShareMenuButton,
      audioShareMenu,
      false
    );
  }

  if (filmShareMenuButton && filmShareMenu) {
    setShareMenuOpen(
      filmShareMenuButton,
      filmShareMenu,
      false
    );
  }
}

async function copyFilmShareLink(includeCurrentTime) {
  if (!currentFilm) return;

  const currentSeconds = getCurrentFilmSeconds();
  const seconds =
    includeCurrentTime && currentSeconds > 0
      ? Math.floor(currentSeconds)
      : null;

  const url = buildVaultShareUrl({
    archive: "video",
    source: activeFilmSource,
    entryId: currentFilm.id,
    seconds
  });

  await copyTextToClipboard(url);

  showShareToast(
    seconds
      ? "Link with current time copied"
      : "Video link copied"
  );
}

mobileNotesButton?.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();

  const open =
    !audioTimestampPanel.classList.contains(
      "mobile-notes-panel-open"
    );

  setMobileNotesPanel(open);
});

closeMobileNotesPanel?.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  setMobileNotesPanel(false);
});

audioShareMenuButton?.addEventListener("click", event => {
  event.stopPropagation();

  const opening =
    audioShareMenu.classList.contains("hidden");

  closeAllShareMenus();

  setShareMenuOpen(
    audioShareMenuButton,
    audioShareMenu,
    opening
  );
});

filmShareMenuButton?.addEventListener("click", event => {
  event.stopPropagation();

  const opening =
    filmShareMenu.classList.contains("hidden");

  closeAllShareMenus();

  setShareMenuOpen(
    filmShareMenuButton,
    filmShareMenu,
    opening
  );
});

copyRecordingLinkButton?.addEventListener(
  "click",
  async () => {
    await copyAudioShareLink(false);
    closeAllShareMenus();
  }
);

copyRecordingTimeLinkButton?.addEventListener(
  "click",
  async () => {
    await copyAudioShareLink(true);
    closeAllShareMenus();
  }
);

copyVideoLinkButton?.addEventListener(
  "click",
  async () => {
    await copyFilmShareLink(false);
    closeAllShareMenus();
  }
);

copyVideoTimeLinkButton?.addEventListener(
  "click",
  async () => {
    await copyFilmShareLink(true);
    closeAllShareMenus();
  }
);

document.addEventListener("click", event => {
  if (!event.target.closest(".share-menu-wrap")) {
    closeAllShareMenus();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeAllShareMenus();
    closeMobileCommentComposer();
    setMobileNotesPanel(false);
  }
});

window.addEventListener("resize", () => {
  if (
    audioShareMenu &&
    !audioShareMenu.classList.contains("hidden")
  ) {
    positionShareMenu(
      audioShareMenuButton,
      audioShareMenu
    );
  }

  if (
    filmShareMenu &&
    !filmShareMenu.classList.contains("hidden")
  ) {
    positionShareMenu(
      filmShareMenuButton,
      filmShareMenu
    );
  }
});

window.addEventListener("hashchange", () => {
  pendingSharedLocation = parseVaultShareLocation();

  if (!pendingSharedLocation) return;

  if (pendingSharedLocation.archive === "audio") {
    void tryOpenSharedAudio();
  } else {
    tryOpenSharedFilm();
  }
});

audioArchiveTab.addEventListener("click", () => setArchiveView("audio"));
filmArchiveTab.addEventListener("click", () => setArchiveView("film"));
activityArchiveTab.addEventListener(
  "click",
  () => setArchiveView("activity")
);

activityFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeActivityFilter = button.dataset.activityFilter;
    renderLatestActivity();
  });
});

forumSearchInput?.addEventListener(
  "input",
  renderLatestActivity
);

latestActivityList.addEventListener("click", event => {
  const thread = event.target.closest(".activity-thread");

  if (
    thread &&
    event.target.closest(".forum-thread-open")
  ) {
    void openActivityEntry(thread);
  }
});
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
void loadCentralTimestampComments().catch(error => {
  console.error(
    "Could not load central timestamp comments:",
    error
  );
});

void loadCommentLikes().catch(error => {
  console.error("Could not load likes:", error);
});


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
