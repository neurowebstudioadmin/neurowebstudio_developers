// Service filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const serviceCards = document.querySelectorAll('.service-detailed-card');

if (categoryButtons.length > 0 && serviceCards.length > 0) {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            serviceCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

if (searchInput && searchButton) {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    
    serviceCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.service-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('h3');
    
    question.addEventListener('click', () => {
        // Toggle active class
        item.classList.toggle('active');
        
        // Toggle content visibility
        const answer = item.querySelector('p');
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
            answer.style.marginTop = '15px';
        } else {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.marginTop = '0';
        }
    });
    
    // Initialize FAQ items
    const answer = item.querySelector('p');
    answer.style.transition = 'all 0.3s ease';
    answer.style.overflow = 'hidden';
    answer.style.maxHeight = '0';
    answer.style.opacity = '0';
});

// Load cart system from main script
document.addEventListener('DOMContentLoaded', () => {
    // Check if cart functions exist from main script
    if (typeof loadCart === 'function') {
        loadCart();
    }
    if (typeof updateCart === 'function') {
        updateCart();
    }
    
    // Smooth scroll to specific service from URL hash
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }, 500);
    }
});