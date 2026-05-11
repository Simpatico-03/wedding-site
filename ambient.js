// Ambient Effects - Music Toggle & Time-of-Day Background

// Music Toggle with Vinyl Record
const audioContext = null;
let isPlaying = false;
let musicAudio = null;

function initMusicToggle() {
    // Create floating music toggle button
    const musicToggle = document.createElement('div');
    musicToggle.id = 'music-toggle';
    musicToggle.innerHTML = `
        <button id="vinyl-record" class="vinyl-record" title="Toggle Music">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="M12 4v2M12 18v2M4 12h2M18 12h2"></path>
            </svg>
        </button>
    `;
    document.body.appendChild(musicToggle);
    
    const vinylBtn = document.getElementById('vinyl-record');
    
    vinylBtn.addEventListener('click', () => {
        if (!isPlaying) {
            playMusic();
            vinylBtn.classList.add('spinning');
        } else {
            pauseMusic();
            vinylBtn.classList.remove('spinning');
        }
    });
}

function playMusic() {
    // Optional: Add background music playback
    // Using a simple beep/chime for now
    isPlaying = true;
}

function pauseMusic() {
    isPlaying = false;
}

// Time-of-Day Background Shift
function updateBackgroundByTime() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 5 && hour < 12) {
        // Morning: Ivory
        body.style.setProperty('--time-bg', 'rgba(247, 242, 234, 0.95)');
    } else if (hour >= 12 && hour < 17) {
        // Afternoon: Warm gold
        body.style.setProperty('--time-bg', 'rgba(245, 237, 220, 0.95)');
    } else if (hour >= 17 && hour < 21) {
        // Evening: Warm burgundy
        body.style.setProperty('--time-bg', 'rgba(230, 210, 190, 0.95)');
    } else {
        // Night: Deep burgundy-charcoal
        body.style.setProperty('--time-bg', 'rgba(75, 60, 50, 0.95)');
    }
}

// Confetti Animation
function triggerConfetti() {
    const colors = ['#6B1A2A', '#C9957A', '#C4973A']; // burgundy, blush, gold
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.setProperty('--duration', (2 + Math.random() * 1) + 's');
        confetti.style.setProperty('--delay', Math.random() * 0.3 + 's');
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initMusicToggle();
    updateBackgroundByTime();
    
    // Update background every hour
    setInterval(updateBackgroundByTime, 3600000);
});

// Export confetti trigger for RSVP form
window.triggerConfetti = triggerConfetti;
