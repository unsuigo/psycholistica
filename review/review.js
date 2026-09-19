(() => {
    'use strict';

    if (window.__psycholisticaClientReview) return;
    window.__psycholisticaClientReview = true;

    const PROJECT = 'PSYCHOLISTICA';
    const REVIEW_VERSION = 1;
    const REVIEW_BUILD = 'premium-client-edit-2026-09-18-r2';
    const STORAGE_KEY = `psycholistica.client-review.v1.${REVIEW_BUILD}`;
    const WINDOW_PREFIX = `PSYCHOLISTICA_REVIEW_V1_${REVIEW_BUILD}:`;
    const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'LI', 'A', 'BUTTON', 'BLOCKQUOTE', 'CITE', 'EM', 'STRONG', 'SPAN', 'ADDRESS', 'DT', 'DD']);
    const CANDIDATE_SELECTOR = [
        'header .brand',
        'header nav a',
        'header .header-cta',
        'main section',
        'main article',
        'main h1',
        'main h2',
        'main h3',
        'main h4',
        'main p',
        'main li',
        'main a',
        'main button',
        'main img',
        'main [role="img"]',
        'main blockquote',
        'main cite',
        'main address',
        'main em',
        'main strong',
        'main span',
        'footer .brand',
        'footer p',
        'footer a',
        'footer address'
    ].join(',');

    const pageName = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const pageSlug = slug(pageName.replace(/\.html?$/i, '')) || 'index';
    const registry = new Map();
    const previewData = new Map();
    let state = loadState();
    let selected = null;
    let mode = 'select';
    let hovered = null;
    let cleanPreview = false;
    let toastTimer = 0;
    let markerFrame = 0;

    document.documentElement.classList.remove('client-review-loading');
    document.documentElement.classList.add('client-review-active');

    registerReviewTargets();
    const ui = createReviewUI();
    bindReviewUI();
    setSessionStarted(state.sessionStarted, false);
    rewriteInternalLinks();
    applyStateToPage();
    updateList();
    handlePendingFocus();

    window.PsycholisticaReview = {
        version: REVIEW_VERSION,
        getState: () => deepCopy(state),
        getExportData: () => buildExportData(),
        exportReview,
        start: startReview,
        select: (reviewId) => focusReviewId(reviewId)
    };

    function slug(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 54);
    }

    function deepCopy(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function emptyState() {
        return {
            project: PROJECT,
            reviewVersion: REVIEW_VERSION,
            reviewBuild: REVIEW_BUILD,
            updatedAt: 0,
            sessionStarted: false,
            items: [],
            history: [],
            pendingFocus: null
        };
    }

    function validState(candidate) {
        return candidate && candidate.project === PROJECT && Number(candidate.reviewVersion) === REVIEW_VERSION && candidate.reviewBuild === REVIEW_BUILD && Array.isArray(candidate.items);
    }

    function loadState() {
        const candidates = [];

        try {
            const local = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
            if (validState(local)) candidates.push(local);
        } catch (_) {
            // Some file:// configurations disable localStorage. window.name remains available.
        }

        try {
            if (window.name.startsWith(WINDOW_PREFIX)) {
                const shared = JSON.parse(window.name.slice(WINDOW_PREFIX.length));
                if (validState(shared)) candidates.push(shared);
            }
        } catch (_) {
            // Ignore malformed review state and start safely.
        }

        const chosen = candidates.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0] || emptyState();
        chosen.history = Array.isArray(chosen.history) ? chosen.history.slice(-25) : [];
        chosen.pendingFocus = chosen.pendingFocus || null;
        chosen.sessionStarted = Boolean(chosen.sessionStarted);
        return chosen;
    }

    function persistState() {
        state.updatedAt = Date.now();
        const serialized = JSON.stringify(state);

        try {
            window.localStorage.setItem(STORAGE_KEY, serialized);
        } catch (_) {
            showToast('Przeglądarka ogranicza zapis lokalny. Przed zamknięciem karty wyeksportuj JSON.');
        }

        try {
            window.name = WINDOW_PREFIX + serialized;
        } catch (_) {
            // The current page still keeps the in-memory state.
        }

        updateCount();
    }

    function pushHistory() {
        state.history.push(deepCopy(state.items));
        state.history = state.history.slice(-25);
    }

    function mutateItems(change, message) {
        pushHistory();
        change();
        persistState();
        applyStateToPage();
        updateList();
        if (message) showToast(message);
    }

    function itemKey(item) {
        return `${item.page}::${item.reviewId}::${item.type}`;
    }

    function findItem(reviewId, type, page = pageName) {
        return state.items.find((item) => item.page === page && item.reviewId === reviewId && item.type === type) || null;
    }

    function upsertItem(nextItem) {
        const key = itemKey(nextItem);
        const index = state.items.findIndex((item) => itemKey(item) === key);
        if (index >= 0) state.items[index] = nextItem;
        else state.items.push(nextItem);
    }

    function removeItem(reviewId, type, page = pageName) {
        state.items = state.items.filter((item) => !(item.page === page && item.reviewId === reviewId && item.type === type));
    }

    function registerReviewTargets() {
        const used = new Map();
        const candidates = [...document.querySelectorAll(CANDIDATE_SELECTOR)].filter(isReviewableElement);

        candidates.forEach((element, order) => {
            let reviewId = element.getAttribute('data-review-id') || buildBaseReviewId(element);
            const count = (used.get(reviewId) || 0) + 1;
            used.set(reviewId, count);
            if (count > 1) reviewId = `${reviewId}-${count}`;
            element.setAttribute('data-review-id', reviewId);

            const textNode = getPrimaryTextNode(element);
            const textParts = textNode ? splitTextNode(textNode.nodeValue) : null;
            const imageLike = element.matches('img, [role="img"]');
            const section = getSectionName(element);

            registry.set(reviewId, {
                id: reviewId,
                element,
                order,
                section,
                label: describeElement(element),
                tag: element.tagName.toLowerCase(),
                textNode,
                originalText: textParts ? textParts.text : '',
                originalTextRaw: textNode ? textNode.nodeValue : '',
                textPrefix: textParts ? textParts.prefix : '',
                textSuffix: textParts ? textParts.suffix : '',
                imageLike,
                originalSrc: element.tagName === 'IMG' ? (element.getAttribute('src') || '') : (element.style.backgroundImage || ''),
                originalAlt: element.getAttribute('alt') || element.getAttribute('aria-label') || '',
                originalInlineBackground: element.style.backgroundImage || ''
            });

            if (imageLike || (textNode && textNode.parentElement === element)) {
                element.classList.add('psych-review-editable');
            }
        });
    }

    function isReviewableElement(element) {
        if (!element || element.closest('#psych-review-root, script, style, noscript, svg')) return false;
        if (element.getAttribute('aria-hidden') === 'true') return false;
        if (element.matches('.ambient-orb, .brand-symbol, .sun-glow, .sun-grain, .sun-ring, .service-orb-grain')) return false;
        if (element.tagName === 'SPAN' && !element.textContent.trim()) return false;
        return true;
    }

    function meaningfulClass(element) {
        const ignored = new Set(['reveal', 'is-visible', 'button', 'section', 'container', 'is-active']);
        return [...element.classList].find((name) => !ignored.has(name) && !name.startsWith('psych-review')) || '';
    }

    function sectionElementFor(element) {
        return element.matches('section') ? element : element.closest('section');
    }

    function getSectionName(element) {
        if (element.closest('header')) return 'header';
        if (element.closest('footer')) return 'footer';
        const section = sectionElementFor(element);
        if (!section) return 'page';
        return section.id || meaningfulClass(section) || 'section';
    }

    function buildBaseReviewId(element) {
        const section = slug(getSectionName(element));
        const text = slug(element.textContent.trim().slice(0, 46));
        const className = slug(meaningfulClass(element));

        if (element.closest('header') && element.matches('.brand')) return 'site-logo';
        if (element.closest('header') && element.matches('nav a')) return `nav-${text || 'link'}`;
        if (element.closest('header') && element.matches('.header-cta')) return 'header-consultation-button';
        if (element.closest('footer') && element.matches('.brand')) return 'footer-logo';
        if (element.matches('section')) return `section-${section}`;
        if (element.matches('.service-card')) {
            const href = element.getAttribute('href') || 'service';
            return `therapy-card-${slug(href.replace(/\.html.*$/i, '')) || text}`;
        }
        if (element.tagName === 'H1') return `${section}-title`;
        if (element.tagName === 'H2') return `${section}-heading`;
        if (element.tagName === 'H3') return `${section}-subheading`;
        if (element.matches('img, [role="img"]')) {
            const imageName = slug(element.getAttribute('alt') || element.getAttribute('aria-label') || className || 'image');
            return `${section}-image-${imageName}`;
        }
        if (element.matches('a, button')) return `${section}-${className || element.tagName.toLowerCase()}-${text || 'action'}`;
        return `${section}-${element.tagName.toLowerCase()}-${className || text || 'element'}`;
    }

    function describeElement(element) {
        const names = {
            H1: 'Nagłówek główny', H2: 'Nagłówek sekcji', H3: 'Nagłówek', H4: 'Nagłówek',
            P: 'Akapit', A: 'Link / przycisk', BUTTON: 'Przycisk', IMG: 'Zdjęcie',
            SECTION: 'Sekcja', ARTICLE: 'Karta / blok', LI: 'Element listy', BLOCKQUOTE: 'Cytat',
            CITE: 'Autor cytatu', ADDRESS: 'Dane kontaktowe', EM: 'Wyróżniony tekst', STRONG: 'Wyróżniony tekst', SPAN: 'Fragment tekstu'
        };
        const base = names[element.tagName] || (element.getAttribute('role') === 'img' ? 'Miejsce na zdjęcie' : 'Element');
        const excerpt = element.textContent.trim().replace(/\s+/g, ' ').slice(0, 54);
        return excerpt ? `${base}: ${excerpt}` : base;
    }

    function getPrimaryTextNode(element) {
        const directNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
        if (directNodes.length) return directNodes.sort((a, b) => b.nodeValue.trim().length - a.nodeValue.trim().length)[0];

        if (!TEXT_TAGS.has(element.tagName)) return null;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                const parent = node.parentElement;
                if (!parent || parent.closest('[aria-hidden="true"], script, style, svg')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        return nodes.sort((a, b) => b.nodeValue.trim().length - a.nodeValue.trim().length)[0] || null;
    }

    function splitTextNode(raw) {
        const value = String(raw || '');
        const prefix = (value.match(/^\s*/) || [''])[0];
        const suffix = (value.match(/\s*$/) || [''])[0];
        return { prefix, suffix, text: value.slice(prefix.length, value.length - suffix.length) };
    }

    function selectorFallback(reviewId) {
        return `[data-review-id="${String(reviewId).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`;
    }

    function createReviewUI() {
        const root = document.createElement('div');
        root.id = 'psych-review-root';
        root.setAttribute('data-review-ui', 'true');
        root.innerHTML = `
            <section class="psych-review-start" data-review-start aria-labelledby="psych-review-start-title">
                <div class="psych-review-start-card">
                    <span class="psych-review-start-badge">Psycholistica · wersja do korekty</span>
                    <h1 id="psych-review-start-title">Tutaj można poprawić stronę</h1>
                    <p>Kliknij przycisk poniżej. Elementy możliwe do zmiany zostaną podświetlone — wystarczy kliknąć wybrany tekst, zdjęcie albo część strony.</p>
                    <button class="psych-review-start-button" type="button" data-review-action="start">Rozpocznij edycję strony</button>
                    <small>Zmiany dotyczą wyłącznie tej kopii do sprawdzenia.</small>
                </div>
            </section>

            <div class="psych-review-toolbar" role="toolbar" aria-label="Narzędzia trybu uwag" hidden>
                <div class="psych-review-brand"><span class="psych-review-brand-dot"></span><span><strong>Review Mode</strong><small>Psycholistica</small></span></div>
                <div class="psych-review-toolbar-tip">Kliknij podświetlony element</div>
                <div class="psych-review-toolbar-group" aria-label="Tryb wyboru">
                    <button class="psych-review-button is-active" type="button" data-review-mode="select">Wybierz</button>
                    <button class="psych-review-button" type="button" data-review-mode="text">Edytuj tekst</button>
                    <button class="psych-review-button" type="button" data-review-mode="comment">Komentarz</button>
                    <button class="psych-review-button" type="button" data-review-mode="image">Zmień zdjęcie</button>
                </div>
                <div class="psych-review-toolbar-group psych-review-toolbar-actions">
                    <button class="psych-review-button" type="button" data-review-action="undo">Cofnij</button>
                    <button class="psych-review-button" type="button" data-review-action="list">Lista <span class="psych-review-count" data-review-count>0</span></button>
                    <button class="psych-review-button" type="button" data-review-action="preview">Podgląd bez UI</button>
                    <button class="psych-review-button psych-review-button--primary" type="button" data-review-action="finish">Zakończ i zapisz</button>
                </div>
            </div>

            <aside class="psych-review-context" data-review-context hidden aria-label="Wybrany element">
                <div class="psych-review-panel-header">
                    <div><h2 data-review-context-title>Wybrany element</h2><p data-review-context-id></p></div>
                    <button class="psych-review-icon-button" type="button" data-review-action="close-context" aria-label="Zamknij">×</button>
                </div>
                <div class="psych-review-panel-body">
                    <dl class="psych-review-element-meta"><dt>Strona</dt><dd data-review-meta-page></dd><dt>Sekcja</dt><dd data-review-meta-section></dd><dt>Element</dt><dd data-review-meta-element></dd></dl>

                    <fieldset class="psych-review-fieldset" data-review-text-fieldset>
                        <legend class="psych-review-legend">Zmiana tekstu</legend>
                        <p class="psych-review-help">Edytujesz bezpieczny fragment tekstu. Podgląd na stronie zmienia się na żywo, a struktura HTML pozostaje nienaruszona.</p>
                        <textarea class="psych-review-textarea" data-review-text-input aria-label="Nowy tekst"></textarea>
                        <div class="psych-review-inline-actions"><button class="psych-review-button" type="button" data-review-action="revert-text">Przywróć</button><button class="psych-review-button psych-review-button--save" type="button" data-review-action="save-text">Zapisz tekst</button></div>
                    </fieldset>

                    <fieldset class="psych-review-fieldset">
                        <legend class="psych-review-legend">Komentarz</legend>
                        <select class="psych-review-select" data-review-comment-category aria-label="Kategoria komentarza"><option>TEXT</option><option>COLOR</option><option>IMAGE</option><option>SPACING</option><option>LAYOUT</option><option>REMOVE</option><option selected>OTHER</option></select>
                        <textarea class="psych-review-textarea" data-review-comment-input placeholder="Opisz oczekiwaną zmianę…" aria-label="Komentarz"></textarea>
                        <p class="psych-review-voice-note"><span>🎙</span><span>Aby podyktować komentarz w Windows, kliknij pole i naciśnij <strong>Win + H</strong>.</span></p>
                        <div class="psych-review-inline-actions"><button class="psych-review-button" type="button" data-review-action="delete-comment">Usuń</button><button class="psych-review-button psych-review-button--save" type="button" data-review-action="save-comment">Zapisz komentarz</button></div>
                    </fieldset>

                    <fieldset class="psych-review-fieldset" data-review-image-fieldset hidden>
                        <legend class="psych-review-legend">Podmiana zdjęcia</legend>
                        <p class="psych-review-help">Nowy plik zobaczysz od razu. Po eksporcie wyślij go razem z JSON-em.</p>
                        <input class="psych-review-file" type="file" accept="image/*" data-review-image-input>
                        <p class="psych-review-image-file" data-review-image-file></p>
                        <textarea class="psych-review-textarea" data-review-image-comment placeholder="Opcjonalna uwaga do zdjęcia…" aria-label="Komentarz do zdjęcia"></textarea>
                        <div class="psych-review-inline-actions"><button class="psych-review-button" type="button" data-review-action="revert-image">Przywróć</button><button class="psych-review-button psych-review-button--save" type="button" data-review-action="save-image-comment">Zapisz opis</button></div>
                    </fieldset>
                </div>
            </aside>

            <aside class="psych-review-list" data-review-list hidden aria-label="Lista uwag">
                <div class="psych-review-panel-header"><div><h2>Lista uwag</h2><p>Wszystkie strony w bieżącej sesji</p></div><button class="psych-review-icon-button" type="button" data-review-action="close-list" aria-label="Zamknij">×</button></div>
                <div class="psych-review-list-summary" data-review-list-summary>0 elementów</div>
                <ol class="psych-review-items" data-review-items></ol>
                <div class="psych-review-clear"><button class="psych-review-button psych-review-button--danger" type="button" data-review-action="clear-all">Wyczyść wszystkie dane przeglądu</button></div>
            </aside>

            <aside class="psych-review-finish" data-review-finish hidden aria-labelledby="psych-review-finish-title">
                <div class="psych-review-panel-header">
                    <div><h2 id="psych-review-finish-title">Zapisz wprowadzone zmiany</h2><p data-review-finish-summary></p></div>
                    <button class="psych-review-icon-button" type="button" data-review-action="close-finish" aria-label="Zamknij">×</button>
                </div>
                <div class="psych-review-finish-body">
                    <p><strong>Najprostsza opcja:</strong> wskaż rozpakowany folder strony. Zapiszemy w nim plik <code>CLIENT-REVIEW-DATA.json</code>. Potem spakuj cały folder ponownie i odeślij ZIP.</p>
                    <button class="psych-review-finish-primary" type="button" data-review-action="save-folder">Zapisz zmiany w folderze strony</button>
                    <button class="psych-review-finish-secondary" type="button" data-review-action="export">Pobierz sam plik zmian</button>
                    <p class="psych-review-finish-help" data-review-save-help>Jeżeli zapis do folderu nie jest dostępny, pobierz plik zmian i przenieś go ręcznie do rozpakowanego folderu przed utworzeniem ZIP-a.</p>
                    <div class="psych-review-finish-status" data-review-finish-status hidden></div>
                </div>
            </aside>

            <div class="psych-review-markers" data-review-markers aria-hidden="true"></div>
            <div class="psych-review-toast" data-review-toast role="status" aria-live="polite"></div>
        `;
        document.body.appendChild(root);

        const cleanHint = document.createElement('div');
        cleanHint.id = 'psych-review-clean-hint';
        cleanHint.textContent = 'Podgląd bez narzędzi · naciśnij Esc, aby wrócić';
        document.body.appendChild(cleanHint);

        return {
            root,
            start: root.querySelector('[data-review-start]'),
            toolbar: root.querySelector('.psych-review-toolbar'),
            context: root.querySelector('[data-review-context]'),
            list: root.querySelector('[data-review-list]'),
            finish: root.querySelector('[data-review-finish]'),
            finishSummary: root.querySelector('[data-review-finish-summary]'),
            finishStatus: root.querySelector('[data-review-finish-status]'),
            saveFolder: root.querySelector('[data-review-action="save-folder"]'),
            saveHelp: root.querySelector('[data-review-save-help]'),
            count: root.querySelector('[data-review-count]'),
            toast: root.querySelector('[data-review-toast]'),
            markers: root.querySelector('[data-review-markers]'),
            contextTitle: root.querySelector('[data-review-context-title]'),
            contextId: root.querySelector('[data-review-context-id]'),
            metaPage: root.querySelector('[data-review-meta-page]'),
            metaSection: root.querySelector('[data-review-meta-section]'),
            metaElement: root.querySelector('[data-review-meta-element]'),
            textFieldset: root.querySelector('[data-review-text-fieldset]'),
            textInput: root.querySelector('[data-review-text-input]'),
            commentCategory: root.querySelector('[data-review-comment-category]'),
            commentInput: root.querySelector('[data-review-comment-input]'),
            imageFieldset: root.querySelector('[data-review-image-fieldset]'),
            imageInput: root.querySelector('[data-review-image-input]'),
            imageFile: root.querySelector('[data-review-image-file]'),
            imageComment: root.querySelector('[data-review-image-comment]'),
            items: root.querySelector('[data-review-items]'),
            listSummary: root.querySelector('[data-review-list-summary]')
        };
    }

    function bindReviewUI() {
        ui.root.addEventListener('click', handleUIClick);
        ui.textInput.addEventListener('input', () => {
            if (selected?.textNode) setEntryText(selected, ui.textInput.value);
        });
        ui.imageInput.addEventListener('change', handleImageFile);

        document.addEventListener('pointerover', handlePointerOver, true);
        document.addEventListener('pointerout', handlePointerOut, true);
        document.addEventListener('click', handlePageClick, true);
        document.addEventListener('keydown', handleKeydown, true);
        window.addEventListener('scroll', scheduleMarkers, { passive: true });
        window.addEventListener('resize', scheduleMarkers, { passive: true });
        window.addEventListener('beforeunload', persistState);
    }

    function handleUIClick(event) {
        const modeButton = event.target.closest('[data-review-mode]');
        if (modeButton) {
            setMode(modeButton.dataset.reviewMode);
            return;
        }

        const actionButton = event.target.closest('[data-review-action]');
        if (!actionButton) return;
        const action = actionButton.dataset.reviewAction;

        if (action === 'start') startReview();
        if (action === 'undo') undoLast();
        if (action === 'list') toggleList();
        if (action === 'preview') enableCleanPreview();
        if (action === 'finish') openFinishPanel();
        if (action === 'export') exportReview();
        if (action === 'save-folder') saveReviewToFolder();
        if (action === 'close-context') clearSelection(true);
        if (action === 'close-list') ui.list.hidden = true;
        if (action === 'close-finish') ui.finish.hidden = true;
        if (action === 'save-text') saveSelectedText();
        if (action === 'revert-text') revertSelectedType('text');
        if (action === 'save-comment') saveSelectedComment();
        if (action === 'delete-comment') revertSelectedType('comment');
        if (action === 'save-image-comment') saveImageComment();
        if (action === 'revert-image') revertSelectedType('image');
        if (action === 'clear-all') clearAllReviewData();
    }

    function setSessionStarted(started, shouldPersist = true) {
        state.sessionStarted = Boolean(started);
        document.documentElement.classList.toggle('psych-review-session-started', state.sessionStarted);
        ui.start.hidden = state.sessionStarted;
        ui.toolbar.hidden = !state.sessionStarted;
        if (shouldPersist) persistState();
    }

    function startReview() {
        setSessionStarted(true);
        setMode('select');
        window.setTimeout(() => showToast('Gotowe. Kliknij dowolny podświetlony element, aby go zmienić.'), 120);
    }

    function setMode(nextMode) {
        mode = nextMode;
        clearSelection(true);
        ui.root.querySelectorAll('[data-review-mode]').forEach((button) => button.classList.toggle('is-active', button.dataset.reviewMode === mode));
        const messages = {
            select: 'Kliknij element, aby zobaczyć dostępne opcje.',
            text: 'Kliknij dokładny fragment tekstu, który chcesz zmienić.',
            comment: 'Kliknij element, do którego chcesz dodać komentarz.',
            image: 'Kliknij zdjęcie lub oznaczone miejsce na fotografię.'
        };
        showToast(messages[mode]);
    }

    function handlePointerOver(event) {
        if (cleanPreview || event.target.closest('#psych-review-root')) return;
        const entry = entryFromEventTarget(event.target);
        if (!entry || entry === hovered) return;
        if (hovered) hovered.element.classList.remove('psych-review-hovered');
        hovered = entry;
        hovered.element.classList.add('psych-review-hovered');
    }

    function handlePointerOut(event) {
        if (!hovered || event.relatedTarget?.closest?.(`[data-review-id="${hovered.id}"]`)) return;
        hovered.element.classList.remove('psych-review-hovered');
        hovered = null;
    }

    function handlePageClick(event) {
        if (cleanPreview || event.target.closest('#psych-review-root, #psych-review-clean-hint')) return;
        const entry = entryFromEventTarget(event.target);
        if (!entry) return;
        event.preventDefault();
        event.stopPropagation();
        selectEntry(entry);
    }

    function entryFromEventTarget(target) {
        let element = null;
        if (mode === 'text') {
            element = target.closest('h1, h2, h3, h4, p, li, a, button, blockquote, cite, em, strong, span, address, dt, dd');
            if (element?.getAttribute('aria-hidden') === 'true') element = null;
        } else if (mode === 'image') {
            element = target.closest('img, [role="img"]');
        }
        element ||= target.closest('[data-review-id]');
        return element ? registry.get(element.getAttribute('data-review-id')) || null : null;
    }

    function selectEntry(entry) {
        clearSelection(true);
        selected = entry;
        selected.element.classList.add('psych-review-selected');
        ui.context.hidden = false;
        ui.list.hidden = true;
        ui.finish.hidden = true;
        populateContext();
        scheduleMarkers();

        if (mode === 'text' && selected.textNode) ui.textInput.focus();
        else if (mode === 'comment') ui.commentInput.focus();
        else if (mode === 'image' && selected.imageLike) ui.imageInput.focus();
        else if (mode === 'image' && !selected.imageLike) showToast('Ten element nie jest zdjęciem. Wybierz fotografię lub miejsce na fotografię.');
    }

    function clearSelection(reapply) {
        if (selected) selected.element.classList.remove('psych-review-selected');
        selected = null;
        ui.context.hidden = true;
        if (reapply) applyStateToPage();
    }

    function populateContext() {
        if (!selected) return;
        const textItem = findItem(selected.id, 'text');
        const commentItem = findItem(selected.id, 'comment');
        const imageItem = findItem(selected.id, 'image');

        ui.contextTitle.textContent = selected.label;
        ui.contextId.textContent = selected.id;
        ui.metaPage.textContent = pageName;
        ui.metaSection.textContent = selected.section;
        ui.metaElement.textContent = `<${selected.tag}>`;

        ui.textFieldset.hidden = !selected.textNode;
        ui.textInput.value = textItem?.newText ?? selected.originalText;
        ui.commentCategory.value = commentItem?.category || (selected.imageLike ? 'IMAGE' : 'OTHER');
        ui.commentInput.value = commentItem?.comment || '';
        ui.imageFieldset.hidden = !selected.imageLike;
        ui.imageFile.textContent = imageItem?.replacementFileName ? `Wybrany plik: ${imageItem.replacementFileName}` : 'Nie wybrano nowego pliku.';
        ui.imageComment.value = imageItem?.comment || '';
        ui.imageInput.value = '';
    }

    function setEntryText(entry, value) {
        if (!entry?.textNode) return;
        entry.textNode.nodeValue = `${entry.textPrefix}${value}${entry.textSuffix}`;
    }

    function saveSelectedText() {
        if (!selected?.textNode) return;
        const newText = ui.textInput.value.trim();
        if (!newText) {
            showToast('Tekst nie może być pusty. Użyj komentarza REMOVE, jeśli element ma zostać usunięty.');
            return;
        }

        mutateItems(() => {
            if (newText === selected.originalText) removeItem(selected.id, 'text');
            else upsertItem(baseItem(selected, 'text', { originalText: selected.originalText, newText }));
        }, newText === selected.originalText ? 'Przywrócono oryginalny tekst.' : 'Zapisano zmianę tekstu.');
        populateContext();
    }

    function saveSelectedComment() {
        if (!selected) return;
        const comment = ui.commentInput.value.trim();
        const category = ui.commentCategory.value;
        mutateItems(() => {
            if (!comment) removeItem(selected.id, 'comment');
            else upsertItem(baseItem(selected, 'comment', { category, comment }));
        }, comment ? 'Zapisano komentarz.' : 'Usunięto pusty komentarz.');
        populateContext();
    }

    function handleImageFile(event) {
        if (!selected?.imageLike) return;
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('Wybierz plik obrazu.');
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const key = `${pageName}::${selected.id}::image`;
            previewData.set(key, reader.result);
            mutateItems(() => {
                upsertItem(baseItem(selected, 'image', {
                    originalSrc: selected.originalSrc,
                    originalAlt: selected.originalAlt,
                    replacementFileName: file.name,
                    previewDataUrl: String(reader.result).length <= 1200000 ? reader.result : '',
                    comment: ui.imageComment.value.trim()
                }));
            }, `Dodano podgląd pliku ${file.name}. Pamiętaj, aby wysłać zdjęcie razem z JSON-em.`);
            populateContext();
        });
        reader.readAsDataURL(file);
    }

    function saveImageComment() {
        if (!selected?.imageLike) return;
        const existing = findItem(selected.id, 'image');
        if (!existing) {
            showToast('Najpierw wybierz plik zdjęcia.');
            return;
        }
        const comment = ui.imageComment.value.trim();
        mutateItems(() => upsertItem({ ...existing, comment, updatedAt: new Date().toISOString() }), 'Zapisano opis zdjęcia.');
        populateContext();
    }

    function baseItem(entry, type, details) {
        return {
            reviewId: entry.id,
            page: pageName,
            section: entry.section,
            type,
            status: 'open',
            elementTag: entry.tag,
            elementLabel: entry.label,
            cssSelectorFallback: selectorFallback(entry.id),
            order: entry.order,
            updatedAt: new Date().toISOString(),
            ...details
        };
    }

    function revertSelectedType(type) {
        if (!selected) return;
        const existing = findItem(selected.id, type);
        if (!existing) {
            if (type === 'text') setEntryText(selected, selected.originalText);
            return;
        }
        const reviewId = selected.id;
        mutateItems(() => removeItem(reviewId, type), 'Przywrócono oryginalną wersję elementu.');
        populateContext();
    }

    function resetEntry(entry) {
        if (entry.textNode) entry.textNode.nodeValue = entry.originalTextRaw;
        if (entry.imageLike) {
            if (entry.element.tagName === 'IMG') {
                if (entry.originalSrc) entry.element.setAttribute('src', entry.originalSrc);
                else entry.element.removeAttribute('src');
            } else {
                entry.element.style.backgroundImage = entry.originalInlineBackground;
            }
            entry.element.classList.remove('psych-review-image-preview');
        }
        entry.element.classList.remove('psych-review-changed');
    }

    function applyImagePreview(entry, dataUrl) {
        if (!dataUrl) return;
        if (entry.element.tagName === 'IMG') entry.element.src = dataUrl;
        else entry.element.style.backgroundImage = `url("${dataUrl}")`;
        entry.element.classList.add('psych-review-image-preview');
    }

    function applyStateToPage() {
        registry.forEach(resetEntry);

        const currentItems = state.items.filter((item) => item.page === pageName);
        currentItems.forEach((item) => {
            const entry = registry.get(item.reviewId);
            if (!entry) return;
            if (item.type === 'text' && typeof item.newText === 'string') setEntryText(entry, item.newText);
            if (item.type === 'image') applyImagePreview(entry, previewData.get(itemKey(item)) || item.previewDataUrl);
            entry.element.classList.add('psych-review-changed');
        });

        updateCount();
        scheduleMarkers();
    }

    function undoLast() {
        const previous = state.history.pop();
        if (!previous) {
            showToast('Brak zmian do cofnięcia.');
            return;
        }
        state.items = previous;
        persistState();
        applyStateToPage();
        updateList();
        if (selected) populateContext();
        showToast('Cofnięto ostatnią zmianę.');
    }

    function updateCount() {
        if (!ui?.count) return;
        ui.count.textContent = String(state.items.length);
        ui.count.setAttribute('aria-label', `${state.items.length} uwag`);
    }

    function sortedItems() {
        return [...state.items].sort((a, b) => {
            if (a.page !== b.page) return a.page.localeCompare(b.page, 'pl');
            if (Number(a.order) !== Number(b.order)) return Number(a.order) - Number(b.order);
            return a.type.localeCompare(b.type);
        });
    }

    function updateList() {
        if (!ui?.items) return;
        const items = sortedItems();
        ui.items.replaceChildren();
        ui.listSummary.textContent = `${items.length} ${pluralItems(items.length)}`;

        if (!items.length) {
            const empty = document.createElement('li');
            empty.className = 'psych-review-empty';
            empty.textContent = 'Nie ma jeszcze żadnych uwag.';
            ui.items.appendChild(empty);
            return;
        }

        items.forEach((item, index) => {
            const row = document.createElement('li');
            row.className = 'psych-review-item';
            const number = document.createElement('span');
            number.className = 'psych-review-item-number';
            number.textContent = String(index + 1).padStart(2, '0');
            const content = document.createElement('div');
            const heading = document.createElement('h3');
            heading.textContent = item.elementLabel || item.reviewId;
            const meta = document.createElement('div');
            meta.className = 'psych-review-item-meta';
            meta.textContent = `${item.page} · ${typeLabel(item.type)} · do wdrożenia`;
            const copy = document.createElement('p');
            copy.className = 'psych-review-item-copy';
            copy.textContent = itemSummary(item);
            const actions = document.createElement('div');
            actions.className = 'psych-review-item-actions';
            actions.append(
                listActionButton('Pokaż', 'focus', item),
                listActionButton('Edytuj', 'edit', item),
                listActionButton(item.type === 'comment' ? 'Usuń' : 'Przywróć', 'remove', item)
            );
            content.append(heading, meta, copy, actions);
            row.append(number, content);
            ui.items.appendChild(row);
        });
    }

    function pluralItems(count) {
        if (count === 1) return 'uwaga';
        if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'uwagi';
        return 'uwag';
    }

    function typeLabel(type) {
        return ({ text: 'tekst', comment: 'komentarz', image: 'zdjęcie' })[type] || type;
    }

    function itemSummary(item) {
        if (item.type === 'text') return `${item.originalText} → ${item.newText}`;
        if (item.type === 'image') return `${item.replacementFileName}${item.comment ? ` — ${item.comment}` : ''}`;
        return `${item.category || 'OTHER'} — ${item.comment || ''}`;
    }

    function listActionButton(label, action, item) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.addEventListener('click', () => handleListAction(action, item));
        return button;
    }

    function handleListAction(action, item) {
        if (action === 'remove') {
            mutateItems(() => removeItem(item.reviewId, item.type, item.page), 'Usunięto element z listy uwag.');
            return;
        }

        if (item.page !== pageName) {
            state.pendingFocus = { page: item.page, reviewId: item.reviewId, type: item.type, edit: action === 'edit' };
            persistState();
            window.location.href = reviewUrlForPage(item.page);
            return;
        }

        const entry = registry.get(item.reviewId);
        if (!entry) {
            showToast('Nie znaleziono elementu na tej wersji strony. Identyfikator pozostaje w eksporcie.');
            return;
        }
        ui.list.hidden = true;
        if (action === 'edit') setMode(item.type === 'image' ? 'image' : item.type === 'comment' ? 'comment' : 'text');
        selectEntry(entry);
        entry.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        entry.element.classList.add('psych-review-flash');
        window.setTimeout(() => entry.element.classList.remove('psych-review-flash'), 1300);
    }

    function toggleList() {
        ui.list.hidden = !ui.list.hidden;
        if (!ui.list.hidden) {
            clearSelection(true);
            ui.finish.hidden = true;
            updateList();
        }
    }

    function openFinishPanel() {
        clearSelection(true);
        ui.list.hidden = true;
        ui.finish.hidden = false;
        ui.finishSummary.textContent = `${state.items.length} ${pluralItems(state.items.length)} do zapisania`;
        ui.finishStatus.hidden = true;
        const canSaveToFolder = typeof window.showDirectoryPicker === 'function' && window.isSecureContext;
        ui.saveFolder.hidden = !canSaveToFolder;
        ui.saveHelp.textContent = canSaveToFolder
            ? 'Po kliknięciu wybierz główny rozpakowany folder Psycholistica — ten, w którym znajduje się plik index.html.'
            : 'Ta przeglądarka nie pozwala zapisać pliku bezpośrednio w folderze. Pobierz plik zmian i przenieś go do rozpakowanego folderu przed utworzeniem ZIP-a.';
    }

    async function saveReviewToFolder() {
        if (typeof window.showDirectoryPicker !== 'function' || !window.isSecureContext) {
            exportReview();
            return;
        }

        ui.finishStatus.hidden = false;
        ui.finishStatus.className = 'psych-review-finish-status';
        ui.finishStatus.textContent = 'Wybierz rozpakowany folder strony…';

        try {
            const directory = await window.showDirectoryPicker({ id: 'psycholistica-client-review', mode: 'readwrite' });
            try {
                await directory.getFileHandle('index.html');
            } catch (_) {
                ui.finishStatus.classList.add('is-error');
                ui.finishStatus.textContent = 'To nie jest folder strony. Wybierz folder zawierający plik index.html.';
                return;
            }

            const reviewFile = await directory.getFileHandle('CLIENT-REVIEW-DATA.json', { create: true });
            const writable = await reviewFile.createWritable();
            await writable.write(reviewJson());
            await writable.close();

            let savedImages = 0;
            const missingImages = [];
            const imageItems = state.items.filter((item) => item.type === 'image');
            if (imageItems.length) {
                const imageDirectory = await directory.getDirectoryHandle('NOWE-ZDJECIA', { create: true });
                for (const item of imageItems) {
                    if (!item.previewDataUrl) {
                        missingImages.push(item.replacementFileName);
                        continue;
                    }
                    const imageFile = await imageDirectory.getFileHandle(safeFileName(item.replacementFileName), { create: true });
                    const imageWritable = await imageFile.createWritable();
                    await imageWritable.write(dataUrlToBlob(item.previewDataUrl));
                    await imageWritable.close();
                    savedImages += 1;
                }
            }

            ui.finishStatus.classList.add('is-success');
            ui.finishStatus.innerHTML = `<strong>Gotowe — zapisano CLIENT-REVIEW-DATA.json${savedImages ? ` oraz ${savedImages} ${savedImages === 1 ? 'zdjęcie' : 'zdjęcia'}` : ''}.</strong><br>Zamknij stronę, spakuj ponownie cały wybrany folder i odeślij ZIP.${missingImages.length ? `<br><br>Te pliki trzeba dodatkowo skopiować do folderu NOWE-ZDJECIA: ${missingImages.map(escapeHtml).join(', ')}` : ''}`;
        } catch (error) {
            if (error?.name === 'AbortError') {
                ui.finishStatus.hidden = true;
                return;
            }
            ui.finishStatus.classList.add('is-error');
            ui.finishStatus.textContent = 'Nie udało się zapisać w folderze. Użyj przycisku „Pobierz sam plik zmian”, a następnie przenieś pobrany plik do folderu strony.';
        }
    }

    function safeFileName(value) {
        return String(value || 'nowe-zdjecie.jpg').replace(/[\\/:*?"<>|]/g, '-');
    }

    function dataUrlToBlob(dataUrl) {
        const [header, encoded] = String(dataUrl).split(',');
        const mime = (header.match(/^data:([^;]+)/) || [])[1] || 'application/octet-stream';
        const binary = window.atob(encoded || '');
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return new Blob([bytes], { type: mime });
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
    }

    function clearAllReviewData() {
        if (!window.confirm('Czy na pewno usunąć wszystkie uwagi, zmiany tekstu i informacje o zdjęciach? Tej operacji nie można cofnąć.')) return;
        state = emptyState();
        previewData.clear();
        persistState();
        applyStateToPage();
        updateList();
        clearSelection(false);
        showToast('Wyczyszczono wszystkie dane przeglądu.');
    }

    function scheduleMarkers() {
        if (markerFrame) return;
        markerFrame = window.requestAnimationFrame(() => {
            markerFrame = 0;
            updateMarkers();
        });
    }

    function updateMarkers() {
        if (!ui?.markers) return;
        ui.markers.replaceChildren();
        const grouped = new Map();
        state.items.filter((item) => item.page === pageName).forEach((item) => {
            grouped.set(item.reviewId, (grouped.get(item.reviewId) || 0) + 1);
        });

        grouped.forEach((count, reviewId) => {
            const entry = registry.get(reviewId);
            if (!entry) return;
            const rect = entry.element.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return;
            const marker = document.createElement('span');
            marker.className = 'psych-review-marker';
            marker.textContent = String(count);
            marker.style.left = `${Math.max(2, Math.min(window.innerWidth - 22, rect.right - 10))}px`;
            marker.style.top = `${Math.max(2, Math.min(window.innerHeight - 22, rect.top - 10))}px`;
            ui.markers.appendChild(marker);
        });
    }

    function enableCleanPreview() {
        cleanPreview = true;
        clearSelection(true);
        ui.list.hidden = true;
        if (hovered) hovered.element.classList.remove('psych-review-hovered');
        hovered = null;
        document.documentElement.classList.add('psych-review-clean-preview');
        window.setTimeout(() => {
            const hint = document.getElementById('psych-review-clean-hint');
            if (hint) hint.style.display = 'none';
        }, 2600);
    }

    function disableCleanPreview() {
        cleanPreview = false;
        document.documentElement.classList.remove('psych-review-clean-preview');
        const hint = document.getElementById('psych-review-clean-hint');
        if (hint) hint.style.display = '';
        scheduleMarkers();
        showToast('Wrócono do trybu uwag.');
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            if (cleanPreview) disableCleanPreview();
            else {
                clearSelection(true);
                ui.list.hidden = true;
            }
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            undoLast();
        }
    }

    function showToast(message) {
        if (!ui?.toast || !message) return;
        window.clearTimeout(toastTimer);
        ui.toast.textContent = message;
        ui.toast.classList.add('is-visible');
        toastTimer = window.setTimeout(() => ui.toast.classList.remove('is-visible'), 3200);
    }

    function rewriteInternalLinks() {
        const currentDirectory = new URL('.', window.location.href).href;
        document.querySelectorAll('a[href]').forEach((link) => {
            const raw = link.getAttribute('href');
            if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return;
            try {
                let url = new URL(raw, window.location.href);
                const legacyRedirects = {
                    'omnie.html': '#terapeuta',
                    'kontakt.html': '#kontakt'
                };
                const targetFile = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase();
                if (legacyRedirects[targetFile]) {
                    url = new URL('index.html', window.location.href);
                    url.hash = legacyRedirects[targetFile];
                }
                const isLocalFile = url.protocol === 'file:' && url.href.startsWith(currentDirectory);
                const isSameWebOrigin = /^https?:$/.test(url.protocol) && url.origin === window.location.origin;
                if (!(isLocalFile || isSameWebOrigin) || !/\.html?$/i.test(url.pathname)) return;
                if (/\/(review|client-review-instructions)\.html?$/i.test(url.pathname)) return;
                url.searchParams.set('review', '1');
                link.href = url.href;
            } catch (_) {
                // Keep unusual links untouched.
            }
        });
    }

    function reviewUrlForPage(page) {
        const url = new URL(page, window.location.href);
        url.searchParams.set('review', '1');
        url.hash = '';
        return url.href;
    }

    function handlePendingFocus() {
        const pending = state.pendingFocus;
        if (!pending || pending.page !== pageName) return;
        state.pendingFocus = null;
        persistState();
        window.setTimeout(() => {
            if (pending.edit) setMode(pending.type === 'image' ? 'image' : pending.type === 'comment' ? 'comment' : 'text');
            focusReviewId(pending.reviewId);
        }, 250);
    }

    function focusReviewId(reviewId) {
        const entry = registry.get(reviewId);
        if (!entry) return false;
        selectEntry(entry);
        entry.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        entry.element.classList.add('psych-review-flash');
        window.setTimeout(() => entry.element.classList.remove('psych-review-flash'), 1300);
        return true;
    }

    function buildExportData() {
        const items = sortedItems().map((item) => {
            const output = {
                reviewId: item.reviewId,
                page: item.page,
                section: item.section,
                type: item.type,
                status: item.status,
                elementTag: item.elementTag,
                elementLabel: item.elementLabel,
                cssSelectorFallback: item.cssSelectorFallback
            };
            if (item.type === 'text') {
                output.originalText = item.originalText;
                output.newText = item.newText;
            }
            if (item.type === 'comment') {
                output.category = item.category;
                output.comment = item.comment;
            }
            if (item.type === 'image') {
                output.originalSrc = item.originalSrc;
                output.originalAlt = item.originalAlt;
                output.replacementFileName = item.replacementFileName;
                output.comment = item.comment || '';
            }
            return output;
        });

        return {
            project: PROJECT,
            reviewVersion: REVIEW_VERSION,
            reviewBuild: REVIEW_BUILD,
            exportedAt: new Date().toISOString(),
            entryPage: 'index.html',
            currentPage: pageName,
            pages: [...new Set(items.map((item) => item.page))],
            itemCount: items.length,
            items
        };
    }

    function reviewJson() {
        return `${JSON.stringify(buildExportData(), null, 2)}\n`;
    }

    function exportReview() {
        const data = buildExportData();
        const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'CLIENT-REVIEW-DATA.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        ui.finishStatus.hidden = false;
        ui.finishStatus.className = 'psych-review-finish-status is-success';
        ui.finishStatus.innerHTML = `<strong>Pobrano CLIENT-REVIEW-DATA.json z ${data.itemCount} ${pluralItems(data.itemCount)}.</strong><br>Przenieś pobrany plik do rozpakowanego folderu Psycholistica, spakuj cały folder ponownie i odeślij ZIP. Nowe zdjęcia również umieść w folderze.`;
        showToast('Pobrano plik CLIENT-REVIEW-DATA.json.');
    }
})();
