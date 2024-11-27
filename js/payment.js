// Razorpay Configuration
const razorpayConfig = {
    key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay key
    currency: 'INR',
    name: 'Projecta',
    description: 'Project Purchase',
    image: 'images/logo.png',
    theme: {
        color: '#6366f1'
    }
};

// Convert USD to INR (simplified for demo)
function convertToINR(usdAmount) {
    const conversionRate = 75; // Example conversion rate
    return Math.round(usdAmount * conversionRate * 100); // Convert to paise
}

// Handle Payment Initiation
function initiatePayment(amount, projectTitle) {
    if (!currentUser) {
        showLoginModal();
        showError('Please sign in to make a purchase');
        return;
    }

    // Show coupon input modal
    showCouponModal(amount, projectTitle);
}

// Show Coupon Modal
function showCouponModal(amount, projectTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'coupon-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('coupon-modal')">&times;</span>
            <h2>Apply Coupon</h2>
            <form id="coupon-form">
                <input type="text" id="coupon-code" placeholder="Enter coupon code (optional)">
                <button type="submit" class="primary-btn">Proceed to Payment</button>
            </form>
            <div class="price-breakdown">
                <p>Original Price: $${amount}</p>
                <p id="discount-amount" style="display: none;">Discount: -$<span></span></p>
                <p id="final-price">Final Price: $${amount}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    showModal('coupon-modal');
    
    // Handle coupon form submission
    const couponForm = document.getElementById('coupon-form');
    couponForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const couponCode = document.getElementById('coupon-code').value;
        processCouponAndPayment(amount, projectTitle, couponCode);
    });
}

// Process Coupon and Initialize Payment
function processCouponAndPayment(amount, projectTitle, couponCode) {
    let finalAmount = amount;
    
    if (couponCode && coupons[couponCode]) {
        const discount = (amount * coupons[couponCode]) / 100;
        finalAmount = amount - discount;
        
        // Update price breakdown
        document.getElementById('discount-amount').style.display = 'block';
        document.getElementById('discount-amount').querySelector('span').textContent = discount.toFixed(2);
        document.getElementById('final-price').textContent = `Final Price: $${finalAmount.toFixed(2)}`;
    }
    
    // Convert amount to INR (paise)
    const amountInPaise = convertToINR(finalAmount);
    
    // Initialize Razorpay payment
    const options = {
        ...razorpayConfig,
        amount: amountInPaise,
        prefill: {
            name: currentUser.name,
            email: currentUser.email
        },
        handler: function(response) {
            handlePaymentSuccess(response, projectTitle, finalAmount);
        }
    };
    
    const rzp = new Razorpay(options);
    
    rzp.on('payment.failed', function(response) {
        handlePaymentFailure(response);
    });
    
    closeModal('coupon-modal');
    rzp.open();
}

// Handle Successful Payment
function handlePaymentSuccess(response, projectTitle, amount) {
    // Store purchase details
    const purchase = {
        projectTitle,
        amount,
        paymentId: response.razorpay_payment_id,
        purchaseDate: new Date().toISOString(),
        status: 'completed'
    };
    
    // Store in localStorage (in a real app, this would be stored in a database)
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    // Update UI
    showSuccess('Payment successful! You can now access the project.');
    updatePurchaseHistory();
    
    // Redirect to the project page
    setTimeout(() => {
        window.location.href = `pages/my-purchases.html`;
    }, 2000);
}

// Handle Failed Payment
function handlePaymentFailure(response) {
    showError('Payment failed. Please try again.');
    console.error('Payment failed:', response.error);
}

// Update Purchase History
function updatePurchaseHistory() {
    const purchaseHistoryContainer = document.getElementById('purchase-history');
    if (!purchaseHistoryContainer) return;
    
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    
    if (purchases.length === 0) {
        purchaseHistoryContainer.innerHTML = '<p>No purchases yet.</p>';
        return;
    }
    
    const purchasesList = purchases.map(purchase => `
        <div class="purchase-card">
            <h3>${purchase.projectTitle}</h3>
            <p>Amount: $${purchase.amount}</p>
            <p>Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}</p>
            <p>Status: ${purchase.status}</p>
            <p>Payment ID: ${purchase.paymentId}</p>
            <button class="primary-btn" onclick="continueProject('${purchase.projectTitle}')">
                Continue Learning
            </button>
        </div>
    `).join('');
    
    purchaseHistoryContainer.innerHTML = purchasesList;
}

// Continue Project
function continueProject(projectTitle) {
    // In a real application, this would load the project content
    window.location.href = `pages/project-content.html?title=${encodeURIComponent(projectTitle)}`;
}

// Verify Payment (would be done server-side in a real application)
function verifyPayment(paymentId, orderId, signature) {
    // This is a simplified version. In a real application, 
    // verification would be done on the server side
    return true;
}

// Initialize payment-related features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    
    // Update purchase history if on the relevant page
    updatePurchaseHistory();
});