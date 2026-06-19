(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var iconPath = '/assets/icons.svg';

  function qs(selector, scope) {
    return (scope || doc).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFKC')
      .toLocaleLowerCase('ko-KR')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getFocusable(container) {
    return qsa('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
      .filter(function (element) { return !element.hidden && element.offsetParent !== null; });
  }

  function lockPage(locked) {
    body.classList.toggle('overlay-active', locked);
  }

  function createIcon(name) {
    var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var use = doc.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', iconPath + '#' + name);
    svg.appendChild(use);
    return svg;
  }

  function showToast(message) {
    var region = qs('.toast-region');
    if (!region) return;
    var toast = doc.createElement('div');
    toast.className = 'site-toast glass-surface';
    toast.textContent = message;
    region.appendChild(toast);
    window.requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    window.setTimeout(function () {
      toast.classList.remove('is-visible');
      window.setTimeout(function () { toast.remove(); }, 260);
    }, 2200);
  }

  function copyText(text, message) {
    var done = function () { showToast(message || 'Link copied.'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, callback) {
    var textarea = doc.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    body.appendChild(textarea);
    textarea.select();
    try { doc.execCommand('copy'); } catch (error) { /* no-op */ }
    textarea.remove();
    callback();
  }

  // Theme ------------------------------------------------------------------
  var themeButtons = qsa('[data-theme-toggle]');
  var themeMeta = qs('#theme-color-meta');

  function applyTheme(theme, persist) {
    var next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    themeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(next === 'light'));
      button.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
    if (themeMeta) themeMeta.setAttribute('content', next === 'light' ? '#edf4ef' : '#07100f');
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

  // Header -----------------------------------------------------------------
  var siteHeader = qs('[data-site-header]');
  function updateHeader() {
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Overlay focus management -----------------------------------------------
  var activeOverlay = null;
  var lastFocused = null;

  function activateOverlay(container, preferredFocus) {
    if (activeOverlay && activeOverlay !== container) {
      if (activeOverlay === orbitOverlay) closeOrbit(false);
      if (activeOverlay === commandPalette) closeCommand(false);
    }
    lastFocused = doc.activeElement;
    activeOverlay = container;
    lockPage(true);
    window.setTimeout(function () {
      var target = preferredFocus || getFocusable(container)[0];
      if (target) target.focus();
    }, reducedMotion ? 0 : 90);
  }

  function deactivateOverlay(container, restoreFocus) {
    if (activeOverlay === container) activeOverlay = null;
    lockPage(Boolean(activeOverlay));
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

  // Research Orbit ---------------------------------------------------------
  var orbitOverlay = qs('[data-orbit-overlay]');
  var orbitTrigger = qs('[data-orbit-open]');

  function openOrbit() {
    if (!orbitOverlay) return;
    orbitOverlay.classList.add('is-open');
    orbitOverlay.setAttribute('aria-hidden', 'false');
    if (orbitTrigger) orbitTrigger.setAttribute('aria-expanded', 'true');
    activateOverlay(orbitOverlay, qs('.orbit-stage__close', orbitOverlay));
  }

  function closeOrbit(restoreFocus) {
    if (!orbitOverlay) return;
    orbitOverlay.classList.remove('is-open');
    orbitOverlay.setAttribute('aria-hidden', 'true');
    if (orbitTrigger) orbitTrigger.setAttribute('aria-expanded', 'false');
    deactivateOverlay(orbitOverlay, restoreFocus);
  }

  if (orbitTrigger) orbitTrigger.addEventListener('click', openOrbit);
  qsa('[data-orbit-close]').forEach(function (button) {
    button.addEventListener('click', function () { closeOrbit(true); });
  });

  // Command palette --------------------------------------------------------
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
        searchLoaded = true;
        searchIndex = [];
        return searchIndex;
      });
  }

  function openCommand() {
    if (!commandPalette) return;
    commandPalette.classList.add('is-open');
    commandPalette.setAttribute('aria-hidden', 'false');
    activateOverlay(commandPalette, commandInput);
    loadSearchIndex().then(function () {
      if (commandInput && commandInput.value.trim()) renderCommandResults(commandInput.value);
    });
  }

  function closeCommand(restoreFocus) {
    if (!commandPalette) return;
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
    if (title === query) score += 240;
    if (title.indexOf(query) === 0) score += 150;
    if (title.indexOf(query) !== -1) score += 100;
    tokens.forEach(function (token) {
      if (title.indexOf(token) !== -1) score += 34;
      if (tags.indexOf(token) !== -1) score += 24;
      if (venue.indexOf(token) !== -1) score += 18;
      if (summary.indexOf(token) !== -1) score += 8;
    });
    score += Math.min(Number(entry.timestamp || 0) / 10000000000000, 5);
    return score;
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
      .slice(0, 12);

    commandQuick.hidden = true;
    commandResults.hidden = false;
    if (commandCount) commandCount.textContent = matches.length + (matches.length === 1 ? ' result' : ' results');
    if (commandEmpty) commandEmpty.hidden = matches.length > 0;

    matches.forEach(function (match, index) {
      var entry = match.entry;
      var anchor = doc.createElement('a');
      anchor.className = 'command-result';
      anchor.href = entry.url;
      anchor.setAttribute('role', 'option');
      anchor.setAttribute('aria-selected', 'false');
      anchor.dataset.resultIndex = String(index);

      var marker = doc.createElement('span');
      marker.className = 'command-result__marker';
      marker.appendChild(createIcon(entry.type === 'Paper' ? 'paper' : entry.type === 'Project' ? 'project' : 'notes'));

      var content = doc.createElement('span');
      content.className = 'command-result__content';
      var meta = doc.createElement('small');
      meta.textContent = [entry.type, entry.venue, entry.date].filter(Boolean).join(' · ');
      var title = doc.createElement('strong');
      title.textContent = entry.title;
      var summary = doc.createElement('span');
      summary.textContent = entry.summary || '';
      content.append(meta, title, summary);

      var arrow = doc.createElement('span');
      arrow.className = 'command-result__arrow';
      arrow.appendChild(createIcon('arrow'));
      anchor.append(marker, content, arrow);
      commandList.appendChild(anchor);
    });
  }

  function selectCommandResult(index) {
    var results = qsa('.command-result', commandList);
    if (!results.length) return;
    selectedResult = (index + results.length) % results.length;
    results.forEach(function (result, resultIndex) {
      var selected = resultIndex === selectedResult;
      result.classList.toggle('is-selected', selected);
      result.setAttribute('aria-selected', String(selected));
    });
    results[selectedResult].scrollIntoView({ block: 'nearest' });
  }

  qsa('[data-command-open]').forEach(function (button) { button.addEventListener('click', openCommand); });
  qsa('[data-command-close]').forEach(function (button) { button.addEventListener('click', function () { closeCommand(true); }); });
  if (commandInput) {
    commandInput.addEventListener('input', function () { renderCommandResults(commandInput.value); });
    commandInput.addEventListener('keydown', function (event) {
      var results = qsa('.command-result', commandList);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectCommandResult(selectedResult + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectCommandResult(selectedResult - 1);
      } else if (event.key === 'Enter' && selectedResult >= 0 && results[selectedResult]) {
        event.preventDefault();
        window.location.href = results[selectedResult].href;
      }
    });
  }

  doc.addEventListener('keydown', function (event) {
    var target = event.target;
    var inField = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (commandPalette && commandPalette.classList.contains('is-open')) closeCommand(true);
      else openCommand();
      return;
    }
    if (event.key === 'Escape') {
      if (commandPalette && commandPalette.classList.contains('is-open')) closeCommand(true);
      else if (orbitOverlay && orbitOverlay.classList.contains('is-open')) closeOrbit(true);
      return;
    }
    if (event.key === '/' && !inField) {
      var archiveSearch = qs('[data-filter-search]');
      if (archiveSearch) {
        event.preventDefault();
        archiveSearch.focus();
      }
    }
  });

  // Reveal -----------------------------------------------------------------
  var revealElements = qsa('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion) {
    revealElements.forEach(function (element) { element.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealElements.forEach(function (element, index) {
      element.style.setProperty('--reveal-delay', Math.min(index % 5, 4) * 55 + 'ms');
      revealObserver.observe(element);
    });
  }

  // Pointer interactions ---------------------------------------------------
  if (finePointer && !reducedMotion) {
    qsa('[data-tilt]').forEach(function (element) {
      var strength = Number(element.getAttribute('data-tilt-strength') || 3);
      element.addEventListener('pointermove', function (event) {
        var rect = element.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty('--tilt-x', (-y * strength).toFixed(2) + 'deg');
        element.style.setProperty('--tilt-y', (x * strength).toFixed(2) + 'deg');
        element.style.setProperty('--pointer-x', (x + 0.5) * 100 + '%');
        element.style.setProperty('--pointer-y', (y + 0.5) * 100 + '%');
      });
      element.addEventListener('pointerleave', function () {
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
      });
    });

    qsa('.magnetic').forEach(function (element) {
      element.addEventListener('pointermove', function (event) {
        var rect = element.getBoundingClientRect();
        var x = event.clientX - rect.left - rect.width / 2;
        var y = event.clientY - rect.top - rect.height / 2;
        element.style.setProperty('--magnetic-x', clamp(x * 0.08, -7, 7) + 'px');
        element.style.setProperty('--magnetic-y', clamp(y * 0.08, -5, 5) + 'px');
      });
      element.addEventListener('pointerleave', function () {
        element.style.setProperty('--magnetic-x', '0px');
        element.style.setProperty('--magnetic-y', '0px');
      });
    });
  }

  // Archive filters --------------------------------------------------------
  qsa('[data-archive-console]').forEach(function (consoleElement) {
    var page = consoleElement.closest('.archive-page') || doc;
    var list = qs('[data-filter-list]', page);
    if (!list) return;
    var items = qsa('[data-filter-item]', list);
    var search = qs('[data-filter-search]', consoleElement);
    var selects = qsa('[data-filter-select]', consoleElement);
    var count = qs('[data-filter-count]', consoleElement);
    var empty = qs('[data-filter-empty]', list);
    var resetButtons = qsa('[data-filter-reset]', page);

    selects.forEach(function (select) {
      var key = select.getAttribute('data-filter-select');
      var values = [];
      items.forEach(function (item) {
        var raw = item.dataset[key] || '';
        var parts = key === 'tag' ? raw.split('|') : [raw];
        parts.forEach(function (part) {
          var clean = part.trim();
          if (clean && values.indexOf(clean) === -1) values.push(clean);
        });
      });
      values.sort(function (a, b) {
        if (key === 'year') return Number(b) - Number(a);
        return a.localeCompare(b, 'ko');
      });
      values.forEach(function (value) {
        var option = doc.createElement('option');
        option.value = normalize(value);
        option.textContent = value;
        select.appendChild(option);
      });
    });

    function applyFilters() {
      var query = normalize(search ? search.value : '');
      var tokens = query.split(' ').filter(Boolean);
      var active = {};
      selects.forEach(function (select) { active[select.getAttribute('data-filter-select')] = select.value; });
      var visible = 0;

      items.forEach(function (item) {
        var haystack = normalize([
          item.dataset.title,
          item.dataset.summary,
          item.dataset.venue,
          item.dataset.type,
          item.dataset.year,
          item.dataset.tags
        ].join(' '));
        var matchesQuery = tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
        var matchesSelects = Object.keys(active).every(function (key) {
          if (!active[key] || active[key] === 'all') return true;
          if (key === 'tag') {
            return (item.dataset.tags || '').split('|').map(normalize).indexOf(active[key]) !== -1;
          }
          return normalize(item.dataset[key]) === active[key];
        });
        var matches = matchesQuery && matchesSelects;
        item.hidden = !matches;
        item.classList.toggle('is-filtered-out', !matches);
        if (matches) visible += 1;
      });

      if (count) count.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
    }

    if (search) search.addEventListener('input', applyFilters);
    selects.forEach(function (select) { select.addEventListener('change', applyFilters); });
    resetButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        if (search) search.value = '';
        selects.forEach(function (select) { select.value = 'all'; });
        applyFilters();
        if (search) search.focus();
      });
    });
  });

  // Tags -------------------------------------------------------------------
  var constellation = qs('[data-tag-constellation]');
  if (constellation) {
    var tagNodes = qsa('[data-tag-node]', constellation);
    function positionTagNodes() {
      if (window.innerWidth < 760) {
        constellation.classList.remove('is-enhanced');
        tagNodes.forEach(function (node) {
          node.style.removeProperty('--node-x');
          node.style.removeProperty('--node-y');
          node.style.removeProperty('--node-scale');
        });
        return;
      }
      constellation.classList.add('is-enhanced');
      var rect = constellation.getBoundingClientRect();
      var radiusX = Math.min(rect.width * 0.39, 480);
      var radiusY = Math.min(rect.height * 0.34, 245);
      tagNodes.forEach(function (node, index) {
        var angle = (index / tagNodes.length) * Math.PI * 2 - Math.PI / 2;
        var band = index % 3 === 0 ? 0.72 : index % 3 === 1 ? 0.9 : 1;
        var x = Math.cos(angle) * radiusX * band;
        var y = Math.sin(angle) * radiusY * band;
        var weight = Number(node.getAttribute('data-weight') || 1);
        node.style.setProperty('--node-x', x.toFixed(1) + 'px');
        node.style.setProperty('--node-y', y.toFixed(1) + 'px');
        node.style.setProperty('--node-scale', String(clamp(0.86 + weight * 0.025, 0.9, 1.18)));
      });
    }
    positionTagNodes();
    window.addEventListener('resize', positionTagNodes, { passive: true });
  }

  var tagSearch = qs('[data-tag-search]');
  if (tagSearch) {
    var tagGroups = qsa('[data-tag-group]');
    var tagEmpty = qs('[data-tag-empty]');
    tagSearch.addEventListener('input', function () {
      var query = normalize(tagSearch.value);
      var visible = 0;
      tagGroups.forEach(function (group) {
        var matches = normalize(group.getAttribute('data-tag-name')).indexOf(query) !== -1;
        group.hidden = !matches;
        if (matches) visible += 1;
      });
      if (tagEmpty) tagEmpty.hidden = visible !== 0;
    });
  }

  // Post reading tools -----------------------------------------------------
  var postPage = qs('[data-post-page]');
  if (postPage) {
    var progressLine = qs('[data-reading-progress-line]');
    var progressRing = qs('[data-reading-progress-ring]');
    var tocProgress = qs('[data-toc-progress]');
    var circumference = 2 * Math.PI * 18;
    if (progressRing) {
      progressRing.style.strokeDasharray = String(circumference);
      progressRing.style.strokeDashoffset = String(circumference);
    }

    function updateReadingProgress() {
      var scrollable = doc.documentElement.scrollHeight - window.innerHeight;
      var progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
      if (progressLine) progressLine.style.transform = 'scaleX(' + progress + ')';
      if (progressRing) progressRing.style.strokeDashoffset = String(circumference * (1 - progress));
      if (tocProgress) tocProgress.textContent = Math.round(progress * 100).toString().padStart(2, '0') + '%';
    }
    updateReadingProgress();
    window.addEventListener('scroll', updateReadingProgress, { passive: true });

    var postContent = qs('[data-post-content]');
    var toc = qs('[data-post-toc]');
    if (postContent && toc) {
      qsa('img', postContent).forEach(function (image, index) {
        if (!image.hasAttribute('loading')) image.loading = index === 0 ? 'eager' : 'lazy';
        image.decoding = 'async';
      });
      qsa('a[href^="http"]', postContent).forEach(function (link) {
        if (link.hostname !== window.location.hostname) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      });
      qsa('table', postContent).forEach(function (table) {
        if (table.parentElement && table.parentElement.classList.contains('table-scroll')) return;
        var wrapper = doc.createElement('div');
        wrapper.className = 'table-scroll';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });

      var headings = qsa('h2, h3', postContent);
      toc.replaceChildren();
      if (!headings.length) {
        var shortNote = doc.createElement('p');
        shortNote.className = 'post-toc__empty';
        shortNote.textContent = 'Short note without an outline.';
        toc.appendChild(shortNote);
      } else {
        var tocList = doc.createElement('ol');
        var seenIds = {};
        headings.forEach(function (heading, index) {
          var baseId = heading.id || heading.textContent
            .normalize('NFKC')
            .toLocaleLowerCase('ko-KR')
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .trim()
            .replace(/\s+/g, '-');
          if (!baseId) baseId = 'section-' + (index + 1);
          var uniqueId = baseId;
          var count = 2;
          while (seenIds[uniqueId] || doc.getElementById(uniqueId)) {
            if (heading.id === uniqueId && !seenIds[uniqueId]) break;
            uniqueId = baseId + '-' + count;
            count += 1;
          }
          seenIds[uniqueId] = true;
          heading.id = uniqueId;
          heading.classList.add('anchored-heading');

          var anchorButton = doc.createElement('button');
          anchorButton.type = 'button';
          anchorButton.className = 'heading-anchor';
          anchorButton.setAttribute('aria-label', 'Copy section link: ' + heading.textContent.trim());
          anchorButton.textContent = '#';
          anchorButton.addEventListener('click', function () {
            var url = window.location.origin + window.location.pathname + '#' + uniqueId;
            copyText(url, 'Section link copied.');
            history.replaceState(null, '', '#' + uniqueId);
          });
          heading.appendChild(anchorButton);

          var item = doc.createElement('li');
          item.className = heading.tagName === 'H3' ? 'toc-level-3' : 'toc-level-2';
          var link = doc.createElement('a');
          link.href = '#' + uniqueId;
          link.textContent = heading.childNodes[0].textContent.trim();
          link.dataset.tocTarget = uniqueId;
          item.appendChild(link);
          tocList.appendChild(item);
        });
        toc.appendChild(tocList);

        if ('IntersectionObserver' in window) {
          var tocLinks = qsa('[data-toc-target]', toc);
          var headingObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              tocLinks.forEach(function (link) {
                link.classList.toggle('is-active', link.dataset.tocTarget === entry.target.id);
              });
            });
          }, { rootMargin: '-18% 0px -72% 0px', threshold: 0 });
          headings.forEach(function (heading) { headingObserver.observe(heading); });
        }
      }
    }
  }

  // Shared actions ---------------------------------------------------------
  qsa('[data-copy-url]').forEach(function (button) {
    button.addEventListener('click', function () { copyText(window.location.href.split('#')[0]); });
  });

  qsa('[data-share-page]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: doc.title, text: qs('meta[name="description"]') ? qs('meta[name="description"]').content : '', url: window.location.href })
          .catch(function () { /* user cancellation */ });
      } else {
        copyText(window.location.href.split('#')[0], 'Share link copied.');
      }
    });
  });

  qsa('[data-scroll-top]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
}());
