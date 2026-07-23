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

// =========================================
// РОЗУМНИЙ GOOGLE КАЛЕНДАР (АДАПТИВНІСТЬ)
// =========================================
function updateCalendarView() {
    const cal = document.getElementById('gcal');
    if (!cal) return;

    const baseUrl = "https://calendar.google.com/calendar/embed?src=studiophotowave%40gmail.com&ctz=Europe%2FKiev";
    
    // Якщо екран мобільний
    if (window.innerWidth < 800) {
        // Додаємо AGENDA + приховуємо заголовок, друк, вкладки та часовий пояс
        if (!cal.src.includes("mode=AGENDA")) {
            cal.src = baseUrl + "&mode=AGENDA&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0"; 
        }
    } 
    // Якщо екран комп'ютера (повертаємо стандартний вигляд)
    else {
        if (cal.src.includes("mode=AGENDA") || cal.src === "") {
            cal.src = baseUrl;
        }
    }
}

document.addEventListener("DOMContentLoaded", updateCalendarView);
window.addEventListener("resize", updateCalendarView);

// =========================================
// ВІДПРАВКА ФОРМИ В TELEGRAM
// =========================================
document.getElementById('f1').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Відправка...';

    // Збираємо дані
    const name = document.getElementById('clientName').value;
    let phone = document.getElementById('clientPhone').value;
    const comment = document.getElementById('clientComment').value;

    // --- ТУТ МАЄ БУТИ ТВІЙ КОД ФОРМАТУВАННЯ НОМЕРА (+38...) ---
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('380')) {
        phone = `+38 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
        phone = `+38 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    } else {
        phone = cleaned.startsWith('380') ? `+${cleaned}` : `+38${cleaned}`;
    }
    // ---------------------------------------------------------

    // Створюємо об'єкт із даними для C#
    const requestData = {
        name: name,
        phone: phone,
        comment: comment
    };

    // Стукаємо на живий сервер на Render!
    const url = 'https://wavestudio-api.onrender.com/api/Booking'; 

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // Перетворюємо дані у JSON
    })
    .then(response => {
        if(response.ok) {
            alert('Заявка успішно відправлена, з вами зв\'яжуться найближчим часом.');
            document.getElementById('f1').reset(); 
        } else {
            alert('Помилка відправки на сервер.');
        }
    })
    .catch(error => {
        alert('Помилка з\'єднання із сервером. Перевірте підключення до інтернету.');
        console.error('Fetch error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Продовжити';
    });
});