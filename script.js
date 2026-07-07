// Анімація появи елементів при прокручуванні (IntersectionObserver)
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
// ЛОГІКА СЛАЙДЕРА (ЖИВИЙ СВАЙП + АВТОПРОКРУТКА)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById("promo-track");
    if (!track) return;

    const slides = track.querySelectorAll(".sld");
    const dots = document.querySelectorAll(".dot");
    let autoSlideInterval;

    // Оновлення активної точки, коли ми скролимо пальцем
    track.addEventListener("scroll", () => {
        let index = Math.round(track.scrollLeft / track.clientWidth);
        dots.forEach((dot, i) => {
            dot.classList.toggle("active-dot", i === index);
        });
    });

    // Функція для кнопок-стрілочок ❮ ❯
    window.moveSld = function(dir) {
        let index = Math.round(track.scrollLeft / track.clientWidth);
        let newIndex = index + dir;
        
        // Зациклення (якщо останній -> на перший)
        if (newIndex >= slides.length) newIndex = 0;
        if (newIndex < 0) newIndex = slides.length - 1;
        
        goToSld(newIndex);
    };

    // Перехід на конкретний слайд (по кліку на точку)
    window.goToSld = function(index) {
        track.scrollTo({
            left: index * track.clientWidth,
            behavior: "smooth"
        });
        resetAutoSlide(); // Скидаємо таймер, щоб він не спрацював відразу після нашого кліку
    };

    // Автоматична прокрутка (кожні 5 секунд)
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            moveSld(1);
        }, 5000); 
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Зупиняємо автопрокрутку, коли користувач тримає палець на екрані
    track.addEventListener("touchstart", () => clearInterval(autoSlideInterval), {passive: true});
    track.addEventListener("touchend", () => startAutoSlide(), {passive: true});

    // Запускаємо
    startAutoSlide();
});