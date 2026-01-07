SkyHigh — README

This project lists jets and allows users to view details and make reservations.

What's new
- Admin panel: open the admin UI by triple-clicking anywhere on the page. The admin panel shows reservations stored locally and allows deleting or clearing them.
- Details modal: click a jet card to open a details modal with specs and a reservation form.
- Local reservations: reservations are stored in the browser's localStorage under the key `skyhigh_reservations`.
- Jets data file: sample jets are provided in assets/jets.json. Edit or extend this file to change the available jets.

Usage
1. Open index.html in a static server (or view in the browser).
2. Click a jet card to see details and make a reservation — reservations are saved locally.
3. Triple-click anywhere on the page to open the admin panel and manage reservations.

Notes
- This implementation stores reservations only in localStorage for demo purposes. For production, integrate a backend for persistent storage and authentication for admin features.
- The admin panel is intentionally lightweight; secure it before exposing to real users.
