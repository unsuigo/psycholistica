document.addEventListener('DOMContentLoaded', function() {
    // Получаем все ссылки навигации
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section[id]');
    
    // IntersectionObserver для отслеживания активной секции
    const observerOptions = {
        root: null,
        rootMargin: '-90px 0px -50% 0px', // Компенсируем высоту sticky header
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Убираем активный класс со всех ссылок
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Добавляем активный класс к соответствующей ссылке
                const activeLink = document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми секциями
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Обработка кликов по ссылкам навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Если это якорная ссылка
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Плавная прокрутка к секции
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Обработка кликов по карточкам терапии
    const terapieCards = document.querySelectorAll('.terapie-card');
    terapieCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Позволяем переходу произойти естественным образом
            // Никаких preventDefault здесь не нужно
        });
    });
    
    // Обработка клика по кнопке "Zobacz wszystkie terapie"
    const btnMore = document.querySelector('.btn-more');
    if (btnMore) {
        btnMore.addEventListener('click', function(e) {
            // Позволяем переходу произойти естественным образом
        });
    }
    
    // Устанавливаем активную ссылку при загрузке страницы
    function setActiveLinkOnLoad() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.getElementById(hash.substring(1));
            if (targetSection) {
                // Прокручиваем к секции
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }
    
    // Вызываем функцию при загрузке
    setActiveLinkOnLoad();
    
    // Обработка изменения hash в URL
    window.addEventListener('hashchange', function() {
        setActiveLinkOnLoad();
    });
});

// Smart header: hide on scroll down, show on scroll up
(function () {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const THRESH = 80;
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        // тень/фон после порога
        if (y > THRESH) header.classList.add('header--scrolled');
        else header.classList.remove('header--scrolled');

        // спрятать при скролле вниз, показать при скролле вверх
        if (Math.abs(y - lastY) > 5) {
            if (y > lastY && y > THRESH) header.classList.add('header--hidden');
            else header.classList.remove('header--hidden');
            lastY = y;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
})();
