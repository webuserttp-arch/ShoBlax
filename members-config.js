// Paste the deployed Apps Script /exec URL here (see shoblax-backend/INSTALL_STEPS.md). No secrets in this file.
window.SBX_API = window.SBX_API_OVERRIDE || 'https://script.google.com/macros/s/AKfycbzeNyYWTwUoncXNqtU0WPNUiAixbzBEFVKn0iHhIZXhw4kxNW8olHXkQO4C6VjYxpBF8A/exec';
// Bookshop.org affiliate ID (empty = plain product links). When set, book links use https://bookshop.org/a/<ID>/<ISBN13>.
window.BOOKSHOP_AFFILIATE_ID = '';
window.bookshopUrl = function (x) {
  var id = String(window.BOOKSHOP_AFFILIATE_ID || '').trim();
  if (!x.isbn) return '';
  if (!x.bookshop) return 'https://bookshop.org/search?keywords=' + x.isbn; // not found on Bookshop: ISBN search fallback
  return id ? 'https://bookshop.org/a/' + encodeURIComponent(id) + '/' + x.isbn : x.bookshop;
};
