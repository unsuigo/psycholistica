document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.primary-navigation');
    const navLinks = [...document.querySelectorAll('.primary-navigation a')];
    const sectionNavLinks = navLinks.filter((link) => link.getAttribute('href')?.startsWith('#'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

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

    const observedSections = sectionNavLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && observedSections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;
            sectionNavLinks.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
            });
        }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.25] });

        observedSections.forEach((section) => sectionObserver.observe(section));
    }

    if (!reducedMotion) {
        const sun = document.querySelector('[data-sun]');
        const heroVisual = document.querySelector('[data-hero-visual]');

        if (sun && heroVisual) {
            heroVisual.addEventListener('pointermove', (event) => {
                const bounds = heroVisual.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                sun.style.setProperty('--sun-shift-x', `${x * 18}px`);
                sun.style.setProperty('--sun-shift-y', `${y * 14}px`);
                sun.style.setProperty('--sun-rotate', `${x * 2.5}deg`);
            });

            heroVisual.addEventListener('pointerleave', () => {
                sun.style.setProperty('--sun-shift-x', '0px');
                sun.style.setProperty('--sun-shift-y', '0px');
                sun.style.setProperty('--sun-rotate', '0deg');
            });

            sun.addEventListener('pointerdown', (event) => {
                const bounds = sun.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'sun-ripple';
                ripple.style.left = `${event.clientX - bounds.left}px`;
                ripple.style.top = `${event.clientY - bounds.top}px`;
                sun.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
            });
        }

        const serviceVisual = document.querySelector('[data-service-visual]');
        const serviceOrb = document.querySelector('[data-service-orb]');

        if (serviceVisual && serviceOrb) {
            serviceVisual.addEventListener('pointermove', (event) => {
                const bounds = serviceVisual.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                serviceOrb.style.setProperty('--orb-shift-x', `${x * 16}px`);
                serviceOrb.style.setProperty('--orb-shift-y', `${y * 13}px`);
            });

            serviceVisual.addEventListener('pointerleave', () => {
                serviceOrb.style.setProperty('--orb-shift-x', '0px');
                serviceOrb.style.setProperty('--orb-shift-y', '0px');
            });
        }

        document.querySelectorAll('.service-card').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const bounds = card.getBoundingClientRect();
                card.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
                card.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
            });
        });

        const ambientOrb = document.querySelector('[data-ambient-orb]');
        if (ambientOrb && finePointer) {
            let pointerX = -300;
            let pointerY = -300;
            let pointerFrame = 0;

            document.addEventListener('pointermove', (event) => {
                pointerX = event.clientX;
                pointerY = event.clientY;
                ambientOrb.classList.add('is-visible');

                if (pointerFrame) return;
                pointerFrame = window.requestAnimationFrame(() => {
                    ambientOrb.style.transform = `translate3d(${pointerX - 110}px, ${pointerY - 110}px, 0)`;
                    pointerFrame = 0;
                });
            }, { passive: true });

            document.documentElement.addEventListener('mouseleave', () => {
                ambientOrb.classList.remove('is-visible');
            });
        }
    }
});
