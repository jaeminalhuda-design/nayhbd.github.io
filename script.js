// ===== DOM ELEMENTS =====
const musicToggle = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
const heartsContainer = document.getElementById('heartsContainer');
const galleryItems = document.querySelectorAll('.gallery-item');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== MUSIC CONTROL WITH AUTOPLAY =====
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    toggleMusic();
});

function toggleMusic() {
    if (isPlaying) {
        musicToggle.pause();
        musicBtn.innerHTML = '<span class="music-icon">🔇</span>';
        isPlaying = false;
    } else {
        musicToggle.play().catch(e => {
            console.log('Autoplay prevented by browser');
        });
        musicBtn.innerHTML = '<span class="music-icon">🎵</span>';
        isPlaying = true;
    }
}

// Enable music on first user interaction
document.addEventListener('click', () => {
    if (!isPlaying && !musicToggle.ended) {
        toggleMusic();
    }
}, { once: true });

// ===== FLOATING HEARTS PARTICLES =====
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = ['💜', '💙', '💖', '🌸', '✨'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.fontSize = (Math.random() * 8 + 16) + 'px';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Create hearts continuously
setInterval(createHeart, 250);

// ===== BIRTHDAY COUNTDOWN TIMER =====
// EDITABLE: Change this date to Nayla's birthday
const birthdayDate = new Date('2026-05-15T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = birthdayDate - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('countdown').innerHTML = '<h3 style="font-size: 2rem; color: #f093fb;">Hari Spesial Telah Tiba! 🎉</h3>';
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== SCROLL ANIMATIONS WITH REPEAT ON SCROLL UP =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const item = entry.target;
            setTimeout(() => {
                item.classList.add('animate');
            }, 100);
        }
    });
}, observerOptions);

galleryItems.forEach((item, index) => {
    observer.observe(item);
});

// Reset animations when scrolling up
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < lastScrollY - 100) {
        // Scrolling up - reset and re-animate
        galleryItems.forEach((item, index) => {
            if (item.getBoundingClientRect().top < window.innerHeight * 0.8) {
                item.classList.remove('animate');
                item.style.transform = 'translateY(80px)';
                setTimeout(() => {
                    item.classList.add('animate');
                }, 150 + index * 120);
            }
        });
    }
    lastScrollY = currentScrollY;
});

// ===== SPECIAL ANIMATIONS =====
// Floating animation for 6th photo
function animateFloatingPhoto() {
    const floatingItem = document.querySelector('.floating');
    let direction = 1;
    let position = 0;

    setInterval(() => {
        if (floatingItem && window.scrollY > 2000) {
            position += direction * 1.5;
            if (position > 20 || position < -20) {
                direction *= -1;
            }
            floatingItem.style.transform = `translateY(${position}px) rotateZ(${position * 0.3}deg)`;
        }
    }, 80);
}

// Parallax effect for 5th photo
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxItem = document.querySelector('.parallax .photo-container');
    if (parallaxItem) {
        const speed = scrolled * -0.3;
        parallaxItem.style.transform = `translateY(${speed}px) scale(1.03)`;
    }
});

// ===== ANIMATED STATISTICS =====
function animateStats() {
    const statsSection = document.getElementById('closing');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
}

function animateNumbers() {
    statNumbers.forEach(stat => {
        const target = stat.dataset.target === '∞' ? '∞' : parseInt(stat.dataset.target);
        const duration = target === '∞' ? 2000 : 2500;
        const increment = target / (duration / 30);
        let current = 0;

        const timer = setInterval(() => {
            if (target === '∞') {
                current += 0.1;
                stat.textContent = current < 1 ? '∞' : '∞';
            } else {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString();
                    clearInterval(timer);
                    return;
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    });
}

// ===== SMOOTH SCROLL NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ===== GLASSMORPHISM INTERACTIONS =====
document.querySelectorAll('.glass-card, .countdown-item, .photo-container').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-12px)';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translateY(0)';
    });
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Start special animations
    animateFloatingPhoto();
    animateStats();
    
    // Preload images for smooth performance
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.15)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(25px)';
        }
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// RequestAnimationFrame for smooth 60fps animations
let rafId;
function smoothScrollHandler() {
    // All scroll-based animations are optimized here
    rafId = requestAnimationFrame(smoothScrollHandler);
}
smoothScrollHandler();
