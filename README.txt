THE GRAVITARDS VAULT V9.1.2 – RESPONSIVE SIDEBAR FIX

Replace:
- style.css
- app.js

index.html is included, but only needs replacing if your current file lacks
the viewport meta tag.

Fixed:
- The page no longer grows wider than the browser window.
- The Vault player keeps the available main-column width.
- The SoundCloud sidebar is limited to 360 px on wide screens.
- On smaller screens the SoundCloud panel moves below the Audio Archive.
- Images, players, controls and forms cannot force horizontal scrolling.
- Includes the V9.1.1 null-error fix.

After deploy:
1. Press Ctrl + Shift + R.
2. Check the Audio Archive at normal browser zoom.
3. The page should no longer require horizontal scrolling.
