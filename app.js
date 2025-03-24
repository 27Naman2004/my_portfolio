// Initialize the portfolio when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations and functionality
    initializePortfolio();
});

function initializePortfolio() {
    // Navigation functionality
    setupNavigation();

    // Typing animation for hero section
    initTypeAnimation();

    // Project filter functionality
    initProjectFilters();

    // Skills progress animation on scroll
    setupSkillsProgress();

    // Timeline animation
    showTimelineItems();
    window.addEventListener('scroll', showTimelineItems);

    // Initialize AOS animation library
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
    });

    // Contact form validation and submission
    setupContactForm();

    // PDF Modal functionality
    setupPdfModal();
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Active navigation based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });

            // If mobile menu is open, close it after clicking
            if (document.querySelector('.mobile-nav-toggle').classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    mobileNavToggle.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navigation = document.querySelector('.navigation');

    mobileNavToggle.classList.toggle('active');
    navigation.classList.toggle('active');
}

// Typing animation for hero section
function initTypeAnimation() {
    const typed = document.querySelector('.typed');
    if (typed) {
        let typed_strings = typed.getAttribute('data-typed-items');
        typed_strings = typed_strings.split(',');

        let currentStringIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentString = typed_strings[currentStringIndex];

            if (isDeleting) {
                typed.textContent = currentString.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                typed.textContent = currentString.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100; // Normal speed when typing
            }

            // If word is complete
            if (!isDeleting && currentCharIndex === currentString.length) {
                typingSpeed = 1500; // Pause at the end
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentStringIndex = (currentStringIndex + 1) % typed_strings.length;
                typingSpeed = 500; // Pause before typing next
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing animation
        setTimeout(type, 1000);
    }
}

// Project filter functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length) {
        const projectItems = document.querySelectorAll('.project-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Filter projects
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.add('show');
                        }, 50);
                    } else {
                        item.classList.remove('show');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Skills progress animation on scroll
function setupSkillsProgress() {
    const skillsSection = document.querySelector('#skills');
    const progressBars = document.querySelectorAll('.progress-bar');

    if (!skillsSection || !progressBars.length) return;

    function showProgress() {
        progressBars.forEach(progressBar => {
            const value = progressBar.dataset.progress;
            progressBar.style.opacity = 1;
            progressBar.style.width = `${value}%`;
        });
    }

    function hideProgress() {
        progressBars.forEach(p => {
            p.style.opacity = 0;
            p.style.width = 0;
        });
    }

    window.addEventListener('scroll', () => {
        const sectionPos = skillsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos) {
            showProgress();
        } else {
            hideProgress();
        }
    });
}

// Timeline animation
function showTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;

        if (itemTop < triggerBottom) {
            item.classList.add('show');
        }
    });
}

// Contact form validation and submission
function setupContactForm() {
    const contactForm = document.querySelector('#contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic form validation
            const nameInput = document.querySelector('#name');
            const emailInput = document.querySelector('#email');
            const messageInput = document.querySelector('#message');
            let isValid = true;

            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                removeError(nameInput);
            }

            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else {
                removeError(messageInput);
            }

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                // Simulate server response (would be replaced with actual AJAX in production)
                setTimeout(() => {
                    // Show success message
                    document.querySelector('.contact-message').classList.add('visible');

                    // Reset form
                    contactForm.reset();

                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        document.querySelector('.contact-message').classList.remove('visible');
                    }, 5000);
                }, 1500);
            }
        });
    }
}

function showError(input, message) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message') || document.createElement('small');

    if (!formControl.querySelector('.error-message')) {
        errorElement.classList.add('error-message');
        formControl.appendChild(errorElement);
    }

    errorElement.textContent = message;
    formControl.classList.add('error');
}

function removeError(input) {
    const formControl = input.parentElement;
    formControl.classList.remove('error');

    const errorElement = formControl.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// PDF Modal functionality
function setupPdfModal() {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfIframe = document.getElementById('pdf-iframe');
    const closeModal = document.querySelector('.close-modal');
    const resumeLinks = document.querySelectorAll('#resume-btn, #resume-btn-hero, #resume-btn-footer');

    // Open PDF modal when clicking on resume links
    resumeLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Show the modal
            pdfModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });

    // Close modal when clicking the × button
    closeModal.addEventListener('click', function () {
        pdfModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function (e) {
        if (e.target === pdfModal) {
            pdfModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
}
