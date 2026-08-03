# Dropbox MP3 Player

En färdig webbspelare som läser ljudfiler från en Dropbox-mapp.

## Funktioner

- Läser MP3, M4A, AAC, WAV, OGG och FLAC
- Söker i låttitlar och undermappar
- Automatisk nästa låt
- Shuffle och repeat
- Mobilanpassad
- Dropbox-nycklar hålls på serversidan
- Biblioteket cachas i fem minuter

## Snabbstart lokalt

1. Installera Node.js 18 eller senare.
2. Packa upp projektet och öppna en terminal i mappen.
3. Kör:

   npm install

4. Kopiera `.env.example` till `.env`.
5. Fyll i Dropbox-inställningarna.
6. Kör:

   npm start

7. Öppna `http://localhost:3000`.

## Dropbox-konfiguration

### Rekommenderad metod: refresh token

Skapa en app i Dropbox App Console.

- Välj **Scoped access**.
- Välj helst **App folder**, så att spelaren bara får tillgång till sin egen appmapp.
- Under **Permissions**, slå på `files.metadata.read` och `files.content.read`.
- Skapa OAuth-behörighet och hämta en refresh token.
- Fyll i:

  DROPBOX_APP_KEY
  DROPBOX_APP_SECRET
  DROPBOX_REFRESH_TOKEN
  DROPBOX_FOLDER

`DROPBOX_FOLDER=/Music` betyder mappen `Music` inom det område appen får läsa.
Använd tom sträng för roten.

### Snabbtest: tillfällig access token

Du kan tillfälligt fylla i `DROPBOX_ACCESS_TOKEN` i `.env`. En sådan token kan
löpa ut, så refresh token är bättre för en permanent hemsida.

## Publicering

Projektet kan köras på exempelvis Render, Railway, Fly.io eller en vanlig
Node-server. Lägg miljövariablerna i värdtjänstens inställningar, inte i Git.

Viktigt: ladda aldrig upp `.env` offentligt.

## Begränsningar

Dropbox är lagringen, inte en renodlad streamingtjänst. För ett privat arkiv
eller mindre publik fungerar lösningen bra. För stor offentlig trafik är en
objektlagring/CDN som Cloudflare R2, Backblaze B2 eller Amazon S3 lämpligare.
