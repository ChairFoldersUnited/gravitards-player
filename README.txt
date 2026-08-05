THE GRAVITARDS VAULT V12 – UNIFIED COMMENTS

Your vault_comments table has already been prepared correctly.

Replace:
- index.html
- app.js
- style.css
- server.js

New:
- Ordinary comments and timestamp comments use vault_comments.
- Timestamp comments are shared between desktop, mobile and all visitors.
- Latest Activity shows the same shared notes on every device.
- Audio and video timestamp comments include an author name.
- The name is remembered locally after the first use.
- Add Note is mobile-friendly and scrolls into view above the fixed player.
- Existing ordinary comments remain separate because seconds is NULL.
- Timestamp comments have a numeric seconds value.

Important:
Old timestamp notes stored only in localStorage are not automatically uploaded.
Re-enter any important old notes once after V12 is deployed.

After deployment:
1. Replace all four files.
2. Wait for Render to finish.
3. Press Ctrl + Shift + R.
4. Add one timestamp note on desktop.
5. Open Latest Activity on mobile and verify the same note appears.
