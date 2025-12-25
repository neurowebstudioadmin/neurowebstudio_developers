// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header && window.scrollY > 50) {
        header.classList.add('scrolled');
    } else if (header) {
        header.classList.remove('scrolled');
    }
});

// Shopping Cart System
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('neurowebCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('neurowebCart', JSON.stringify(cart));
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <h4>${item.service}</h4>
                    <p>€ ${item.price}</p>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        if (cartTotalPrice) {
            cartTotalPrice.textContent = `€ ${total}`;
        }
    }
    
    saveCart();
}

// Add to cart functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart') || e.target.closest('.select-package')) {
        const button = e.target.closest('.add-to-cart') || e.target.closest('.select-package');
        const service = button.getAttribute('data-service');
        const price = parseInt(button.getAttribute('data-price'));
        
        cart.push({ service, price });
        updateCart();
        
        // Show success message
        alert(`${service} aggiunto al carrello!`);
    }
    
    // Remove item from cart
    if (e.target.closest('.remove-item')) {
        const button = e.target.closest('.remove-item');
        const index = parseInt(button.getAttribute('data-index'));
        
        cart.splice(index, 1);
        updateCart();
    }
});

// Modal functionality
const modal = document.getElementById('cart-modal');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShopping = document.getElementById('continue-shopping');
const closeModal = document.querySelector('.close-modal');

// Show cart modal
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart') || e.target.closest('.select-package')) {
        if (modal) {
            modal.classList.add('open');
        }
    }
    
    // Close modal
    if (e.target === modal || e.target.closest('.close-modal') || e.target === continueShopping) {
        if (modal) {
            modal.classList.remove('open');
        }
    }
});

// Checkout with Stripe (simulation)
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Il carrello è vuoto!');
            return;
        }
        
        // In a real implementation, this would redirect to Stripe checkout
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        alert(`Stai per essere reindirizzato al checkout. Totale: € ${total}\n\nNota: Questa è una demo. In un'implementazione reale, questo pulsante reindirizzerebbe a Stripe.`);
        
        // Reset cart after checkout
        cart = [];
        updateCart();
        if (modal) {
            modal.classList.remove('open');
        }
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const service = contactForm.querySelector('select').value;
        const message = contactForm.querySelector('textarea').value;
        
        // In a real application, you would send this data to a server
        alert(`Grazie ${name}! La tua richiesta per "${service}" è stata inviata. Ti contatteremo a ${email} al più presto.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip for external links or empty href
        if (href === '#' || href.startsWith('http')) return;
        
        e.preventDefault();
        
        const targetId = href;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize skill bars with 0 width
document.querySelectorAll('.skill-progress').forEach(bar => {
    bar.style.width = '0%';
});

// Animate skill bars when scrolling to about section
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('#about');
if (aboutSection) {
    observer.observe(aboutSection);
}

// Add current year to copyright
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright p');
    
    copyrightElements.forEach(element => {
        if (element.innerHTML.includes('2023')) {
            element.innerHTML = element.innerHTML.replace('2023', year);
        }
    });
    
    // Initialize cart
    loadCart();
    updateCart();
    
    // Add animation to service cards on scroll
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        serviceObserver.observe(card);
    });
});