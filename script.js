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
        e.stopPropagation(); // МАГІЯ: Блокуємо зайві кліки, щоб меню не зникало
        
        const dropdown = e.currentTarget.closest('.dropdown');
        if (dropdown) {
            const content = dropdown.querySelector('.dropdown-content');
            
            // Закриваємо всі інші відкриті меню
            document.querySelectorAll('.dropdown-content').forEach(menu => {
                if (menu !== content) menu.classList.remove('show-mobile-drop');
            });
            
            content.classList.toggle('show-mobile-drop');
        }
    }
};

// Закриття меню при кліку будь-де на сайті (окрім самого меню)
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 800) {
        if (!e.target.closest('.dropdown-content') && !e.target.closest('.dropbtn')) {
            document.querySelectorAll('.dropdown-content').forEach(menu => {
                menu.classList.remove('show-mobile-drop');
            });
        }
    }
});

// =========================================
// 3. СЛАЙДЕР (ТІЛЬКИ РУЧНИЙ СВАЙП ЯК ТИ ПРОСИВ)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById("promo-track");
    if (!track) return;

    const slides = track.querySelectorAll(".sld");
    const dots = document.querySelectorAll(".dot");
    
    let currentIndex = 0;
    
    // Змінні для фізичного свайпу
    let isDragging = false;
    let startPos = 0;
    let currentDiff = 0;

    // Головна функція переміщення треку
    function updateSlider(index) {
        if (index >= slides.length) currentIndex = 0;
        else if (index < 0) currentIndex = slides.length - 1;
        else currentIndex = index;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active-dot", i === currentIndex);
        });

        // Плавний доїзд картинки
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Для кнопок ❮ ❯
    window.moveSld = function(dir) {
        updateSlider(currentIndex + dir);
    };

    // Для точок
    window.goToSld = function(index) {
        updateSlider(index);
    };

    // --- ОБРОБКА СВАЙПІВ (МИШКА + ТЕЛЕФОН) ---
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.style.transition = 'none'; // Вимикаємо плавність, картинка липне до курсора
        track.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentDiff = currentPosition - startPos;
        
        // Рухаємо в реальному часі
        const offset = -(currentIndex * track.clientWidth) + currentDiff;
        track.style.transform = `translateX(${offset}px)`;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        // Міняємо слайд, якщо протягнули достатньо
        if (currentDiff < -50) {
            moveSld(1); 
        } else if (currentDiff > 50) {
            moveSld(-1); 
        } else {
            updateSlider(currentIndex); // Відскок назад
        }
        currentDiff = 0;
    }

    // Слухачі для ПК
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });

    // Слухачі для телефону
    track.addEventListener('touchstart', touchStart, {passive: true});
    track.addEventListener('touchmove', touchMove, {passive: true});
    track.addEventListener('touchend', touchEnd);

    // Заборона стандартного виділення
    track.addEventListener('dragstart', (e) => e.preventDefault());

    track.style.cursor = 'grab';
});