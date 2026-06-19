(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function qs(selector, context) { return (context || doc).querySelector(selector); }
  function qsa(selector, context) { return Array.prototype.slice.call((context || doc).querySelectorAll(selector)); }
  function normalize(value) {
    return String(value || '')
      .toLocaleLowerCase('ko-KR')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function isTypingTarget(target) {
    return target && (target.matches('input, textarea, select') || target.isContentEditable);
  }

  /* Toast ---------------------------------------------------------------- */
  function toast(message) {
    var region = qs('.toast-region');
    if (!region) return;
    var item = doc.createElement('div');
    item.className = 'toast';
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(function () {
      item.classList.add('is-leaving');
      window.setTimeout(function () { item.remove(); }, 220);
    }, 2100);
  }

  /* Theme ---------------------------------------------------------------- */
  var themeButtons = qsa('[data-theme-toggle]');
  var themeMeta = qs('#theme-color-meta');

  function applyTheme(theme, persist) {
    var next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (themeMeta) themeMeta.setAttribute('content', next === 'light' ? '#eef4fc' : '#07101f');
    themeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(next === 'light'));
      button.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
    if (persist) {
      try { localStorage.setItem('kkubuck-theme', next); } catch (error) { /* no-op */ }
    }
  }

  applyTheme(root.dataset.theme || 'dark', false);
  themeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    });
  });

  /* Header ---------------------------------------------------------------- */
  var siteHeader = qs('[data-site-header]');
  function updateHeader() {
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 14);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Overlay focus management --------------------------------------------- */
  var activeOverlay = null;
  var lastFocused = null;

  function getFocusable(container) {
    return qsa('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
      .filter(function (element) { return !element.hidden && element.offsetParent !== null; });
  }

  function activateOverlay(container, focusTarget) {
    activeOverlay = container;
    lastFocused = doc.activeElement;
    body.classList.add('overlay-active');
    window.setTimeout(function () {
      var target = focusTarget || getFocusable(container)[0];
      if (target) target.focus();
    }, reducedMotion ? 0 : 70);
  }

  function deactivateOverlay(container, restoreFocus) {
    if (activeOverlay === container) activeOverlay = null;
    if (!activeOverlay) body.classList.remove('overlay-active');
    if (restoreFocus !== false && lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  doc.addEventListener('keydown', function (event) {
    if (!activeOverlay || event.key !== 'Tab') return;
    var focusable = getFocusable(activeOverlay);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* Mobile navigation ----------------------------------------------------- */
  var mobileMenu = qs('[data-mobile-menu]');
  var mobileMenuButton = qs('[data-mobile-menu-open]');

  function openMobileMenu() {
    if (!mobileMenu) return;
    closeCommand(false);
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'true');
    activateOverlay(mobileMenu, qs('[data-mobile-menu-close]', mobileMenu));
  }

  function closeMobileMenu(restoreFocus) {
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
    deactivateOverlay(mobileMenu, restoreFocus);
  }

  if (mobileMenuButton) mobileMenuButton.addEventListener('click', openMobileMenu);
  qsa('[data-mobile-menu-close]').forEach(function (button) {
    button.addEventListener('click', function () { closeMobileMenu(true); });
  });
  qsa('nav a', mobileMenu).forEach(function (link) {
    link.addEventListener('click', function () { closeMobileMenu(false); });
  });

  /* Command palette ------------------------------------------------------- */
  var commandPalette = qs('[data-command-palette]');
  var commandInput = qs('[data-command-input]');
  var commandList = qs('[data-command-list]');
  var commandResults = qs('[data-command-results]');
  var commandQuick = qs('[data-command-quick]');
  var commandEmpty = qs('[data-command-empty]');
  var commandCount = qs('[data-command-count]');
  var searchIndex = [];
  var searchLoaded = false;
  var selectedResult = -1;

  function loadSearchIndex() {
    if (searchLoaded) return Promise.resolve(searchIndex);
    var path = body.getAttribute('data-search-index') || '/search.json';
    return fetch(path, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      })
      .then(function (data) {
        searchIndex = Array.isArray(data) ? data : [];
        searchLoaded = true;
        return searchIndex;
      })
      .catch(function () {
        searchIndex = [];
        searchLoaded = true;
        return searchIndex;
      });
  }

  function openCommand() {
    if (!commandPalette) return;
    closeMobileMenu(false);
    commandPalette.classList.add('is-open');
    commandPalette.setAttribute('aria-hidden', 'false');
    activateOverlay(commandPalette, commandInput);
    loadSearchIndex().then(function () {
      if (commandInput && commandInput.value.trim()) renderCommandResults(commandInput.value);
    });
  }

  function closeCommand(restoreFocus) {
    if (!commandPalette || !commandPalette.classList.contains('is-open')) return;
    commandPalette.classList.remove('is-open');
    commandPalette.setAttribute('aria-hidden', 'true');
    deactivateOverlay(commandPalette, restoreFocus);
    selectedResult = -1;
    window.setTimeout(function () {
      if (commandInput) commandInput.value = '';
      if (commandQuick) commandQuick.hidden = false;
      if (commandResults) commandResults.hidden = true;
      if (commandList) commandList.replaceChildren();
    }, reducedMotion ? 0 : 180);
  }

  function scoreEntry(entry, query, tokens) {
    var title = normalize(entry.title);
    var summary = normalize(entry.summary);
    var venue = normalize(entry.venue);
    var tags = normalize((entry.tags || []).join(' '));
    var type = normalize(entry.type);
    var combined = [title, summary, venue, tags, type].join(' ');
    if (!tokens.every(function (token) { return combined.indexOf(token) !== -1; })) return -1;
    var score = 0;
    if (title === query) score += 220;
    if (title.indexOf(query) === 0) score += 130;
    if (title.indexOf(query) !== -1) score += 90;
    tokens.forEach(function (token) {
      if (title.indexOf(token) !== -1) score += 32;
      if (tags.indexOf(token) !== -1) score += 22;
      if (venue.indexOf(token) !== -1) score += 16;
      if (summary.indexOf(token) !== -1) score += 7;
    });
    score += Math.min(Number(entry.timestamp || 0) / 10000000000000, 4);
    return score;
  }

  function createCommandResult(entry, index) {
    var result = doc.createElement('a');
    result.className = 'command-result';
    result.href = entry.url;
    result.setAttribute('role', 'option');
    result.setAttribute('aria-selected', 'false');
    result.dataset.resultIndex = String(index);

    var title = doc.createElement('strong');
    title.textContent = entry.title || 'Untitled';
    var date = doc.createElement('time');
    date.textContent = [entry.type, entry.date].filter(Boolean).join(' · ');
    var summary = doc.createElement('p');
    summary.textContent = entry.summary || (entry.tags || []).join(' · ') || 'No preview available';

    result.appendChild(title);
    result.appendChild(date);
    result.appendChild(summary);
    result.addEventListener('mouseenter', function () { selectCommandResult(index); });
    return result;
  }

  function renderCommandResults(rawQuery) {
    if (!commandList || !commandResults || !commandQuick) return;
    var query = normalize(rawQuery);
    commandList.replaceChildren();
    selectedResult = -1;

    if (!query) {
      commandQuick.hidden = false;
      commandResults.hidden = true;
      return;
    }

    var tokens = query.split(' ').filter(Boolean);
    var matches = searchIndex
      .map(function (entry) { return { entry: entry, score: scoreEntry(entry, query, tokens) }; })
      .filter(function (item) { return item.score >= 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 10)
      .map(function (item) { return item.entry; });

    matches.forEach(function (entry, index) { commandList.appendChild(createCommandResult(entry, index)); });
    commandQuick.hidden = true;
    commandResults.hidden = false;
    if (commandCount) commandCount.textContent = matches.length + (matches.length === 1 ? ' result' : ' results');
    if (commandEmpty) commandEmpty.hidden = matches.length > 0;
    if (matches.length) selectCommandResult(0);
  }

  function selectCommandResult(index) {
    var results = qsa('.command-result', commandList);
    if (!results.length) { selectedResult = -1; return; }
    selectedResult = Math.max(0, Math.min(index, results.length - 1));
    results.forEach(function (result, resultIndex) {
      var active = resultIndex === selectedResult;
      result.classList.toggle('is-selected', active);
      result.setAttribute('aria-selected', String(active));
      if (active) result.scrollIntoView({ block: 'nearest' });
    });
  }

  qsa('[data-command-open]').forEach(function (button) { button.addEventListener('click', openCommand); });
  qsa('[data-command-close]').forEach(function (button) { button.addEventListener('click', function () { closeCommand(true); }); });
  if (commandInput) {
    commandInput.addEventListener('input', function () {
      loadSearchIndex().then(function () { renderCommandResults(commandInput.value); });
    });
    commandInput.addEventListener('keydown', function (event) {
      var results = qsa('.command-result', commandList);
      if (event.key === 'ArrowDown' && results.length) {
        event.preventDefault();
        selectCommandResult(selectedResult + 1);
      } else if (event.key === 'ArrowUp' && results.length) {
        event.preventDefault();
        selectCommandResult(selectedResult - 1);
      } else if (event.key === 'Enter' && selectedResult >= 0 && results[selectedResult]) {
        event.preventDefault();
        results[selectedResult].click();
      }
    });
  }

  doc.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
      event.preventDefault();
      if (commandPalette && commandPalette.classList.contains('is-open')) closeCommand(true);
      else openCommand();
      return;
    }
    if (event.key === 'Escape') {
      if (commandPalette && commandPalette.classList.contains('is-open')) closeCommand(true);
      else if (mobileMenu && mobileMenu.classList.contains('is-open')) closeMobileMenu(true);
    }
  });

  /* Reveal ---------------------------------------------------------------- */
  var revealItems = qsa('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index % 4, 3) * 45 + 'ms';
      revealObserver.observe(item);
    });
  }

  /* Subtle tilt ----------------------------------------------------------- */
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    qsa('[data-tilt]').forEach(function (card) {
      var strength = Number(card.getAttribute('data-tilt-strength') || 1.2);
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * strength) + 'deg) rotateY(' + (x * strength) + 'deg) translateY(-2px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* Research orbit pointer response -------------------------------------- */
  var orbitVisual = qs('[data-orbit-visual]');
  if (orbitVisual && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    orbitVisual.addEventListener('pointermove', function (event) {
      var rect = orbitVisual.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      orbitVisual.style.setProperty('--orbit-x', (x * 5).toFixed(2) + 'deg');
      orbitVisual.style.setProperty('--orbit-y', (-y * 5).toFixed(2) + 'deg');
    });
    orbitVisual.addEventListener('pointerleave', function () {
      orbitVisual.style.setProperty('--orbit-x', '0deg');
      orbitVisual.style.setProperty('--orbit-y', '0deg');
    });
  }

  /* Archive filtering ----------------------------------------------------- */
  qsa('[data-archive-console]').forEach(function (consoleElement) {
    var list = consoleElement.parentElement.querySelector('[data-filter-list]');
    if (!list) return;
    var items = qsa('[data-filter-item]', list);
    var search = qs('[data-filter-search]', consoleElement);
    var selects = qsa('[data-filter-select]', consoleElement);
    var count = qs('[data-filter-count]', consoleElement);
    var empty = qs('[data-filter-empty]', list);
    var resets = qsa('[data-filter-reset]', consoleElement.parentElement);

    function valuesFor(key) {
      var values = [];
      items.forEach(function (item) {
        var raw = item.dataset[key] || '';
        var parts = key === 'tags' ? raw.split('|') : [raw];
        parts.forEach(function (value) {
          var cleaned = value.trim();
          if (cleaned && values.indexOf(cleaned) === -1) values.push(cleaned);
        });
      });
      return values;
    }

    selects.forEach(function (select) {
      var key = select.getAttribute('data-filter-select');
      var sourceKey = key === 'tag' ? 'tags' : key;
      var values = valuesFor(sourceKey);
      values.sort(function (a, b) {
        if (key === 'year') return Number(b) - Number(a);
        return a.localeCompare(b, 'ko-KR', { sensitivity: 'base' });
      });
      values.forEach(function (value) {
        var option = doc.createElement('option');
        option.value = normalize(value);
        option.textContent = value;
        select.appendChild(option);
      });
      select.addEventListener('change', filterItems);
    });

    function filterItems() {
      var query = normalize(search ? search.value : '');
      var visible = 0;
      items.forEach(function (item) {
        var haystack = normalize([
          item.dataset.title,
          item.dataset.summary,
          item.dataset.venue,
          item.dataset.year,
          item.dataset.type,
          (item.dataset.tags || '').replace(/\|/g, ' ')
        ].join(' '));
        var matchesSearch = !query || query.split(' ').every(function (token) { return haystack.indexOf(token) !== -1; });
        var matchesSelects = selects.every(function (select) {
          var chosen = select.value;
          if (!chosen || chosen === 'all') return true;
          var key = select.getAttribute('data-filter-select');
          var itemValue = key === 'tag' ? item.dataset.tags : item.dataset[key];
          if (key === 'tag') return (itemValue || '').split('|').map(normalize).indexOf(chosen) !== -1;
          return normalize(itemValue) === chosen;
        });
        var show = matchesSearch && matchesSelects;
        item.hidden = !show;
        if (show) visible += 1;
      });
      if (count) count.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
    }

    if (search) {
      search.addEventListener('input', filterItems);
      search.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          search.value = '';
          filterItems();
          search.blur();
        }
      });
    }

    resets.forEach(function (button) {
      button.addEventListener('click', function () {
        if (search) search.value = '';
        selects.forEach(function (select) { select.value = 'all'; });
        filterItems();
        if (search) search.focus();
      });
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target) && search) {
        event.preventDefault();
        search.focus();
      }
    });
    filterItems();
  });

  /* Tag filtering --------------------------------------------------------- */
  var tagSearch = qs('[data-tag-search]');
  var tagGroups = qsa('[data-tag-group]');
  var tagEmpty = qs('[data-tag-empty]');
  if (tagSearch && tagGroups.length) {
    tagSearch.addEventListener('input', function () {
      var query = normalize(tagSearch.value);
      var visible = 0;
      tagGroups.forEach(function (group) {
        var show = !query || normalize(group.dataset.tagName).indexOf(query) !== -1 || normalize(group.textContent).indexOf(query) !== -1;
        group.hidden = !show;
        if (show) visible += 1;
      });
      if (tagEmpty) tagEmpty.hidden = visible !== 0;
    });
  }

  /* Post outline and progress -------------------------------------------- */
  var postContent = qs('[data-post-content]');
  var postToc = qs('[data-post-toc]');
  var tocProgress = qs('[data-toc-progress]');
  var progressLine = qs('[data-reading-progress-line]');
  var progressRing = qs('[data-reading-progress-ring]');
  var readingDock = qs('.reading-dock');
  var headingLinks = [];
  var headings = [];

  function uniqueHeadingId(text, index, used) {
    var base = normalize(text)
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9가-힣_-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section-' + (index + 1);
    var candidate = base;
    var suffix = 2;
    while (used[candidate]) { candidate = base + '-' + suffix; suffix += 1; }
    used[candidate] = true;
    return candidate;
  }

  if (postContent && postToc) {
    headings = qsa('h2, h3', postContent);
    var usedIds = {};
    postToc.replaceChildren();
    headings.forEach(function (heading, index) {
      if (!heading.id) heading.id = uniqueHeadingId(heading.textContent, index, usedIds);
      else usedIds[heading.id] = true;
      var link = doc.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      link.textContent = heading.textContent.trim();
      link.dataset.level = heading.tagName === 'H3' ? '3' : '2';
      link.addEventListener('click', function () {
        window.setTimeout(updateReadingProgress, 60);
      });
      postToc.appendChild(link);
      headingLinks.push(link);
    });
    if (!headings.length) {
      var emptyOutline = doc.createElement('p');
      emptyOutline.textContent = 'No table of contents for this post.';
      postToc.appendChild(emptyOutline);
    }

    if ('IntersectionObserver' in window && headings.length) {
      var visibleHeadings = new Map();
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visibleHeadings.set(entry.target, entry.boundingClientRect.top);
          else visibleHeadings.delete(entry.target);
        });
        var active = null;
        if (visibleHeadings.size) {
          active = Array.from(visibleHeadings.entries()).sort(function (a, b) { return a[1] - b[1]; })[0][0];
        } else {
          for (var i = headings.length - 1; i >= 0; i -= 1) {
            if (headings[i].getBoundingClientRect().top < 150) { active = headings[i]; break; }
          }
        }
        headingLinks.forEach(function (link, index) { link.classList.toggle('is-active', headings[index] === active); });
      }, { rootMargin: '-110px 0px -65% 0px', threshold: [0, 1] });
      headings.forEach(function (heading) { tocObserver.observe(heading); });
    }
  }

  function updateReadingProgress() {
    var documentHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight) - window.innerHeight;
    var progress = documentHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / documentHeight)) : 0;
    var percent = Math.round(progress * 100);
    if (progressLine) progressLine.style.width = percent + '%';
    if (progressRing) progressRing.style.strokeDashoffset = String(113.1 * (1 - progress));
    if (tocProgress) tocProgress.textContent = percent + '%';
    if (readingDock) readingDock.classList.toggle('is-visible', window.scrollY > 500);
  }
  updateReadingProgress();
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('resize', updateReadingProgress);

  /* Share / copy ---------------------------------------------------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var input = doc.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      doc.body.appendChild(input);
      input.select();
      try {
        doc.execCommand('copy');
        input.remove();
        resolve();
      } catch (error) {
        input.remove();
        reject(error);
      }
    });
  }

  qsa('[data-copy-url]').forEach(function (button) {
    button.addEventListener('click', function () {
      copyText(window.location.href)
        .then(function () { toast('Link copied.'); })
        .catch(function () { toast('Could not copy link.'); });
    });
  });

  qsa('[data-share-page]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: doc.title, url: window.location.href }).catch(function () { /* cancelled */ });
      } else {
        copyText(window.location.href)
          .then(function () { toast('Share link copied.'); })
          .catch(function () { toast('Could not copy share link.'); });
      }
    });
  });

  /* Scroll to top --------------------------------------------------------- */
  qsa('[data-scroll-top]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
}());
