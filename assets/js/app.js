(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = mediaReduce.matches;

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
    return Boolean(target && (target.matches('input, textarea, select') || target.isContentEditable));
  }
  function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  /* Toast ---------------------------------------------------------------- */
  function toast(message) {
    var region = qs('.toast-region');
    if (!region) return;
    var item = doc.createElement('div');
    item.className = 'toast';
    item.setAttribute('role', 'status');
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(function () {
      item.style.opacity = '0';
      item.style.transform = 'translateY(6px)';
      window.setTimeout(function () { item.remove(); }, 220);
    }, 2200);
  }

  /* Theme ---------------------------------------------------------------- */
  var themeButtons = qsa('[data-theme-toggle]');
  var themeMeta = qs('#theme-color-meta');

  function applyTheme(theme, persist) {
    var next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    if (themeMeta) themeMeta.setAttribute('content', next === 'dark' ? '#171816' : '#f3f0e8');
    themeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(next === 'dark'));
      button.setAttribute('aria-label', next === 'dark' ? '밝은 화면으로 전환' : '어두운 화면으로 전환');
    });
    if (persist) {
      try { localStorage.setItem('kkubuck-theme', next); } catch (error) { /* storage may be blocked */ }
    }
    doc.dispatchEvent(new CustomEvent('kkubuck:theme', { detail: { theme: next } }));
  }

  applyTheme(root.dataset.theme || 'light', false);
  themeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* Header ---------------------------------------------------------------- */
  var siteHeader = qs('[data-site-header]');
  var previousY = window.scrollY;
  var headerTicking = false;

  function updateHeader() {
    if (!siteHeader) return;
    var currentY = Math.max(window.scrollY, 0);
    var goingDown = currentY > previousY;
    siteHeader.classList.toggle('is-hidden', goingDown && currentY > 180 && !body.classList.contains('overlay-active'));
    previousY = currentY;
    headerTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!headerTicking) {
      headerTicking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  /* Overlay focus management --------------------------------------------- */
  var activeOverlay = null;
  var lastFocused = null;

  function getFocusable(container) {
    if (!container) return [];
    return qsa('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
      .filter(function (element) { return !element.hidden && element.offsetParent !== null; });
  }

  function activateOverlay(container, focusTarget) {
    activeOverlay = container;
    lastFocused = doc.activeElement;
    body.classList.add('overlay-active');
    if (siteHeader) siteHeader.classList.remove('is-hidden');
    window.setTimeout(function () {
      var target = focusTarget || getFocusable(container)[0];
      if (target) target.focus();
    }, reducedMotion ? 0 : 60);
  }

  function deactivateOverlay(container, restoreFocus) {
    if (activeOverlay === container) activeOverlay = null;
    if (!activeOverlay) body.classList.remove('overlay-active');
    if (restoreFocus !== false && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  doc.addEventListener('keydown', function (event) {
    if (!activeOverlay || event.key !== 'Tab') return;
    var focusable = getFocusable(activeOverlay);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault(); first.focus();
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
  var searchPromise = null;
  var selectedResult = -1;

  function loadSearchIndex() {
    if (searchPromise) return searchPromise;
    var path = body.getAttribute('data-search-index') || '/search.json';
    searchPromise = fetch(path, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('search index unavailable');
        return response.json();
      })
      .then(function (data) {
        searchIndex = Array.isArray(data) ? data : [];
        return searchIndex;
      })
      .catch(function () {
        searchIndex = [];
        return searchIndex;
      });
    return searchPromise;
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
      if (commandEmpty) commandEmpty.hidden = true;
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
    if (title === query) score += 260;
    if (title.indexOf(query) === 0) score += 150;
    if (title.indexOf(query) !== -1) score += 100;
    tokens.forEach(function (token) {
      if (title.indexOf(token) !== -1) score += 34;
      if (tags.indexOf(token) !== -1) score += 24;
      if (venue.indexOf(token) !== -1) score += 16;
      if (summary.indexOf(token) !== -1) score += 8;
    });
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
    title.textContent = entry.title || '제목 없음';
    var meta = doc.createElement('time');
    meta.textContent = [entry.type, entry.venue, entry.date].filter(Boolean).join(' · ');
    var summary = doc.createElement('p');
    summary.textContent = entry.summary || (entry.tags || []).join(' · ') || '미리보기가 없습니다.';
    result.append(title, meta, summary);
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
      .slice(0, 12)
      .map(function (item) { return item.entry; });

    matches.forEach(function (entry, index) { commandList.appendChild(createCommandResult(entry, index)); });
    commandQuick.hidden = true;
    commandResults.hidden = false;
    if (commandEmpty) commandEmpty.hidden = matches.length > 0;
    if (commandCount) commandCount.textContent = matches.length + '개';
  }

  function selectCommandResult(index) {
    var results = qsa('.command-result', commandList);
    if (!results.length) { selectedResult = -1; return; }
    selectedResult = ((index % results.length) + results.length) % results.length;
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
      if (event.key === 'ArrowDown') { event.preventDefault(); selectCommandResult(selectedResult + 1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); selectCommandResult(selectedResult < 0 ? results.length - 1 : selectedResult - 1); }
      if (event.key === 'Enter' && selectedResult >= 0 && results[selectedResult]) {
        event.preventDefault(); results[selectedResult].click();
      }
    });
  }

  doc.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (commandPalette && commandPalette.classList.contains('is-open')) closeCommand(true); else openCommand();
      return;
    }
    if (event.key === 'Escape') {
      if (commandPalette && commandPalette.classList.contains('is-open')) closeCommand(true);
      else if (mobileMenu && mobileMenu.classList.contains('is-open')) closeMobileMenu(true);
    }
  });

  /* Archive filters ------------------------------------------------------- */
  qsa('[data-archive-console]').forEach(function (consoleElement) {
    var container = consoleElement.parentElement;
    var list = qs('[data-filter-list]', container);
    if (!list) return;
    var items = qsa('[data-filter-item]', list);
    var search = qs('[data-filter-search]', consoleElement);
    var selects = qsa('[data-filter-select]', consoleElement);
    var resetButtons = qsa('[data-filter-reset]', container);
    var count = qs('[data-filter-count]', consoleElement);
    var empty = qs('[data-filter-empty]', list);

    selects.forEach(function (select) {
      var key = select.dataset.filterSelect;
      var values = [];
      items.forEach(function (item) {
        if (key === 'tag') {
          String(item.dataset.tags || '').split('|').forEach(function (value) { if (value) values.push(value); });
        } else if (item.dataset[key]) values.push(item.dataset[key]);
      });
      var labels = new Map();
      values.forEach(function (value) {
        var label = String(value || '').trim();
        var normalizedValue = normalize(label);
        if (normalizedValue && !labels.has(normalizedValue)) labels.set(normalizedValue, label);
      });
      Array.from(labels.entries()).sort(function (a, b) { return a[1].localeCompare(b[1], 'ko'); }).forEach(function (entry) {
        var option = doc.createElement('option');
        option.value = entry[0];
        option.textContent = entry[1];
        select.appendChild(option);
      });
    });

    function applyFilters() {
      var query = normalize(search && search.value);
      var visible = 0;
      items.forEach(function (item) {
        var haystack = normalize([item.dataset.title, item.dataset.summary, item.dataset.venue, item.dataset.type, item.dataset.year, String(item.dataset.tags || '').replace(/\|/g, ' ')].join(' '));
        var matches = !query || query.split(' ').every(function (token) { return haystack.indexOf(token) !== -1; });
        selects.forEach(function (select) {
          if (!matches || select.value === 'all') return;
          var key = select.dataset.filterSelect;
          if (key === 'tag') {
            var tags = String(item.dataset.tags || '').split('|').map(normalize);
            matches = tags.indexOf(normalize(select.value)) !== -1;
          } else matches = normalize(item.dataset[key]) === normalize(select.value);
        });
        item.hidden = !matches;
        if (matches) visible += 1;
      });
      if (count) count.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
    }

    if (search) {
      search.addEventListener('input', applyFilters);
      doc.addEventListener('keydown', function (event) {
        if (event.key === '/' && !isTypingTarget(event.target) && !body.classList.contains('overlay-active')) {
          event.preventDefault(); search.focus();
        }
      });
    }
    selects.forEach(function (select) { select.addEventListener('change', applyFilters); });
    resetButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        if (search) search.value = '';
        selects.forEach(function (select) { select.value = 'all'; });
        applyFilters();
        if (search) search.focus();
      });
    });
    applyFilters();
  });

  /* Tag search ------------------------------------------------------------ */
  var tagSearch = qs('[data-tag-search]');
  var tagGroups = qsa('[data-tag-group]');
  var tagEmpty = qs('[data-tag-empty]');
  if (tagSearch && tagGroups.length) {
    tagSearch.addEventListener('input', function () {
      var query = normalize(tagSearch.value);
      var visible = 0;
      tagGroups.forEach(function (group) {
        var matches = !query || normalize(group.dataset.tagName).indexOf(query) !== -1 || normalize(group.textContent).indexOf(query) !== -1;
        group.hidden = !matches;
        if (matches) visible += 1;
      });
      if (tagEmpty) tagEmpty.hidden = visible > 0;
    });
  }

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
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.05 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* Home pointer field ---------------------------------------------------- */
  qsa('[data-pointer-field]').forEach(function (field) {
    if (reducedMotion) return;
    var notes = qsa('.index-note', field);
    var cursor = qs('.hero-index__cursor', field);
    var frame = null;
    var pointer = { x: 0.5, y: 0.5, inside: false };

    function renderPointerField() {
      frame = null;
      var x = pointer.x * 100;
      var y = pointer.y * 100;
      field.style.setProperty('--pointer-x', x.toFixed(2) + '%');
      field.style.setProperty('--pointer-y', y.toFixed(2) + '%');
      if (cursor) cursor.style.opacity = pointer.inside ? '1' : '0';
      notes.forEach(function (note, index) {
        var depth = (index % 3 + 1) * 2.4;
        var dx = (pointer.x - 0.5) * depth;
        var dy = (pointer.y - 0.5) * depth;
        note.style.translate = dx.toFixed(2) + 'px ' + dy.toFixed(2) + 'px';
      });
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(renderPointerField); }
    field.addEventListener('pointermove', function (event) {
      var rect = field.getBoundingClientRect();
      pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      pointer.inside = true; schedule();
    });
    field.addEventListener('pointerleave', function () { pointer.x = 0.5; pointer.y = 0.5; pointer.inside = false; schedule(); });
  });

  /* Post reader ----------------------------------------------------------- */
  var postPage = qs('[data-post-page]');
  if (postPage) {
    var postContent = qs('[data-post-content]', postPage);
    var toc = qs('[data-post-toc]', postPage);
    var tocProgress = qs('[data-toc-progress]', postPage);
    var line = qs('[data-reading-progress-line]');
    var ring = qs('[data-reading-progress-ring]');
    var dock = qs('[data-scroll-top]');
    var headings = postContent ? qsa('h2, h3', postContent) : [];
    var tocLinks = [];
    var slugCounts = {};

    function slugify(text) {
      var base = normalize(text).replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'section';
      slugCounts[base] = (slugCounts[base] || 0) + 1;
      return slugCounts[base] > 1 ? base + '-' + slugCounts[base] : base;
    }

    if (toc && headings.length) {
      toc.replaceChildren();
      headings.forEach(function (heading) {
        if (!heading.id) heading.id = slugify(heading.textContent);
        var link = doc.createElement('a');
        link.href = '#' + encodeURIComponent(heading.id);
        link.dataset.level = heading.tagName === 'H3' ? '3' : '2';
        link.textContent = heading.textContent;
        link.addEventListener('click', function () {
          try { history.replaceState(null, '', '#' + heading.id); } catch (error) { /* no-op */ }
        });
        toc.appendChild(link);
        tocLinks.push(link);
      });
    } else if (toc) toc.innerHTML = '<p>목차가 없는 짧은 기록입니다.</p>';

    if (postContent) {
      qsa('table', postContent).forEach(function (table) {
        if (table.parentElement.classList.contains('table-wrap')) return;
        var wrapper = doc.createElement('div');
        wrapper.className = 'table-wrap';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
      qsa('a[href^="http"]', postContent).forEach(function (linkElement) {
        if (linkElement.hostname !== window.location.hostname) {
          linkElement.target = '_blank';
          linkElement.rel = 'noreferrer noopener';
        }
      });
    }

    function updateReader() {
      var documentHeight = doc.documentElement.scrollHeight - window.innerHeight;
      var ratio = documentHeight > 0 ? clamp(window.scrollY / documentHeight, 0, 1) : 0;
      var percent = Math.round(ratio * 100);
      if (line) line.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      if (ring) ring.style.strokeDashoffset = String(113.1 * (1 - ratio));
      if (dock) dock.classList.toggle('is-visible', window.scrollY > 520);
      if (tocProgress) tocProgress.textContent = percent + '%';

      if (headings.length && tocLinks.length) {
        var activeIndex = 0;
        headings.forEach(function (heading, index) {
          if (heading.getBoundingClientRect().top <= 150) activeIndex = index;
        });
        tocLinks.forEach(function (linkElement, index) { linkElement.classList.toggle('is-active', index === activeIndex); });
      }
    }
    updateReader();
    window.addEventListener('scroll', updateReader, { passive: true });
    window.addEventListener('resize', updateReader);
    if (dock) dock.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); });
  }

  /* Copy and share -------------------------------------------------------- */
  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    return new Promise(function (resolve, reject) {
      var area = doc.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed'; area.style.opacity = '0';
      body.appendChild(area); area.select();
      try { doc.execCommand('copy') ? resolve() : reject(new Error('copy failed')); } catch (error) { reject(error); }
      area.remove();
    });
  }
  qsa('[data-copy-url]').forEach(function (button) {
    button.addEventListener('click', function () {
      copyText(window.location.href).then(function () { toast('링크를 복사했습니다.'); }).catch(function () { toast('링크 복사에 실패했습니다.'); });
    });
  });
  qsa('[data-share-page]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: doc.title, url: window.location.href }).catch(function () { /* user cancelled */ });
      } else copyText(window.location.href).then(function () { toast('공유 링크를 복사했습니다.'); });
    });
  });

  /* Footer scroll to top -------------------------------------------------- */
  qsa('[data-scroll-top]').forEach(function (button) {
    if (button.classList.contains('reading-dock')) return;
    button.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); });
  });

  /* Quiet weather canvas -------------------------------------------------- */
  var canvas = qs('[data-weather-field]');
  if (canvas && !reducedMotion && canvas.getContext) {
    var context = canvas.getContext('2d');
    var width = 0;
    var height = 0;
    var dpr = 1;
    var drops = [];
    var ripples = [];
    var pointer = { x: -100, y: -100, active: false };
    var lastTime = performance.now();
    var lastFrame = 0;
    var frameInterval = 1000 / 30;
    var running = true;

    function themeColors() {
      return root.dataset.theme === 'dark'
        ? { rain: 'rgba(164,188,255,0.16)', ripple: 'rgba(255,137,108,0.18)' }
        : { rain: 'rgba(41,89,217,0.11)', ripple: 'rgba(234,95,61,0.14)' };
    }
    var colors = themeColors();
    doc.addEventListener('kkubuck:theme', function () { colors = themeColors(); });

    function resetDrop(drop, fromTop) {
      drop.x = Math.random() * width;
      drop.y = fromTop ? -20 - Math.random() * height * 0.3 : Math.random() * height;
      drop.length = 8 + Math.random() * 22;
      drop.speed = 34 + Math.random() * 58;
      drop.drift = -7 + Math.random() * 14;
      drop.alpha = 0.35 + Math.random() * 0.55;
    }
    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = width < 700 ? 24 : Math.min(56, Math.floor(width / 28));
      drops = Array.from({ length: target }, function () { var drop = {}; resetDrop(drop, false); return drop; });
    }
    function addRipple(x, y, strength) {
      if (ripples.length > 18) ripples.shift();
      ripples.push({ x: x, y: y, radius: 3, alpha: strength || 1, speed: 42 + Math.random() * 22 });
    }

    var rippleGate = 0;
    window.addEventListener('pointermove', function (event) {
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true;
      var now = performance.now();
      if (now - rippleGate > 110 && event.pointerType !== 'touch') { addRipple(pointer.x, pointer.y, 0.55); rippleGate = now; }
    }, { passive: true });
    window.addEventListener('pointerdown', function (event) { addRipple(event.clientX, event.clientY, 1.15); }, { passive: true });
    window.addEventListener('mouseout', function (event) { if (!event.relatedTarget) pointer.active = false; });

    function drawWeather(now) {
      if (!running) return;
      if (now - lastFrame < frameInterval) { window.requestAnimationFrame(drawWeather); return; }
      lastFrame = now;
      var delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.lineCap = 'round';

      drops.forEach(function (drop) {
        drop.y += drop.speed * delta;
        drop.x += drop.drift * delta;
        if (drop.y - drop.length > height || drop.x < -30 || drop.x > width + 30) resetDrop(drop, true);
        context.globalAlpha = drop.alpha;
        context.strokeStyle = colors.rain;
        context.beginPath();
        context.moveTo(drop.x, drop.y - drop.length);
        context.lineTo(drop.x + drop.drift * 0.08, drop.y);
        context.stroke();
      });

      context.globalAlpha = 1;
      ripples = ripples.filter(function (ripple) {
        ripple.radius += ripple.speed * delta;
        ripple.alpha -= 0.58 * delta;
        if (ripple.alpha <= 0) return false;
        context.globalAlpha = ripple.alpha;
        context.strokeStyle = colors.ripple;
        context.lineWidth = 1.1;
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        context.stroke();
        return true;
      });
      context.globalAlpha = 1;
      window.requestAnimationFrame(drawWeather);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    doc.addEventListener('visibilitychange', function () {
      running = !doc.hidden;
      if (running) { lastTime = performance.now(); lastFrame = 0; window.requestAnimationFrame(drawWeather); }
    });
    window.requestAnimationFrame(drawWeather);
  }
}());
