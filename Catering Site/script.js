document.addEventListener('DOMContentLoaded', function() {
    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px,5px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px,-6px)' : '';
    });

    navLinks.forEach(link => link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }));

    // --- Smooth Scroll ---
    navLinks.forEach(link => link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({top: target.offsetTop - 80, behavior: 'smooth'});
        }
    }));

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        highlightActiveNav();
        heroParallax();
    });

    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if(scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                if(navLink) navLink.classList.add('active');
            }
        });
    }

    // --- Hero Parallax ---
    function heroParallax() {
        const hero = document.querySelector('.hero');
        if(hero && window.innerWidth > 768){
            hero.style.transform = `translateY(${window.scrollY * 0.5}px)`;
        }
    }

    // --- Menu Tabs ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => btn.addEventListener('click', function() {
        const target = this.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(target).classList.add('active');
    }));

    // --- Form Handling ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = new FormData(this);
        const obj = Object.fromEntries(data.entries());
        if(validateForm(obj)) {
            showNotification('Thank you! Your inquiry has been submitted.', 'success');
            contactForm.reset();
        }
    });

    function validateForm(data){
        const required = ['name','phone','email','eventType','message'];
        for(let f of required){
            if(!data[f] || data[f].trim() === ''){
                showNotification(`Please fill in the ${f} field.`, 'error');
                return false;
            }
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showNotification('Please enter a valid email.', 'error'); return false;
        }
        if(!/^[+]?\d{10,}$/.test(data.phone.replace(/\s|-/g,''))){
            showNotification('Please enter a valid phone number.', 'error'); return false;
        }
        return true;
    }

    function showNotification(msg,type){
        const existing = document.querySelector('.notification');
        if(existing) existing.remove();
        const n = document.createElement('div');
        n.className = `notification notification-${type}`;
        n.textContent = msg;
        n.style.cssText = `position:fixed;top:20px;right:20px;padding:1rem 2rem;color:#fff;background:${type==='success'?'#4CAF50':'#f44336'};border-radius:5px;z-index:10000;animation:slideInRight 0.3s ease;`;
        document.body.appendChild(n);
        setTimeout(()=>{ n.style.animation='slideOutRight 0.3s ease'; setTimeout(()=>n.remove(),300); },5000);
    }

    // --- Gallery Modal ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="modal-close">&times;</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        document.body.style.overflow='hidden';
        modal.querySelector('.modal-close').addEventListener('click', ()=>{ modal.remove(); document.body.style.overflow=''; });
        modal.querySelector('.modal-backdrop').addEventListener('click', e=>{ if(e.target===modal.querySelector('.modal-backdrop')) { modal.remove(); document.body.style.overflow=''; } });
    }));

    // --- Fade-in Animations ---
    const fadeEls = document.querySelectorAll('.service-card, .menu-item, .gallery-item, .about-content');
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry => { if(entry.isIntersecting){ entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; } });
    }, {threshold:0.1});
    fadeEls.forEach(el=>{ el.style.opacity='0'; el.style.transform='translateY(30px)'; observer.observe(el); });

    // --- Lazy Loading Images ---
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries, obs)=>{
        entries.forEach(entry => { if(entry.isIntersecting){ const img = entry.target; img.src=img.dataset.src; obs.unobserve(img); } });
    });
    imgs.forEach(i=>imgObserver.observe(i));

    // --- CTA Popup ---
    setTimeout(()=>{ showBookingPopup(); }, 7000);
    function showBookingPopup(){
        const popup = document.createElement('div');
        popup.className='booking-popup';
        popup.innerHTML=`<div class="popup-content"><h3>Book Ibrahim Catering Now!</h3><p>Serving Thanjavur's finest Mutton Biryani 🍛</p><a href="#contact" class="btn btn-primary">Book Now</a><span class="popup-close">&times;</span></div>`;
        document.body.appendChild(popup);
        document.body.style.overflow='hidden';
        popup.querySelector('.popup-close').addEventListener('click', ()=>{ popup.remove(); document.body.style.overflow=''; });
    }

    // --- Hover Effect Service Cards ---
    document.querySelectorAll('.service-card').forEach(c=>{
        c.addEventListener('mouseenter',()=>{ c.style.transform='translateY(-10px) scale(1.03)'; });
        c.addEventListener('mouseleave',()=>{ c.style.transform='translateY(0) scale(1)'; });
    });

    console.log('Ibrahim Catering enhanced website loaded!');
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    navToggle.addEventListener('click', function() { navMenu.classList.toggle('active'); });
    navLinks.forEach(link => { link.addEventListener('click', () => navMenu.classList.remove('active')); });

    // Smooth scroll
    navLinks.forEach(link => { 
        link.addEventListener('click', function(e){ 
            e.preventDefault(); 
            document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
        }); 
    });

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b=>b.classList.remove('active'));
            tabContents.forEach(c=>c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        alert('Thank you! We will contact you soon.');
        contactForm.reset();
    });

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img=>{
        img.addEventListener('click', ()=>{
            const modal = document.createElement('div');
            modal.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;justify-content:center;align-items:center;z-index:10000;";
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.style.cssText="max-width:90%;max-height:90%;border-radius:10px;";
            modal.appendChild(modalImg);
            modal.addEventListener('click', ()=> modal.remove());
            document.body.appendChild(modal);
        });
    });
});
