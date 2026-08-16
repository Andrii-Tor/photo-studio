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
const overlay = document.createElement('div');
overlay.className = 'mobile-overlay';
document.body.appendChild(overlay);

function closeMobileMenu() {
    document.querySelectorAll('.dropdown-content').forEach(menu => {
        menu.classList.remove('show-mobile-drop');
    });
    overlay.classList.remove('show-overlay');
    document.body.style.overflow = '';
}

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
            if (content.parentNode !== document.body) {
                content.id = 'mobile-rooms-modal';
                document.body.appendChild(content);
                content.classList.add('mobile-modal-moved');
                
                const header = document.createElement('div');
                header.className = 'mobile-menu-header';
                header.innerHTML = '<span>Оберіть зал:</span><button class="close-mobile-menu">×</button>';
                content.insertBefore(header, content.firstChild);
                
                header.querySelector('.close-mobile-menu').addEventListener('click', closeMobileMenu);
            }
            
            const isOpening = !content.classList.contains('show-mobile-drop');
            closeMobileMenu();
            
            if (isOpening) {
                content.classList.add('show-mobile-drop');
                overlay.classList.add('show-overlay');
                document.body.style.overflow = 'hidden';
            }
        }
    }
};

// =========================================
// 3. СЛАЙДЕР
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
// 4. GOOGLE КАЛЕНДАР
// =========================================
function updateCalendarView() {
    const cal = document.getElementById('gcal');
    if (!cal) return;

    const baseUrl = "https://calendar.google.com/calendar/embed?src=studiophotowave%40gmail.com&ctz=Europe%2FKiev";
    
    if (window.innerWidth < 800) {
        if (!cal.src.includes("mode=AGENDA")) {
            cal.src = baseUrl + "&mode=AGENDA&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0"; 
        }
    } else {
        if (cal.src.includes("mode=AGENDA") || cal.src === "") {
            cal.src = baseUrl;
        }
    }
}

document.addEventListener("DOMContentLoaded", updateCalendarView);
window.addEventListener("resize", updateCalendarView);

// =========================================
// 5. LIGHTBOX ЗІ СТРІЛОЧКАМИ ПЕРЕМИКАННЯ
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const lbModal = document.createElement('div');
    lbModal.className = 'lightbox-modal';
    lbModal.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <button class="lightbox-arrow lb-prev">&#10094;</button>
        <img class="lightbox-img" src="" alt="Photo">
        <button class="lightbox-arrow lb-next">&#10095;</button>
    `;
    document.body.appendChild(lbModal);

    const lbImg = lbModal.querySelector('.lightbox-img');
    const lbClose = lbModal.querySelector('.lightbox-close');
    const prevBtn = lbModal.querySelector('.lb-prev');
    const nextBtn = lbModal.querySelector('.lb-next');

    let currentImages = [];
    let currentIndex = 0;

    function showPhoto(index) {
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;
        currentIndex = index;
        lbImg.src = currentImages[currentIndex].src;
    }

    // Клік по будь-якому фото в галереї
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && e.target.closest('main')) {
            currentImages = Array.from(document.querySelectorAll('main img'));
            currentIndex = currentImages.indexOf(e.target);
            if (currentIndex !== -1) {
                showPhoto(currentIndex);
                lbModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPhoto(currentIndex - 1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showPhoto(currentIndex + 1); });

    function closeLb() {
        lbModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    lbClose.addEventListener('click', closeLb);
    lbModal.addEventListener('click', function(e) {
        if (e.target === lbModal) closeLb();
    });

    document.addEventListener('keydown', function(e) {
        if (!lbModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
        if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });

    let touchStartX = 0;
    lbModal.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, {passive: true});
    lbModal.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) showPhoto(currentIndex + 1);
        if (touchEndX - touchStartX > 50) showPhoto(currentIndex - 1);
    });
});

// =========================================
// 6. ВІДПРАВКА ФОРМИ В TELEGRAM
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById('f1');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправка...';

        const name = document.getElementById('clientName').value;
        let phone = document.getElementById('clientPhone').value;
        const comment = document.getElementById('clientComment').value;

        const pageSource = document.title.replace('Фотостудія WAVE — ', ''); 
        const finalComment = `${comment}\n\n📌 Джерело: ${pageSource}`;

        if (phone.trim().startsWith('+') && !phone.trim().startsWith('+38')) {
            phone = phone.trim();
        } else {
            let cleaned = phone.replace(/\D/g, '');
            if (cleaned.length === 12 && cleaned.startsWith('380')) {
                phone = `+38 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
            } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
                phone = `+38 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
            } else {
                phone = cleaned.startsWith('380') ? `+${cleaned}` : (cleaned.length > 0 ? `+38${cleaned}` : phone);
            }
        }
        
        const requestData = {
            name: name,
            phone: phone,
            comment: finalComment
        };

        fetch('https://wavestudio-api.onrender.com/api/Booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if(response.ok) {
                alert('Заявка успішно відправлена, з вами зв\'яжуться найближчим часом.');
                bookingForm.reset(); 
            } else {
                alert('Помилка відправки на сервер.');
            }
        })
        .catch(error => {
            alert('Помилка з\'єднання із сервером.');
            console.error('Fetch error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Надіслати заявку ➔';
        });
    });
});

// =========================================
// 7. АВТОЗАПОВНЕННЯ ПОСЛУГИ З URL
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const serviceName = params.get('service');
    const commentField = document.getElementById('clientComment');
    
    if (serviceName && commentField) {
        commentField.value = `Послуга: ${serviceName}. `;
    }
});

// =========================================
// 8. АВТОМАТИЧНЕ ПІДТЯГУВАННЯ ГАЛЕРЕЙ
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.auto-gallery').forEach(gallery => {
        const folder = gallery.dataset.folder;
        const start = parseInt(gallery.dataset.start, 10) || 1;
        const maxCheck = start + 100;
        let missedInRow = 0;

        function tryLoadImage(currentIdx) {
            if (currentIdx > maxCheck || missedInRow > 3) return;

            const img = new Image();
            const src = `${folder}/${currentIdx}.jpg`;

            img.onload = () => {
                missedInRow = 0;
                img.alt = `Фото ${currentIdx}`;
                img.className = 'gallery-photo';
                gallery.appendChild(img);
                tryLoadImage(currentIdx + 1);
            };

            img.onerror = () => {
                missedInRow++;
                tryLoadImage(currentIdx + 1);
            };

            img.src = src;
        }

        tryLoadImage(start);
    });
});