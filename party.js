// Wedding Party Cards Interaction
document.addEventListener('DOMContentLoaded', () => {
    const partyCards = document.querySelectorAll('.party-card');
    
    partyCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});
