function triggerConfetti() {
    const colors = ['#6B1A2A', '#C9957A', '#C4973A'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.setProperty('--duration', (2 + Math.random() * 1) + 's');
        confetti.style.setProperty('--delay', Math.random() * 0.3 + 's');
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

window.triggerConfetti = triggerConfetti;
