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

app.disable("x-powered-by");
app.use(express.json());

let libraryCache = {
  expiresAt: 0,
  tracks: []
};

function normalizeFolder(folder) {
  if (!folder || folder === "/") {
    return "";
  }

  return "/" + folder.replace(/^\/+|\/+$/g, "");
}

function getAccessToken() {
  const token = process.env.DROPBOX_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "DROPBOX_ACCESS_TOKEN saknas i Render Environment Variables."
    );
  }

  return token;
}

async function dropboxRpc(endpoint, body) {
  const accessToken = getAccessToken();

  const response = await fetch(
    `https://api.dropboxapi.com/2/${endpoint}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Dropbox API-fel ${response.status}: ${details}`);
  }

  return response.json();
}

async function dropboxDownload(pathValue) {
  const accessToken = getAccessToken();

  return fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({ path: pathValue })
    }
  });
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
    result = await dropboxRpc("files/list_folder/continue", {
      cursor: result.cursor
    });

    entries.push(...result.entries);
  }

  const tracks = entries
    .filter(isAudioFile)
    .map((entry) => {
      const pathDisplay = entry.path_display || entry.path_lower;
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

app.get("/api/status", (_req, res) => {
  res.json({
    running: true,
    dropboxConfigured: Boolean(process.env.DROPBOX_ACCESS_TOKEN),
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
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/refresh", async (_req, res) => {
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

    if (!track) {
      return res.status(404).send("Spåret hittades inte.");
    }

    const data = await dropboxRpc("files/get_temporary_link", {
      path: track.path
    });

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
    const track = tracks.find((item) => item.id === req.params.id);

    if (!track) {
      return res.status(404).send("Inspelningen hittades inte.");
    }

    const response = await dropboxDownload(track.path);

    if (!response.ok || !response.body) {
      const details = await response.text();
      throw new Error(
        `Dropbox-nedladdning misslyckades (${response.status}): ${details}`
      );
    }

    const filename = safeDownloadFilename(track.name);

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
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`The Gravitards Vault kör på port ${PORT}`);
  console.log(`Dropbox-mapp: ${DROPBOX_FOLDER || "/"}`);
});
