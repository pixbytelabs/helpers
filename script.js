// Helpers.ae Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initForms();
    initPriceCalculator();
    initGoogleMaps();
    initScrollEffects();
    initDatePicker();
    initTestimonialsCarousel();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // CTA button scrolling
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        if (btn.textContent.includes('Book')) {
            btn.addEventListener('click', function() {
                document.querySelector('.booking-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });

    // Get Free Quote buttons
    const quoteButtons = document.querySelectorAll('.btn-secondary');
    quoteButtons.forEach(btn => {
        if (btn.textContent.includes('Quote')) {
            btn.addEventListener('click', function() {
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
}

// Form handling
function initForms() {
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Validate form
    if (!validateForm(form)) {
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success modal
        showSuccessModal();
        
        // Reset form
        form.reset();
        updatePriceDisplay('Select service type and frequency to see estimated pricing');
        
        // Reset button
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;

        // Save to localStorage for persistence
        saveFormData('booking', new FormData(form));
    }, 2000);
}

// Contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Validate form
    if (!validateForm(form)) {
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success modal
        showSuccessModal();
        
        // Reset form
        form.reset();
        
        // Reset button
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;

        // Save to localStorage for persistence
        saveFormData('contact', new FormData(form));
    }, 2000);
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const value = field.value.trim();
        
        // Remove previous error styling
        field.style.borderColor = '';
        
        if (!value) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(value)) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields correctly.');
    }

    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Success modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('show');
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });
    }
}

// Price calculator
function initPriceCalculator() {
    const serviceSelect = document.getElementById('service-type');
    const frequencySelect = document.getElementById('frequency');

    if (serviceSelect && frequencySelect) {
        serviceSelect.addEventListener('change', calculatePrice);
        frequencySelect.addEventListener('change', calculatePrice);
    }
}

function calculatePrice() {
    const serviceSelect = document.getElementById('service-type');
    const frequencySelect = document.getElementById('frequency');
    
    if (!serviceSelect || !frequencySelect) return;

    const serviceType = serviceSelect.value;
    const frequency = frequencySelect.value;

    if (!serviceType || !frequency) {
        updatePriceDisplay('Select service type and frequency to see estimated pricing');
        return;
    }

    // Price ranges based on service type
    const prices = {
        'residential': { min: 150, max: 300 },
        'commercial': { min: 200, max: 500 },
        'deep': { min: 300, max: 600 },
        'move': { min: 250, max: 450 }
    };

    // Frequency discounts
    const discounts = {
        'one-time': 0,
        'weekly': 0.10,
        'bi-weekly': 0.05,
        'monthly': 0
    };

    const basePrice = prices[serviceType];
    const discount = discounts[frequency];

    if (basePrice) {
        const minPrice = Math.round(basePrice.min * (1 - discount));
        const maxPrice = Math.round(basePrice.max * (1 - discount));
        
        let priceText = `AED ${minPrice} - ${maxPrice}`;
        
        if (discount > 0) {
            const discountPercent = Math.round(discount * 100);
            priceText += ` (${discountPercent}% discount applied!)`;
        }
        
        updatePriceDisplay(priceText);
    }
}

function updatePriceDisplay(text) {
    const priceDisplay = document.getElementById('price-display');
    if (priceDisplay) {
        priceDisplay.textContent = text;
    }
}

// Date picker initialization
function initDatePicker() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];

        // Set maximum date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Fade in animation for cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    const animatedElements = document.querySelectorAll('.service-card, .benefit-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize maps without Google API
function initGoogleMaps() {
    initEmbeddedMaps();
}

function initEmbeddedMaps() {
    const serviceMap = document.getElementById('map');
    const businessMap = document.getElementById('business-map');
    
    // Service areas map - Shows UAE overview using Google Maps embed (no API key required)
    if (serviceMap) {
        serviceMap.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1827018.2059219596!2d53.86727555!3d24.299947599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e48dfb1ab12bd%3A0x33d32f56c0080aa7!2sUnited%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1645123456789!5m2!1sen!2sae"
                style="width: 100%; height: 100%; border: 0; border-radius: 12px;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="UAE Service Areas">
            </iframe>
        `;
    }
    
    // Business location map - Shows Dubai specifically using Google Maps embed
    if (businessMap) {
        businessMap.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6882396749!2d54.897846!3d25.276987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1645123456789!5m2!1sen!2sae"
                style="width: 100%; height: 100%; border: 0; border-radius: 12px;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Dubai Business Location">
            </iframe>
        `;
    }
}

// Local storage for form persistence
function saveFormData(formType, formData) {
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem(`helpers_ae_${formType}_data`, JSON.stringify(data));
}

function loadFormData(formType) {
    const saved = localStorage.getItem(`helpers_ae_${formType}_data`);
    return saved ? JSON.parse(saved) : null;
}

// Service card interactions
document.addEventListener('DOMContentLoaded', function() {
    const learnMoreButtons = document.querySelectorAll('.btn-outline');
    
    learnMoreButtons.forEach(btn => {
        if (btn.textContent.includes('Learn More')) {
            btn.addEventListener('click', function() {
                // Scroll to booking section
                document.querySelector('.booking-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Pre-select the service type based on the card
                const serviceCard = btn.closest('.service-card');
                const serviceTitle = serviceCard.querySelector('.service-title').textContent;
                const serviceSelect = document.getElementById('service-type');
                
                if (serviceSelect) {
                    let serviceValue = '';
                    if (serviceTitle.includes('Residential')) serviceValue = 'residential';
                    else if (serviceTitle.includes('Commercial')) serviceValue = 'commercial';
                    else if (serviceTitle.includes('Deep')) serviceValue = 'deep';
                    else if (serviceTitle.includes('Move')) serviceValue = 'move';
                    
                    if (serviceValue) {
                        serviceSelect.value = serviceValue;
                        calculatePrice(); // Update price display
                    }
                }
            });
        }
    });
});

// Add loading animation to page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add smooth reveal animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Handle form input focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add focused class if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Testimonials Carousel
function initTestimonialsCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    
    // Update carousel position
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play carousel
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                if (currentSlide === totalSlides - 1) {
                    goToSlide(0); // Reset to first slide
                } else {
                    nextSlide();
                }
            }, 5000);
        });
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize
    updateCarousel();
}

// Error handling for Google Maps
window.addEventListener('error', function(e) {
    if (e.message.includes('Google') || e.message.includes('maps')) {
        console.log('Google Maps failed to load. Showing placeholder.');
        const maps = document.querySelectorAll('.map');
        maps.forEach(map => {
            map.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6c757d; font-size: 1.1rem;"><i class="fas fa-map-marker-alt" style="margin-right: 0.5rem;"></i>Interactive Map Loading...</div>';
        });
    }
});