# AKIKO KOSHIYAMA — The universe within

Japanese / English artist portfolio with a password entry screen. Deployed using GitHub Pages from the main branch root.

The HTML content is encrypted with AES-256-GCM using a PBKDF2-derived key (SHA-256, 210,000 iterations). The password is not stored in plaintext. This is a lightweight viewing gate, not a private file store: images, CSS and JavaScript in this public repository remain publicly accessible, and password guessing is possible offline. Do not place confidential information here.

Enter the viewing password each time the site is opened or refreshed. No password is saved in browser storage. The decrypted page is rendered only after successful entry. HTTPS or localhost is required for the browser Web Crypto API.

`content.enc.json` contains the encrypted page. `gate.js` controls password entry. `app.js`, `style.css`, and `assets/` contain the portfolio interface and imagery. See CONTENT.md for work categories and progressive loading. To edit page copy, decrypt content locally with the known viewing password, modify it, and re-encrypt using a fresh random salt and IV; do not commit the plaintext page or the password.

Artwork and photography © their respective rights holders. Publication does not grant reuse rights.
