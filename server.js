import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const DROPBOX_FOLDER = normalizeFolder(
  process.env.DROPBOX_FOLDER || "/Musik/Gravitards"
);

const DROPBOX_APP_KEY = process.env.DROPBOX_APP_KEY || "";
const DROPBOX_APP_SECRET = process.env.DROPBOX_APP_SECRET || "";
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN || "";

/*
 * Tillfällig reservlösning:
 * Om refresh-tokenvariablerna ännu inte är konfigurerade används den gamla
 * DROPBOX_ACCESS_TOKEN. När refresh-tokenlösningen fungerar kan den gamla
 * variabeln tas bort från Render.
 */
const DROPBOX_FALLBACK_ACCESS_TOKEN =
  process.env.DROPBOX_ACCESS_TOKEN || "";

const YOUTUBE_VIDEOS_SHARED_LINK =
  process.env.YOUTUBE_VIDEOS_SHARED_LINK ||
  "https://www.dropbox.com/scl/fo/lyokgm77ua9ln34iryhmk/APgJunJSefCA8RHoNwwuV4c?rlkey=5pm7lmxvtk7ws2dg8iistbo1r&st=4w0nnw09&dl=0";

const FACEBOOK_STREAMS_SHARED_LINK =
  process.env.FACEBOOK_STREAMS_SHARED_LINK ||
  "https://www.dropbox.com/scl/fo/lsx0wg0f2tiexxzpwu2o0/AGonZOKM_QsjIXpiYiqYrA4?rlkey=9k8nk34sp2tmrcur9l4pju5qa&st=6hjw6h1d&dl=0";

const INSTAGRAM_STREAMS_SHARED_LINK =
  process.env.INSTAGRAM_STREAMS_SHARED_LINK ||
  "https://www.dropbox.com/scl/fo/wzh3akhkoa926nwl06cri/AEbx_fDY9lsIe6QT5g4Mhu4?rlkey=jft6ywrfwv16wftas9u5rfhdl&st=jjwf2f76&dl=0";

function cleanEnvironmentValue(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/[\r\n]/g, "");
}

const SUPABASE_URL = cleanEnvironmentValue(
  process.env.SUPABASE_URL
).replace(/\/+$/, "");

const SUPABASE_SECRET_KEY = cleanEnvironmentValue(
  process.env.SUPABASE_SECRET_KEY
);

app.disable("x-powered-by");
app.use(express.json());

let libraryCache = {
  expiresAt: 0,
  tracks: []
};

let youtubeVideosCache = {
  expiresAt: 0,
  videos: []
};

let facebookStreamsCache = {
  expiresAt: 0,
  streams: []
};

let instagramStreamsCache = {
  expiresAt: 0,
  streams: []
};

let dropboxTokenCache = {
  accessToken: "",
  expiresAt: 0,
  pendingRequest: null
};

function normalizeFolder(folder) {
  if (!folder || folder === "/") {
    return "";
  }

  return "/" + folder.replace(/^\/+|\/+$/g, "");
}

function hasDropboxRefreshConfiguration() {
  return Boolean(
    DROPBOX_APP_KEY &&
    DROPBOX_APP_SECRET &&
    DROPBOX_REFRESH_TOKEN
  );
}

async function refreshDropboxAccessToken() {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: DROPBOX_REFRESH_TOKEN,
    client_id: DROPBOX_APP_KEY,
    client_secret: DROPBOX_APP_SECRET
  });

  const response = await fetch(
    "https://api.dropboxapi.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Dropbox kunde inte förnya access token (${response.status}): ${details}`
    );
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error(
      "Dropbox svarade utan någon ny access token."
    );
  }

  const expiresInSeconds = Number(data.expires_in || 14400);

  /*
   * Förnya fem minuter före den faktiska utgångstiden.
   */
  dropboxTokenCache = {
    accessToken: data.access_token,
    expiresAt:
      Date.now() +
      Math.max(60, expiresInSeconds - 300) * 1000,
    pendingRequest: null
  };

  return dropboxTokenCache.accessToken;
}

async function getDropboxAccessToken(forceRefresh = false) {
  if (hasDropboxRefreshConfiguration()) {
    if (
      !forceRefresh &&
      dropboxTokenCache.accessToken &&
      Date.now() < dropboxTokenCache.expiresAt
    ) {
      return dropboxTokenCache.accessToken;
    }

    /*
     * Förhindrar att flera samtidiga anrop försöker förnya token parallellt.
     */
    if (!dropboxTokenCache.pendingRequest) {
      dropboxTokenCache.pendingRequest =
        refreshDropboxAccessToken()
          .finally(() => {
            dropboxTokenCache.pendingRequest = null;
          });
    }

    return dropboxTokenCache.pendingRequest;
  }

  if (DROPBOX_FALLBACK_ACCESS_TOKEN) {
    return DROPBOX_FALLBACK_ACCESS_TOKEN;
  }

  throw new Error(
    "Dropbox är inte konfigurerat. Lägg till DROPBOX_APP_KEY, " +
    "DROPBOX_APP_SECRET och DROPBOX_REFRESH_TOKEN i Render."
  );
}

async function dropboxFetch(url, options = {}, retry = true) {
  const accessToken = await getDropboxAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`
    }
  });

  /*
   * Om Dropbox trots allt svarar 401 tvingar vi fram en tokenförnyelse och
   * provar exakt en gång till.
   */
  if (
    response.status === 401 &&
    retry &&
    hasDropboxRefreshConfiguration()
  ) {
    await getDropboxAccessToken(true);

    return dropboxFetch(url, options, false);
  }

  return response;
}

async function dropboxRpc(endpoint, body) {
  const response = await dropboxFetch(
    `https://api.dropboxapi.com/2/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Dropbox API-fel ${response.status}: ${details}`
    );
  }

  return response.json();
}

async function dropboxDownload(pathValue) {
  return dropboxFetch(
    "https://content.dropboxapi.com/2/files/download",
    {
      method: "POST",
      headers: {
        "Dropbox-API-Arg": JSON.stringify({
          path: pathValue
        })
      }
    }
  );
}


function isVideoFile(entry) {
  return (
    entry[".tag"] === "file" &&
    /\.(mp4|m4v|mov|webm|mkv|avi)$/i.test(entry.name)
  );
}

async function fetchFacebookStreams() {
  return fetchSharedVideoFolder(
    FACEBOOK_STREAMS_SHARED_LINK,
    facebookStreamsCache,
    "facebook",
    "Facebook Stream"
  );
}

async function fetchInstagramStreams() {
  return fetchSharedVideoFolder(
    INSTAGRAM_STREAMS_SHARED_LINK,
    instagramStreamsCache,
    "instagram",
    "Instagram Stream"
  );
}

function isAudioFile(entry) {
  return (
    entry[".tag"] === "file" &&
    /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(entry.name)
  );
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replaceAll("_", " ")
    .trim();
}

function safeDownloadFilename(filename) {
  return String(filename || "gravitards-recording.mp3")
    .replace(/[\r\n"]/g, "")
    .trim() || "gravitards-recording.mp3";
}

async function fetchLibrary() {
  if (Date.now() < libraryCache.expiresAt) {
    return libraryCache.tracks;
  }

  let result = await dropboxRpc("files/list_folder", {
    path: DROPBOX_FOLDER,
    recursive: true,
    include_deleted: false,
    include_non_downloadable_files: false,
    limit: 2000
  });

  const entries = [...result.entries];

  while (result.has_more) {
    result = await dropboxRpc(
      "files/list_folder/continue",
      {
        cursor: result.cursor
      }
    );

    entries.push(...result.entries);
  }

  const tracks = entries
    .filter(isAudioFile)
    .map((entry) => {
      const pathDisplay =
        entry.path_display || entry.path_lower;

      const folderParts = pathDisplay.split("/");
      folderParts.pop();

      return {
        id: entry.id,
        name: entry.name,
        title: titleFromFilename(entry.name),
        path: entry.path_lower,
        folder: folderParts.join("/") || "/",
        size: entry.size,
        modified: entry.server_modified
      };
    })
    .sort((a, b) =>
      a.path.localeCompare(b.path, "sv", {
        numeric: true,
        sensitivity: "base"
      })
    );

  libraryCache = {
    expiresAt: Date.now() + 5 * 60 * 1000,
    tracks
  };

  return tracks;
}


function displayTitleFromVideoFilename(filename, fallback) {
  const withoutExtension = String(filename || "")
    .replace(/\.[^.]+$/, "")
    .trim();

  const withoutLeadingDate = withoutExtension
    .replace(/^\d{8}\s*[-–—]\s*/, "")
    .replace(/^\d{4}-\d{2}-\d{2}\s*[-–—]\s*/, "")
    .trim();

  return withoutLeadingDate || fallback;
}

function extractUploadDateFromFilename(filename) {
  const compact = String(filename || "").match(/^(\d{4})(\d{2})(\d{2})/);

  if (compact) {
    return `${compact[1]}-${compact[2]}-${compact[3]}T00:00:00.000Z`;
  }

  const dashed = String(filename || "").match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dashed) {
    return `${dashed[1]}-${dashed[2]}-${dashed[3]}T00:00:00.000Z`;
  }

  return "";
}

async function fetchSharedVideoFolder(sharedLink, cache, source, fallbackLabel) {
  if (Date.now() < cache.expiresAt) {
    return cache.videos || cache.streams || [];
  }

  let result = await dropboxRpc("files/list_folder", {
    path: "",
    recursive: false,
    include_deleted: false,
    include_non_downloadable_files: false,
    limit: 2000,
    shared_link: {
      url: sharedLink
    }
  });

  const entries = [...(result.entries || [])];

  while (result.has_more) {
    result = await dropboxRpc("files/list_folder/continue", {
      cursor: result.cursor
    });

    entries.push(...(result.entries || []));
  }

  const videos = entries
    .filter(isVideoFile)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "sv", {
        numeric: true,
        sensitivity: "base"
      })
    )
    .map((entry, index) => {
      const fallback =
        `${fallbackLabel} ${String(index + 1).padStart(2, "0")}`;

      return {
        id: `${source}:${entry.id}`,
        dropboxId: entry.id,
        title:
          source === "facebook" || source === "instagram"
            ? fallback
            : displayTitleFromVideoFilename(entry.name, fallback),
        originalName: entry.name,
        size: entry.size,
        contentHash: entry.content_hash || "",
        source,
        position: index,
        publishedAt:
          source === "youtube"
            ? extractUploadDateFromFilename(entry.name)
            : ""
      };
    });

  cache.expiresAt = Date.now() + 10 * 60 * 1000;

  if ("videos" in cache) {
    cache.videos = videos;
  } else {
    cache.streams = videos;
  }

  return videos;
}

async function fetchYouTubeDropboxVideos() {
  return fetchSharedVideoFolder(
    YOUTUBE_VIDEOS_SHARED_LINK,
    youtubeVideosCache,
    "youtube",
    "YouTube Video"
  );
}


function hasSupabaseConfiguration() {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}

async function supabaseRequest(pathname, options = {}) {
  if (!hasSupabaseConfiguration()) {
    throw new Error(
      "Supabase är inte konfigurerat. Lägg till SUPABASE_URL och " +
      "SUPABASE_SECRET_KEY i Render Environment Variables."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${pathname}`,
    {
      ...options,
      headers: {
        apikey: SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `Supabase-fel ${response.status}: ${details}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function validateCommentInput(value, field, maxLength) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    throw new Error(`${field} måste fyllas i.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(
      `${field} får innehålla högst ${maxLength} tecken.`
    );
  }

  return normalized;
}

app.get("/api/comments", async (req, res) => {
  try {
    const entryType = validateCommentInput(
      req.query.type,
      "Kommentarstyp",
      10
    );

    const entryId = validateCommentInput(
      req.query.id,
      "Entry-ID",
      500
    );

    if (!["audio", "video"].includes(entryType)) {
      return res.status(400).json({
        error:
          "Kommentarstypen måste vara audio eller video."
      });
    }

    const query = new URLSearchParams({
      select:
        "id,entry_type,entry_id,author,comment,created_at",
      entry_type: `eq.${entryType}`,
      entry_id: `eq.${entryId}`,
      order: "created_at.asc"
    });

    const comments = await supabaseRequest(
      `vault_comments?${query.toString()}`
    );

    res.json({
      count: comments?.length || 0,
      comments: comments || []
    });
  } catch (error) {
    console.error(error);

    const status =
      /måste|högst|Kommentarstyp/.test(error.message)
        ? 400
        : 500;

    res.status(status).json({
      error: error.message
    });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const entryType = validateCommentInput(
      req.body?.entry_type,
      "Kommentarstyp",
      10
    );

    const entryId = validateCommentInput(
      req.body?.entry_id,
      "Entry-ID",
      500
    );

    const author = validateCommentInput(
      req.body?.author,
      "Namn",
      80
    );

    const comment = validateCommentInput(
      req.body?.comment,
      "Kommentar",
      2000
    );

    if (!["audio", "video"].includes(entryType)) {
      return res.status(400).json({
        error:
          "Kommentarstypen måste vara audio eller video."
      });
    }

    const inserted = await supabaseRequest(
      "vault_comments",
      {
        method: "POST",
        headers: {
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          entry_type: entryType,
          entry_id: entryId,
          author,
          comment
        })
      }
    );

    res.status(201).json({
      comment: inserted?.[0] || null
    });
  } catch (error) {
    console.error(error);

    const status =
      /måste|högst|Kommentarstyp/.test(error.message)
        ? 400
        : 500;

    res.status(status).json({
      error: error.message
    });
  }
});


function groupExactDuplicateVideos(videos) {
  const groupsByHash = new Map();

  for (const video of videos) {
    if (!video.contentHash) continue;

    if (!groupsByHash.has(video.contentHash)) {
      groupsByHash.set(video.contentHash, []);
    }

    groupsByHash.get(video.contentHash).push(video);
  }

  return [...groupsByHash.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([contentHash, files], index) => ({
      group: index + 1,
      contentHash,
      fileCount: files.length,
      duplicateCopies: files.length - 1,
      wastedBytes:
        files.slice(1).reduce(
          (sum, file) => sum + Number(file.size || 0),
          0
        ),
      files: files.map(file => ({
        id: file.id,
        dropboxId: file.dropboxId,
        title: file.title,
        originalName: file.originalName,
        size: file.size,
        source: file.source
      }))
    }))
    .sort((a, b) => b.wastedBytes - a.wastedBytes);
}

function formatBytesForReport(bytes) {
  const value = Number(bytes || 0);

  if (!Number.isFinite(value) || value <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );

  const amount = value / Math.pow(1024, unitIndex);

  return `${amount.toFixed(
    amount >= 100 || unitIndex === 0 ? 0 : 2
  )} ${units[unitIndex]}`;
}

async function buildDuplicateVideoReport() {
  const [youtubeVideos, facebookStreams, instagramStreams] =
    await Promise.all([
      fetchYouTubeDropboxVideos(),
      fetchFacebookStreams(),
      fetchInstagramStreams()
    ]);

  const allVideos = [
    ...youtubeVideos,
    ...facebookStreams,
    ...instagramStreams
  ];

  const groups = groupExactDuplicateVideos(allVideos);

  const duplicateCopies = groups.reduce(
    (sum, group) => sum + group.duplicateCopies,
    0
  );

  const wastedBytes = groups.reduce(
    (sum, group) => sum + group.wastedBytes,
    0
  );

  return {
    checkedAt: new Date().toISOString(),
    checkedFiles: allVideos.length,
    exactDuplicateGroups: groups.length,
    duplicateCopies,
    wastedBytes,
    wastedSpace: formatBytesForReport(wastedBytes),
    note:
      "Rapporten hittar endast bit-för-bit-identiska filer med samma Dropbox content_hash.",
    groups
  };
}

app.get("/api/duplicate-videos", async (_req, res) => {
  try {
    const report = await buildDuplicateVideoReport();
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/duplicate-videos", async (_req, res) => {
  try {
    const report = await buildDuplicateVideoReport();

    const groupMarkup = report.groups.length
      ? report.groups.map(group => `
          <section class="duplicate-group">
            <h2>Dubblettgrupp ${group.group}</h2>
            <p class="hash">Hash: ${group.contentHash}</p>
            <p>
              ${group.fileCount} identiska filer ·
              möjlig besparing ${formatBytesForReport(group.wastedBytes)}
            </p>

            <div class="files">
              ${group.files.map((file, fileIndex) => `
                <article>
                  <strong>
                    ${fileIndex === 0 ? "Behåll exempelvis:" : "Dubblett:"}
                  </strong>
                  <span>${String(file.originalName || "").replace(/[&<>"']/g, character => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"
                  })[character])}</span>
                  <small>
                    ${file.source === "youtube" ? "YouTube Videos" : file.source === "facebook" ? "Facebook Streams" : "Instagram Streams"}
                    · ${formatBytesForReport(file.size)}
                  </small>
                </article>
              `).join("")}
            </div>
          </section>
        `).join("")
      : `
          <section class="empty">
            <h2>Inga exakta dubbletter hittades</h2>
            <p>
              Alla kontrollerade videor hade olika Dropbox content_hash.
            </p>
          </section>
        `;

    res.type("html").send(`<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Vault Duplicate Report</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: Arial, sans-serif;
    }

    body {
      margin: 0;
      background: #080807;
      color: #d8d1c5;
    }

    main {
      width: min(1050px, calc(100% - 30px));
      margin: 30px auto 70px;
    }

    header,
    .duplicate-group,
    .empty {
      margin-bottom: 16px;
      padding: 20px;
      border: 1px solid #4b4437;
      background: #12110f;
    }

    h1,
    h2 {
      margin-top: 0;
      color: #d7b970;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }

    .summary div {
      padding: 13px;
      border: 1px solid #312d25;
      background: #090908;
    }

    .summary strong,
    .summary span {
      display: block;
    }

    .summary strong {
      margin-bottom: 5px;
      color: #eee4cf;
      font-size: 1.2rem;
    }

    .summary span,
    small,
    .hash {
      color: #8f887d;
    }

    .hash {
      overflow-wrap: anywhere;
      font-family: monospace;
      font-size: .75rem;
    }

    .files {
      display: grid;
      gap: 8px;
    }

    article {
      display: grid;
      gap: 5px;
      padding: 12px;
      border: 1px solid #302c24;
      background: #090908;
    }

    article strong {
      color: #c9aa63;
    }

    @media (max-width: 720px) {
      .summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>The Gravitards Vault – Duplicate Report</h1>
      <p>
        Endast exakta dubbletter visas. Rapporten raderar eller ändrar inga filer.
      </p>

      <div class="summary">
        <div>
          <strong>${report.checkedFiles}</strong>
          <span>kontrollerade filer</span>
        </div>
        <div>
          <strong>${report.exactDuplicateGroups}</strong>
          <span>dubblettgrupper</span>
        </div>
        <div>
          <strong>${report.duplicateCopies}</strong>
          <span>extra kopior</span>
        </div>
        <div>
          <strong>${report.wastedSpace}</strong>
          <span>möjlig besparing</span>
        </div>
      </div>
    </header>

    ${groupMarkup}
  </main>
</body>
</html>`);
  } catch (error) {
    console.error(error);

    res.status(500).type("html").send(`
      <h1>Dubblettkontrollen misslyckades</h1>
      <pre>${String(error.message || error)}</pre>
    `);
  }
});

app.get("/api/status", async (_req, res) => {
  let dropboxReady = false;
  let dropboxAuthMode = "none";

  try {
    await getDropboxAccessToken();
    dropboxReady = true;
    dropboxAuthMode =
      hasDropboxRefreshConfiguration()
        ? "refresh_token"
        : "temporary_access_token";
  } catch {
    dropboxReady = false;
  }

  res.json({
    running: true,
    dropboxConfigured: dropboxReady,
    dropboxAuthMode,
    youtubeConfigured: Boolean(YOUTUBE_VIDEOS_SHARED_LINK),
    supabaseConfigured: hasSupabaseConfiguration(),
    folder: DROPBOX_FOLDER || "/"
  });
});

app.get("/api/tracks", async (_req, res) => {
  try {
    const tracks = await fetchLibrary();

    res.json({
      folder: DROPBOX_FOLDER || "/",
      count: tracks.length,
      tracks
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.post("/api/refresh", async (_req, res) => {
  libraryCache.expiresAt = 0;

  try {
    const tracks = await fetchLibrary();

    res.json({
      ok: true,
      count: tracks.length
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/api/play/:id", async (req, res) => {
  try {
    const tracks = await fetchLibrary();

    const track = tracks.find(
      (item) => item.id === req.params.id
    );

    if (!track) {
      return res
        .status(404)
        .send("Inspelningen hittades inte.");
    }

    const data = await dropboxRpc(
      "files/get_temporary_link",
      {
        path: track.path
      }
    );

    res.set("Cache-Control", "no-store");

    return res.redirect(302, data.link);
  } catch (error) {
    console.error(error);

    return res.status(500).send(error.message);
  }
});

app.get("/api/download/:id", async (req, res) => {
  try {
    const tracks = await fetchLibrary();

    const track = tracks.find(
      (item) => item.id === req.params.id
    );

    if (!track) {
      return res
        .status(404)
        .send("Inspelningen hittades inte.");
    }

    const response = await dropboxDownload(track.path);

    if (!response.ok || !response.body) {
      const details = await response.text();

      throw new Error(
        `Dropbox-nedladdning misslyckades ` +
        `(${response.status}): ${details}`
      );
    }

    const filename =
      safeDownloadFilename(track.name);

    res.set({
      "Content-Type":
        response.headers.get("content-type") ||
        "application/octet-stream",
      "Content-Disposition":
        `attachment; filename*=UTF-8''` +
        encodeURIComponent(filename),
      "Cache-Control": "private, no-store"
    });

    const contentLength =
      response.headers.get("content-length");

    if (contentLength) {
      res.set("Content-Length", contentLength);
    }

    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).send(error.message);
    } else {
      res.destroy(error);
    }
  }
});


app.get("/api/facebook-streams", async (_req, res) => {
  try {
    const streams = await fetchFacebookStreams();

    res.json({
      count: streams.length,
      streams
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/facebook-streams/refresh", async (_req, res) => {
  facebookStreamsCache.expiresAt = 0;

  try {
    const streams = await fetchFacebookStreams();
    res.json({ ok: true, count: streams.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/facebook-streams/play/:id", async (req, res) => {
  try {
    const streams = await fetchFacebookStreams();
    const stream = streams.find(
      item => item.dropboxId === req.params.id
    );

    if (!stream) {
      return res.status(404).send("Facebook-streamen hittades inte.");
    }

    const data = await dropboxRpc("files/get_temporary_link", {
      path: stream.dropboxId
    });

    res.set("Cache-Control", "no-store");
    return res.redirect(302, data.link);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

app.get("/api/facebook-streams/download/:id", async (req, res) => {
  try {
    const streams = await fetchFacebookStreams();
    const stream = streams.find(
      item => item.dropboxId === req.params.id
    );

    if (!stream) {
      return res.status(404).send("Facebook-streamen hittades inte.");
    }

    const response = await dropboxDownload(stream.dropboxId);

    if (!response.ok || !response.body) {
      const details = await response.text();
      throw new Error(
        `Dropbox-nedladdning misslyckades (${response.status}): ${details}`
      );
    }

    const filename = safeDownloadFilename(stream.originalName);

    res.set({
      "Content-Type":
        response.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition":
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store"
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.set("Content-Length", contentLength);
    }

    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).send(error.message);
    } else {
      res.destroy(error);
    }
  }
});


app.get("/api/instagram-streams", async (_req, res) => {
  try {
    const streams = await fetchInstagramStreams();
    res.json({ count: streams.length, streams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/instagram-streams/refresh", async (_req, res) => {
  instagramStreamsCache.expiresAt = 0;
  try {
    const streams = await fetchInstagramStreams();
    res.json({ ok: true, count: streams.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/instagram-streams/play/:id", async (req, res) => {
  try {
    const streams = await fetchInstagramStreams();
    const stream = streams.find(item => item.dropboxId === req.params.id);
    if (!stream) return res.status(404).send("Instagram-streamen hittades inte.");

    const data = await dropboxRpc("files/get_temporary_link", {
      path: stream.dropboxId
    });
    res.set("Cache-Control", "no-store");
    return res.redirect(302, data.link);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

app.get("/api/instagram-streams/download/:id", async (req, res) => {
  try {
    const streams = await fetchInstagramStreams();
    const stream = streams.find(item => item.dropboxId === req.params.id);
    if (!stream) return res.status(404).send("Instagram-streamen hittades inte.");

    const response = await dropboxDownload(stream.dropboxId);
    if (!response.ok || !response.body) {
      const details = await response.text();
      throw new Error(`Dropbox-nedladdning misslyckades (${response.status}): ${details}`);
    }

    const filename = safeDownloadFilename(stream.originalName);
    res.set({
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store"
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength) res.set("Content-Length", contentLength);
    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).send(error.message);
    else res.destroy(error);
  }
});

app.get("/api/videos", async (_req, res) => {
  try {
    const videos = await fetchYouTubeDropboxVideos();

    res.json({
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/videos/refresh", async (_req, res) => {
  youtubeVideosCache.expiresAt = 0;

  try {
    const videos = await fetchYouTubeDropboxVideos();
    res.json({ ok: true, count: videos.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/videos/play/:id", async (req, res) => {
  try {
    const videos = await fetchYouTubeDropboxVideos();
    const video = videos.find(
      item => item.dropboxId === req.params.id
    );

    if (!video) {
      return res.status(404).send("YouTube-videon hittades inte.");
    }

    const data = await dropboxRpc("files/get_temporary_link", {
      path: video.dropboxId
    });

    res.set("Cache-Control", "no-store");
    return res.redirect(302, data.link);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

app.get("/api/videos/download/:id", async (req, res) => {
  try {
    const videos = await fetchYouTubeDropboxVideos();
    const video = videos.find(
      item => item.dropboxId === req.params.id
    );

    if (!video) {
      return res.status(404).send("YouTube-videon hittades inte.");
    }

    const response = await dropboxDownload(video.dropboxId);

    if (!response.ok || !response.body) {
      const details = await response.text();
      throw new Error(
        `Dropbox-nedladdning misslyckades (${response.status}): ${details}`
      );
    }

    const filename = safeDownloadFilename(video.originalName);

    res.set({
      "Content-Type":
        response.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition":
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store"
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.set("Content-Length", contentLength);
    }

    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).send(error.message);
    } else {
      res.destroy(error);
    }
  }
});

app.use(
  express.static(__dirname, {
    extensions: ["html"],
    maxAge: "1h"
  })
);

app.get("/", (_req, res) => {
  res.sendFile(
    path.join(__dirname, "index.html")
  );
});

app.use((_req, res) => {
  res
    .status(404)
    .sendFile(
      path.join(__dirname, "index.html")
    );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `The Gravitards Vault kör på port ${PORT}`
  );

  console.log(
    `Dropbox-autentisering: ${
      hasDropboxRefreshConfiguration()
        ? "refresh token"
        : DROPBOX_FALLBACK_ACCESS_TOKEN
          ? "tillfällig access token"
          : "saknas"
    }`
  );

  console.log(
    `Dropbox-mapp: ${DROPBOX_FOLDER || "/"}`
  );
});
