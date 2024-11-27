// Theme Toggle Functionality
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeToggleIcon = document.querySelector('#theme-toggle i');
    themeToggleIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const themeToggleIcon = document.querySelector('#theme-toggle i');
    themeToggleIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Modal Functionality
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.classList.add('fadeIn');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function showLoginModal() {
    showModal('login-modal');
}

function showSignupModal() {
    showModal('signup-modal');
}

function showForgotPassword() {
    closeModal('login-modal');
    showModal('forgot-password-modal');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Project Card Generation
function createProjectCard(project) {
    return `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <span class="price">$${project.price}</span>
                <button class="buy-btn" onclick="initiatePayment(${project.price}, '${project.title}')">
                    Buy Now
                </button>
            </div>
        </div>
    `;
}

// Load Featured Projects
function loadFeaturedProjects() {
    const projects = [
        {
            title: "Web Development Project",
            description: "Build a full-stack web application",
            price: 49.99,
            image: "images/project1.jpg"
        },
        {
            title: "Mobile App Development",
            description: "Create a cross-platform mobile app",
            price: 59.99,
            image: "images/project2.jpg"
        },
        {
            title: "E-commerce Platform",
            description: "Build an online store",
            price: 69.99,
            image: "images/project3.jpg"
        },
        {
            title: "Blog Platform",
            description: "Create a content management system",
            price: 39.99,
            image: "images/project4.jpg"
        },
        {
            title: "Portfolio Website",
            description: "Design a professional portfolio",
            price: 29.99,
            image: "images/project5.jpg"
        },
        {
            title: "Social Media Dashboard",
            description: "Build a social media analytics platform",
            price: 79.99,
            image: "images/project6.jpg"
        },
        {
            title: "Task Management App",
            description: "Create a productivity application",
            price: 44.99,
            image: "images/project7.jpg"
        },
        {
            title: "Chat Application",
            description: "Build a real-time chat platform",
            price: 54.99,
            image: "images/project8.jpg"
        }
    ];

    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid) {
        projectGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
    }
}

// Coupon Code Functionality
const coupons = {
    'WELCOME10': 10,
    'SPECIAL20': 20,
    'FLASH50': 50
};

function applyCoupon(code, price) {
    if (coupons[code]) {
        const discount = (price * coupons[code]) / 100;
        return price - discount;
    }
    return price;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadFeaturedProjects();
    
    // Close button functionality for all modals
    const closeButtons = document.getElementsByClassName('close');
    for (let button of closeButtons) {
        button.onclick = function() {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        }
    }
});

// Handle form submissions
document.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    
    if (form.id === 'login-form') {
        // Handle login form submission
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        // Here you would typically make an API call to your backend
        console.log('Login attempt:', { email, password });
    }
});

// Error Handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Success Handling
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}