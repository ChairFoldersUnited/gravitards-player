import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DROPBOX_FOLDER = normalizeFolder(process.env.DROPBOX_FOLDER || "");

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "."), {
  extensions: ["html"],
  maxAge: "1h"
}));

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;
let libraryCache = { expiresAt: 0, tracks: [] };

function normalizeFolder(folder) {
  if (!folder || folder === "/") return "";
  return "/" + folder.replace(/^\/+|\/+$/g, "");
}

async function getAccessToken() {
  if (process.env.DROPBOX_ACCESS_TOKEN) return process.env.DROPBOX_ACCESS_TOKEN;

  const key = process.env.DROPBOX_APP_KEY;
  const secret = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

  if (!key || !secret || !refreshToken) {
    throw new Error(
      "Dropbox är inte konfigurerat. Ange DROPBOX_APP_KEY, DROPBOX_APP_SECRET och DROPBOX_REFRESH_TOKEN."
    );
  }

  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: key,
    client_secret: secret
  });

  const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Kunde inte förnya Dropbox-token (${response.status}): ${detail}`);
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  cachedAccessTokenExpiresAt = Date.now() + Number(data.expires_in || 14400) * 1000;
  return cachedAccessToken;
}

async function dropboxRpc(endpoint, body) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://api.dropboxapi.com/2/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Dropbox API-fel (${response.status}): ${detail}`);
  }
  return response.json();
}

function isAudioFile(entry) {
  return entry[".tag"] === "file" && /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(entry.name);
}

function titleFromName(name) {
  return name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim();
}

async function fetchLibrary() {
  if (Date.now() < libraryCache.expiresAt) return libraryCache.tracks;

  let result = await dropboxRpc("files/list_folder", {
    path: DROPBOX_FOLDER,
    recursive: true,
    include_deleted: false,
    include_non_downloadable_files: false,
    limit: 2000
  });

  const entries = [...result.entries];
  while (result.has_more) {
    result = await dropboxRpc("files/list_folder/continue", { cursor: result.cursor });
    entries.push(...result.entries);
  }

  const tracks = entries
    .filter(isAudioFile)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      title: titleFromName(entry.name),
      path: entry.path_lower,
      folder: entry.path_display?.split("/").slice(0, -1).join("/") || "/",
      size: entry.size,
      modified: entry.server_modified
    }))
    .sort((a, b) => a.path.localeCompare(b.path, "sv", { numeric: true, sensitivity: "base" }));

  libraryCache = {
    expiresAt: Date.now() + 5 * 60 * 1000,
    tracks
  };
  return tracks;
}

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
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/refresh", express.json(), async (_req, res) => {
  libraryCache.expiresAt = 0;
  try {
    const tracks = await fetchLibrary();
    res.json({ ok: true, count: tracks.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/play/:id", async (req, res) => {
  try {
    const tracks = await fetchLibrary();
    const track = tracks.find((item) => item.id === req.params.id);
    if (!track) return res.status(404).send("Spåret hittades inte.");

    const data = await dropboxRpc("files/get_temporary_link", { path: track.path });
    res.set("Cache-Control", "no-store");
    res.redirect(302, data.link);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.get("/api/status", (_req, res) => {
  res.json({
    configured: Boolean(
      process.env.DROPBOX_ACCESS_TOKEN ||
      (process.env.DROPBOX_APP_KEY &&
       process.env.DROPBOX_APP_SECRET &&
       process.env.DROPBOX_REFRESH_TOKEN)
    ),
    folder: DROPBOX_FOLDER || "/"
  });
});

app.listen(PORT, () => {
  console.log(`Dropbox-spelaren kör på http://localhost:${PORT}`);
});
