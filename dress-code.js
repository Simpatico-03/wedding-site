// Dress Code Swatches Interaction
document.addEventListener('DOMContentLoaded', () => {
    const swatches = document.querySelectorAll('.swatch');
    
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Close details when clicking outside
    document.addEventListener('click', () => {
        // Details will close naturally via hover state
    });
});
