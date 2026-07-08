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
// 2. ВІДКРИТТЯ ПІДМЕНЮ "ЗАЛИ" НА ТЕЛЕФОНІ
// =========================================
window.toggleMobileDrop = function(e) {
    if (window.innerWidth <= 800) {
        e.preventDefault();
        const dropdown = e.currentTarget.closest('.dropdown');
        if (dropdown) {
            const content = dropdown.querySelector('.dropdown-content');
            document.querySelectorAll('.dropdown-content').forEach(menu => {
                if (menu !== content) menu.classList.remove('show-mobile-drop');
            });
            content.classList.toggle('show-mobile-drop');
        }
    }
};

document.addEventListener('click', function(e) {
    if (window.innerWidth <= 800) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(menu => {
                menu.classList.remove('show-mobile-drop');
            });
        }
    }
});

// =========================================
// 3. СЛАЙДЕР (МОНОЛІТНИЙ ЯК У GT RACER, 12 СЕКУНД)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById("promo-track");
    if (!track) return;

    const slides = track.querySelectorAll(".sld");
    const dots = document.querySelectorAll(".dot");
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Для свайпу мишкою та пальцем
    let isDragging = false;
    let startPos = 0;
    let currentDiff = 0;

    // Головна функція, яка рухає весь блок плавно
    function updateSlider(index) {
        if (index >= slides.length) currentIndex = 0;
        else if (index < 0) currentIndex = slides.length - 1;
        else currentIndex = index;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active-dot", i === currentIndex);
        });

        // Плавна анімація (easing як у дорогих сайтах)
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Для кнопок ❮ ❯
    window.moveSld = function(dir) {
        updateSlider(currentIndex + dir);
        resetAutoSlide();
    };

    // Для точок
    window.goToSld = function(index) {
        updateSlider(index);
        resetAutoSlide();
    };

    // Таймер 12 секунд
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => { moveSld(1); }, 12000); 
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // --- ОБРОБКА СВАЙПІВ (МИШКА + ТЕЛЕФОН) ---
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.style.transition = 'none'; // Вимикаємо плавність, щоб картинка "прилипла" до курсора
        track.style.cursor = 'grabbing';
        clearInterval(autoSlideInterval);
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentDiff = currentPosition - startPos;
        
        // Рухаємо трек за курсором в реальному часі
        const offset = -(currentIndex * track.clientWidth) + currentDiff;
        track.style.transform = `translateX(${offset}px)`;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        // Якщо протягнули картинку більше ніж на 50px, міняємо слайд
        if (currentDiff < -50) {
            moveSld(1); // Вліво
        } else if (currentDiff > 50) {
            moveSld(-1); // Вправо
        } else {
            updateSlider(currentIndex); // Відскок назад, якщо потягнули слабо
        }
        
        currentDiff = 0;
        startAutoSlide();
    }

    // Події для мишки (ПК)
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });

    // Події для сенсора (Телефон)
    track.addEventListener('touchstart', touchStart, {passive: true});
    track.addEventListener('touchmove', touchMove, {passive: true});
    track.addEventListener('touchend', touchEnd);

    // Забороняємо стандартне виділення картинок браузером
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // Старт
    track.style.cursor = 'grab';
    startAutoSlide();
});