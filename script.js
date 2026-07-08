// =========================================
// 1. АНІМАЦІЯ ПОЯВИ ЕЛЕМЕНТІВ (При скролі)
// =========================================
const obs = new IntersectionObserver((es) => {
    es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target); 
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.shw').forEach(el => obs.observe(el));

// =========================================
// 2. ВІДКРИТТЯ ПІДМЕНЮ "ЗАЛИ" НА ТЕЛЕФОНІ (З ОВЕРЛЕЄМ ТА КНОПКОЮ)
// =========================================
// Створюємо захисний темний екран
const overlay = document.createElement('div');
overlay.className = 'mobile-overlay';
document.body.appendChild(overlay);

// Функція закриття
function closeMobileMenu() {
    document.querySelectorAll('.dropdown-content').forEach(menu => {
        menu.classList.remove('show-mobile-drop');
    });
    overlay.classList.remove('show-overlay');
    document.body.style.overflow = ''; // Повертаємо можливість скролити сайт
}

// Закриваємо меню при кліку на темний фон
overlay.addEventListener('click', closeMobileMenu);

window.toggleMobileDrop = function(e) {
    if (window.innerWidth <= 800) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.currentTarget;
        let content = btn.nextElementSibling;
        
        if (!content || !content.classList.contains('dropdown-content')) {
            content = document.getElementById('mobile-rooms-modal');
        }

        if (content) {
            // Переносимо меню в body
            if (content.parentNode !== document.body) {
                content.id = 'mobile-rooms-modal';
                document.body.appendChild(content);
                content.classList.add('mobile-modal-moved');
                
                // Додаємо шапку з кнопкою Х
                const header = document.createElement('div');
                header.className = 'mobile-menu-header';
                header.innerHTML = '<span>Оберіть зал:</span><button class="close-mobile-menu">×</button>';
                content.insertBefore(header, content.firstChild);
                
                // Вішаємо закриття на кнопку Х
                header.querySelector('.close-mobile-menu').addEventListener('click', closeMobileMenu);
            }
            
            const isOpening = !content.classList.contains('show-mobile-drop');
            closeMobileMenu(); // Скидаємо попередній стан
            
            if (isOpening) {
                content.classList.add('show-mobile-drop');
                overlay.classList.add('show-overlay');
                document.body.style.overflow = 'hidden'; // Блокуємо скрол сторінки
            }
        }
    }
};

// =========================================
// 3. СЛАЙДЕР (ТІЛЬКИ РУЧНИЙ СВАЙП)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById("promo-track");
    if (!track) return;

    const slides = track.querySelectorAll(".sld");
    const dots = document.querySelectorAll(".dot");
    
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentDiff = 0;

    function updateSlider(index) {
        if (index >= slides.length) currentIndex = 0;
        else if (index < 0) currentIndex = slides.length - 1;
        else currentIndex = index;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active-dot", i === currentIndex);
        });

        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    window.moveSld = function(dir) { updateSlider(currentIndex + dir); };
    window.goToSld = function(index) { updateSlider(index); };

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentDiff = currentPosition - startPos;
        const offset = -(currentIndex * track.clientWidth) + currentDiff;
        track.style.transform = `translateX(${offset}px)`;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        if (currentDiff < -50) moveSld(1); 
        else if (currentDiff > 50) moveSld(-1); 
        else updateSlider(currentIndex);
        
        currentDiff = 0;
    }

    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });

    track.addEventListener('touchstart', touchStart, {passive: true});
    track.addEventListener('touchmove', touchMove, {passive: true});
    track.addEventListener('touchend', touchEnd);

    track.addEventListener('dragstart', (e) => e.preventDefault());
    track.style.cursor = 'grab';
});