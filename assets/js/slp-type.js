/* Prevents short last lines (a single word, or "Spring 2027." on its own line)
   in headings and paragraphs by joining the final words of each block with
   non-breaking spaces. Works in every browser; CSS text-wrap: pretty/balance
   only does this in some of them. */
(function () {
  var NBSP = String.fromCharCode(160);

  // How long the last unbreakable chunk should be depends on how many characters
  // fit on a line: at least two words and about a fifth of a line.
  // On a phone that is roughly two words; on a wide column, three or four.

  var blocks = document.querySelectorAll([
    '.hero__title', '.doc__title', '.doc__subtitle',
    '.hero__lead p', '.doc__lead p',
    '.doc__content h2', '.doc__content h3', '.doc__content p',
    '.doc__content li', '.doc__content dd',
    '.band__body h3', '.band__body p', '.band__body dd',
    '.ling-ex__gloss', '.ling-ex__caption'
  ].join(','));

  for (var i = 0; i < blocks.length; i++) bind(blocks[i]);

  function bind(el) {
    if (el.textContent.length < 30) return;

    var style = window.getComputedStyle(el);
    var perLine = el.clientWidth / (parseFloat(style.fontSize) * 0.47);
    if (!perLine || el.textContent.length < perLine * 0.9) return; // fits on one line
    var MIN = Math.max(8, Math.min(16, perLine * 0.2));
    var MAX = Math.max(12, Math.min(26, perLine * 0.38));

    // Last text node that has visible text
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var node, last = null;
    while ((node = walker.nextNode())) {
      if (/\S/.test(node.nodeValue)) last = node;
    }
    if (!last) return;

    var s = last.nodeValue;
    var end = s.replace(/\s+$/, '').length;
    var start = s.lastIndexOf(' ', end - 1) + 1; // start of the last word

    var words = 1;
    // Keep at least two words together, and grow the chunk up to MIN characters
    while (words < 2 || end - start < MIN) {
      var space = start - 1;
      if (space <= 0) break;
      var prev = s.lastIndexOf(' ', space - 1) + 1;
      if (words >= 2 && end - prev > MAX) break;
      s = s.slice(0, space) + NBSP + s.slice(space + 1);
      start = prev;
      words++;
    }
    last.nodeValue = s;
  }
})();
