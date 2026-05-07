// Flip Cards Interaction
document.addEventListener('DOMContentLoaded', () => {
    const flipCards = document.querySelectorAll('.flip-card');

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            window.setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        // Also allow clicking on the back to flip back
        card.addEventListener('mouseleave', () => {
            // Optional: uncomment to auto-flip back on mouse leave
            // card.classList.remove('flipped');
        });
    });

    // Prevent link clicks from flipping the card
    document.querySelectorAll('.map-pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});
