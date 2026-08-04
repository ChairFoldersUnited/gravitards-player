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

const YOUTUBE_PLAYLIST_ID =
  process.env.YOUTUBE_PLAYLIST_ID ||
  "PLA74wG8-e4XBIKCB6HkAg-s2nvVR1hFQ8";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

app.disable("x-powered-by");
app.use(express.json());

let libraryCache = {
  expiresAt: 0,
  tracks: []
};

let youtubeCache = {
  expiresAt: 0,
  videos: []
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

function parseIsoDuration(value) {
  const match = String(value || "").match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/
  );

  if (!match) return 0;

  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);

  return (
    days * 86400 +
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

async function youtubeGet(endpoint, params) {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "YOUTUBE_API_KEY saknas i Render Environment Variables."
    );
  }

  const url = new URL(
    `https://www.googleapis.com/youtube/v3/${endpoint}`
  );

  Object.entries({
    ...params,
    key: YOUTUBE_API_KEY
  }).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url);

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `YouTube API-fel ${response.status}: ${details}`
    );
  }

  return response.json();
}

async function fetchYouTubeVideos() {
  if (Date.now() < youtubeCache.expiresAt) {
    return youtubeCache.videos;
  }

  const playlistItems = [];
  let pageToken = "";

  do {
    const data = await youtubeGet("playlistItems", {
      part: "snippet,contentDetails,status",
      playlistId: YOUTUBE_PLAYLIST_ID,
      maxResults: 50,
      pageToken
    });

    playlistItems.push(...(data.items || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  const usableItems = playlistItems.filter((item) => {
    const videoId =
      item.contentDetails?.videoId ||
      item.snippet?.resourceId?.videoId;

    const title = item.snippet?.title || "";

    return (
      videoId &&
      title !== "Deleted video" &&
      title !== "Private video"
    );
  });

  const videoIds = usableItems.map(
    (item) =>
      item.contentDetails?.videoId ||
      item.snippet?.resourceId?.videoId
  );

  const detailsById = new Map();

  for (
    let index = 0;
    index < videoIds.length;
    index += 50
  ) {
    const batch = videoIds.slice(index, index + 50);

    const data = await youtubeGet("videos", {
      part: "snippet,contentDetails,status",
      id: batch.join(",")
    });

    for (const video of data.items || []) {
      detailsById.set(video.id, video);
    }
  }

  const videos = usableItems
    .map((item, position) => {
      const videoId =
        item.contentDetails?.videoId ||
        item.snippet?.resourceId?.videoId;

      const details = detailsById.get(videoId);
      const snippet =
        details?.snippet || item.snippet || {};

      const thumbnails = snippet.thumbnails || {};

      return {
        id: videoId,
        title: snippet.title || "Namnlös video",
        description: snippet.description || "",
        publishedAt:
          snippet.publishedAt ||
          item.contentDetails?.videoPublishedAt ||
          item.snippet?.publishedAt ||
          "",
        addedAt: item.snippet?.publishedAt || "",
        channelTitle: snippet.channelTitle || "",
        durationSeconds: parseIsoDuration(
          details?.contentDetails?.duration
        ),
        thumbnail:
          thumbnails.maxres?.url ||
          thumbnails.standard?.url ||
          thumbnails.high?.url ||
          thumbnails.medium?.url ||
          thumbnails.default?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        position: Number(
          item.snippet?.position ?? position
        ),
        embeddable:
          details?.status?.embeddable !== false,
        privacyStatus:
          details?.status?.privacyStatus || "public"
      };
    })
    .filter(
      (video) => video.privacyStatus !== "private"
    )
    .sort((a, b) => a.position - b.position);

  youtubeCache = {
    expiresAt: Date.now() + 15 * 60 * 1000,
    videos
  };

  return videos;
}

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
    youtubeConfigured: Boolean(YOUTUBE_API_KEY),
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

app.get("/api/videos", async (_req, res) => {
  try {
    const videos = await fetchYouTubeVideos();

    res.json({
      playlistId: YOUTUBE_PLAYLIST_ID,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.post(
  "/api/videos/refresh",
  async (_req, res) => {
    youtubeCache.expiresAt = 0;

    try {
      const videos =
        await fetchYouTubeVideos();

      res.json({
        ok: true,
        count: videos.length
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message
      });
    }
  }
);

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
