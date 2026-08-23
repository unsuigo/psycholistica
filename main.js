document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.primary-navigation');
    const navLinks = [...document.querySelectorAll('.primary-navigation a[href^="#"]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const closeMenu = () => {
        if (!menuButton || !navigation) return;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Otwórz menu');
        navigation.classList.remove('is-open');
        document.body.classList.remove('nav-open');
    };

    if (menuButton && navigation) {
        menuButton.addEventListener('click', () => {
            const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
            menuButton.setAttribute('aria-expanded', String(willOpen));
            menuButton.setAttribute('aria-label', willOpen ? 'Zamknij menu' : 'Otwórz menu');
            navigation.classList.toggle('is-open', willOpen);
            document.body.classList.toggle('nav-open', willOpen);
        });

        navLinks.forEach((link) => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) closeMenu();
        });
    }

    let scrollTicking = false;
    const updateHeader = () => {
        header?.classList.toggle('is-scrolled', window.scrollY > 24);
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateHeader);
            scrollTicking = true;
        }
    }, { passive: true });
    updateHeader();

    document.querySelectorAll('[data-current-year]').forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });

    const revealItems = [...document.querySelectorAll('.reveal')];
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const observedSections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && observedSections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;
            navLinks.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
            });
        }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.25] });

        observedSections.forEach((section) => sectionObserver.observe(section));
    }
});
