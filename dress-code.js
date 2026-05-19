document.addEventListener('DOMContentLoaded', () => {
    const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    /* Build dot + tooltip markup for every .hs element */
    document.querySelectorAll('.hs').forEach(hs => {
        const n     = hs.dataset.n     || '';
        const label = hs.dataset.label || '';
        const sub   = hs.dataset.sub   || '';

        hs.innerHTML = `
            <div class="hs-dot"></div>
            <div class="hs-tip">
                <span class="hs-tip-label">${label}</span>
                <span class="hs-tip-sub">${sub}</span>
            </div>`;

        hs.setAttribute('aria-label', `${n}: ${label} — ${sub}`);
        hs.setAttribute('tabindex', '0');
        hs.setAttribute('role', 'button');
    });

    /* Per-image-column activation */
    document.querySelectorAll('.dc-img-col').forEach(col => {
        const hotspots = col.querySelectorAll('.hs');
        let active = null;

        function light(hs) {
            if (active && active !== hs) dim(active);
            active = hs;
            hs.classList.add('is-lit');
            col.classList.add('is-active');
        }

        function dim(hs) {
            hs.classList.remove('is-lit');
            if (active === hs) active = null;
            if (!col.querySelector('.hs.is-lit')) col.classList.remove('is-active');
        }

        hotspots.forEach(hs => {
            if (!isTouch()) {
                hs.addEventListener('mouseenter', () => light(hs));
                hs.addEventListener('mouseleave', () => dim(hs));
                hs.addEventListener('focus',      () => light(hs));
                hs.addEventListener('blur',       () => dim(hs));
            } else {
                hs.addEventListener('touchstart', e => {
                    e.preventDefault();
                    hs.classList.contains('is-lit') ? dim(hs) : light(hs);
                }, { passive: false });
            }
        });
    });

    /* Tap outside on touch to close any open hotspot */
    document.addEventListener('touchstart', e => {
        if (!e.target.closest('.hs')) {
            document.querySelectorAll('.hs.is-lit').forEach(hs => {
                hs.classList.remove('is-lit');
                const col = hs.closest('.dc-img-col');
                if (col) col.classList.remove('is-active');
            });
        }
    });
});
