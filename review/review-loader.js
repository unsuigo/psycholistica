(() => {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const isExplicitReview = params.get('review') === '1';
    const isLocalReviewPackage = window.location.protocol === 'file:';
    if ((!isExplicitReview && !isLocalReviewPackage) || window.__psycholisticaReviewLoader) return;

    window.__psycholisticaReviewLoader = true;
    document.documentElement.classList.add('client-review-loading');

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'review/review.css';
    stylesheet.dataset.reviewAsset = 'styles';
    document.head.appendChild(stylesheet);

    const script = document.createElement('script');
    script.src = 'review/review.js';
    script.defer = true;
    script.dataset.reviewAsset = 'script';
    (document.body || document.documentElement).appendChild(script);
})();
