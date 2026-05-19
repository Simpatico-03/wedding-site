(function () {
    var TIER_KEY = 'wedding_tier';
    var CODES = { nearanddear: 'vip', RichaKarun26: 'standard' };

    /* Inject VIP visibility CSS immediately */
    var vipStyle = document.createElement('style');
    vipStyle.textContent =
        '.vip-only { display: none !important; }\n' +
        'body.tier-vip .vip-only { display: block !important; }';
    document.head.appendChild(vipStyle);

    function applyTier(tier) {
        if (tier === 'vip') document.body.classList.add('tier-vip');
    }

    /* Already authenticated this session — apply tier and exit */
    var stored = sessionStorage.getItem(TIER_KEY);
    if (stored) {
        applyTier(stored);
        return;
    }

    /* ── Gate styles ── */
    var gateStyle = document.createElement('style');
    gateStyle.textContent = [
        '#site-gate {',
        '  position: fixed; inset: 0; z-index: 9999;',
        '  background: #f7f2ea;',
        '  display: flex; align-items: center; justify-content: center;',
        '  font-family: \'Jost\', \'Helvetica Neue\', sans-serif;',
        '  transition: opacity 0.55s ease;',
        '}',
        '#site-gate.gate-fade { opacity: 0; pointer-events: none; }',
        '.gate-inner {',
        '  text-align: center; padding: 48px 32px;',
        '  max-width: 440px; width: 100%;',
        '}',
        '.gate-logo {',
        '  width: 88px; height: auto;',
        '  display: block; margin: 0 auto 18px;',
        '}',
        '.gate-divider {',
        '  width: 180px; height: auto;',
        '  display: block; margin: 0 auto 26px;',
        '  opacity: 0.82;',
        '}',
        '.gate-names {',
        '  font-family: \'Cormorant Garamond\', Georgia, serif;',
        '  font-style: italic; font-weight: 400;',
        '  font-size: clamp(36px, 6vw, 52px);',
        '  color: #6b1a2a; margin: 0 0 6px; line-height: 1.1;',
        '}',
        '.gate-names span { color: #c4973a; }',
        '.gate-date {',
        '  font-size: 11px; letter-spacing: 0.24em;',
        '  text-transform: uppercase; color: #7a6450;',
        '  font-weight: 300; margin: 0 0 40px;',
        '}',
        '.gate-prompt {',
        '  font-size: 14px; color: #7a6450;',
        '  font-weight: 300; margin: 0 0 22px; line-height: 1.65;',
        '}',
        '.gate-input-wrap {',
        '  display: flex; max-width: 300px; margin: 0 auto;',
        '  border: 1px solid rgba(196,151,58,0.45);',
        '  border-radius: 100px; overflow: hidden;',
        '  background: #fff;',
        '  transition: border-color 0.2s;',
        '}',
        '.gate-input-wrap:focus-within { border-color: rgba(196,151,58,0.85); }',
        '#gate-input {',
        '  flex: 1; border: none; background: transparent;',
        '  padding: 13px 20px;',
        '  font-family: \'Jost\', \'Helvetica Neue\', sans-serif;',
        '  font-size: 14px; font-weight: 400;',
        '  color: #2a1a0a; outline: none; letter-spacing: 0.04em;',
        '}',
        '#gate-input::placeholder { color: #b0967a; font-weight: 300; }',
        '#gate-submit {',
        '  border: none; background: transparent;',
        '  padding: 13px 18px; cursor: pointer;',
        '  color: #c4973a; font-size: 19px;',
        '  line-height: 1; transition: color 0.2s; display: flex;',
        '  align-items: center;',
        '}',
        '#gate-submit:hover { color: #8c6418; }',
        '@keyframes gate-shake {',
        '  0%,100% { transform: translateX(0); }',
        '  20%,60%  { transform: translateX(-7px); }',
        '  40%,80%  { transform: translateX(7px); }',
        '}',
        '.gate-input-wrap.shake {',
        '  animation: gate-shake 0.4s ease;',
        '  border-color: rgba(139,0,0,0.38);',
        '}',
    ].join('\n');
    document.head.appendChild(gateStyle);

    /* ── Build gate overlay ── */
    var gate = document.createElement('div');
    gate.id = 'site-gate';
    gate.innerHTML =
        '<div class="gate-inner">' +
        '  <img src="assets/WeddingLogo.png" alt="R &amp; K" class="gate-logo">' +
        '  <img src="assets/GoldDivider.png" alt="" class="gate-divider" aria-hidden="true">' +
        '  <h1 class="gate-names">Richa <span>&amp;</span> Karun</h1>' +
        '  <p class="gate-date">20 August 2026</p>' +
        '  <p class="gate-prompt">Enter your invitation code to continue</p>' +
        '  <div class="gate-input-wrap" id="gate-wrap">' +
        '    <input type="text" id="gate-input" placeholder="Invitation code" autocomplete="off" spellcheck="false">' +
        '    <button id="gate-submit" aria-label="Submit">&#8594;</button>' +
        '  </div>' +
        '</div>';
    document.body.appendChild(gate);

    function tryCode() {
        var val = document.getElementById('gate-input').value.trim();
        var tier = CODES[val];
        if (tier) {
            sessionStorage.setItem(TIER_KEY, tier);
            applyTier(tier);
            gate.classList.add('gate-fade');
            setTimeout(function () { gate.remove(); }, 650);
        } else {
            var wrap = document.getElementById('gate-wrap');
            wrap.classList.remove('shake');
            void wrap.offsetWidth;
            wrap.classList.add('shake');
            setTimeout(function () { wrap.classList.remove('shake'); }, 450);
        }
    }

    document.getElementById('gate-submit').addEventListener('click', tryCode);
    document.getElementById('gate-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') tryCode();
    });
})();
