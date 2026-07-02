// obs
const obs = new IntersectionObserver((es) => {
    es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target); 
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.shw').forEach(el => obs.observe(el));

// sld
let sId = 0;
const slds = document.querySelectorAll('.sld');
function moveSld(n) {
    if(slds.length === 0) return;
    slds[sId].classList.remove('vis-sld');
    sId = (sId + n + slds.length) % slds.length;
    slds[sId].classList.add('vis-sld');
}

// frm
const form = document.getElementById('f1');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Заявка прийнята! Далі буде налаштовано Telegram-бота.');
    });
}