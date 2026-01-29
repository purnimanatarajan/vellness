document.addEventListener('DOMContentLoaded', () => {
    console.log('Vellness Static Site Loaded');

    // --- Cursor Follower Logic ---
    const cursor = document.getElementById('cursor-follower');

    // Spring Animation Variables
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Physics constants for spring effect (tuned to match Framer Motion)
    const springStrength = 0.1; // Lower is "looser", higher is "tighter"
    const drag = 0.8; // Friction

    let velocityX = 0;
    let velocityY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Calculate distance
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;

        // Apply spring force
        velocityX += distX * springStrength;
        velocityY += distY * springStrength;

        // Apply drag (friction)
        velocityX *= drag;
        velocityY *= drag;

        // Update position
        cursorX += velocityX;
        cursorY += velocityY;

        // Apply transform
        if (cursor) {
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(animateCursor);
    }

    if (cursor) animateCursor();


    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if we don't want toggle behavior
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedSelectors = [
        '.feature-item',
        '.collage-item',
        '.brand-logo',
        '.tech-content',
        '.scroll-animate'
    ];

    const animatedElements = document.querySelectorAll(animatedSelectors.join(', '));
    animatedElements.forEach(el => observer.observe(el));


    // --- Circular Carousel Logic ---
    const carouselContainer = document.getElementById('circular-carousel');
    if (carouselContainer) {
        const carouselItems = carouselContainer.querySelectorAll('.carousel-item');
        const itemCount = carouselItems.length;
        let currentIndex = 0;

        function updateCarousel() {
            carouselItems.forEach((item, index) => {
                // Calculate "diff" logic from React
                // diff = (index - currentIndex + length) % length
                // if diff > length/2 diff -= length

                let diff = (index - currentIndex + itemCount) % itemCount;
                if (diff > itemCount / 2) diff -= itemCount;

                const caption = item.querySelector('.carousel-caption');
                if (caption) caption.classList.remove('active');

                // Apply styles based on diff
                if (diff === 0) {
                    // Center Item
                    item.style.transform = 'translate(0%, 0%) scale(1.2) rotate(0deg)';
                    item.style.zIndex = '10';
                    item.style.opacity = '1';
                    item.style.boxShadow = '0 40px 80px rgba(0,0,0,0.3)';
                    item.style.display = 'block';
                    if (caption) caption.classList.add('active');
                } else if (diff === 1 || diff === -3) {
                    // Right Item
                    item.style.transform = 'translate(60%, 20%) scale(0.85) rotate(15deg)';
                    item.style.zIndex = '5';
                    item.style.opacity = '0.9';
                    item.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                    item.style.display = 'block';
                } else if (diff === -1 || diff === 3) {
                    // Left Item
                    item.style.transform = 'translate(-60%, 20%) scale(0.85) rotate(-15deg)';
                    item.style.zIndex = '5';
                    item.style.opacity = '0.9';
                    item.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                    item.style.display = 'block';
                } else {
                    // Others (Hidden)
                    item.style.transform = 'translate(0%, 0%) scale(0.5) rotate(0deg)';
                    item.style.zIndex = '0';
                    item.style.opacity = '0';
                    item.style.display = 'none';
                }
            });
        }

        // Initial update
        updateCarousel();

        // Auto rotation
        setInterval(() => {
            currentIndex = (currentIndex + 1) % itemCount;
            updateCarousel();
        }, 4000);
    }

    // --- Floating CTA Logic ---
    const floatingCTA = document.getElementById('floating-cta');
    if (floatingCTA) {
        // Reveal after a slight delay
        setTimeout(() => {
            floatingCTA.classList.add('visible');
        }, 1000);

        floatingCTA.addEventListener('click', () => {
            const footer = document.querySelector('footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
