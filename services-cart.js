// Services Configurator - Cart Management System

// Cart State
const cart = {
    section: 'music', // 'music' | 'video' |  'academy'
    planType: 'original', // 'original' | 'cover' (for music)
    selectedServices: [], // Array of { id, name, section }
    packageType: null // 'basic' | 'standard' | 'custom'
};

// DOM Elements
const sectionTabs = document.querySelectorAll('.section-tab');
const sectionContents = document.querySelectorAll('.section-content');
const cartItemsContainer = document.getElementById('cart-items');
const cartSectionName = document.getElementById('cart-section-name');
const cartPlanDisplay = document.getElementById('cart-plan-display');
const cartPlanType = document.getElementById('cart-plan-type');
const cartPackageDisplay = document.getElementById('cart-package-display');
const cartPackageName = document.getElementById('cart-package-name');
const orderBtn = document.getElementById('order-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupSectionTabs();
    setupPackageButtons();
    setupCustomExpandButtons();
    setupPlanTypeSelectors();
    setupServiceCheckboxes();
    setupServiceRadios();
    setupSelectAllCheckboxes();
    setupCartButtons();
});

// ========== Section Tab Switching ==========
function setupSectionTabs() {
    sectionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.getAttribute('data-section');
            switchSection(targetSection);
        });
    });
}

function switchSection(sectionName) {
    // Update tabs
    sectionTabs.forEach(tab => {
        if (tab.getAttribute('data-section') === sectionName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update content
    sectionContents.forEach(content => {
        if (content.id === `${sectionName}-section`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Update cart section
    cart.section = sectionName;
    cartSectionName.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

    // Hide cart for Academy section (Academy uses direct enrollment)
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) {
        if (sectionName === 'academy') {
            cartPanel.style.display = 'none';
        } else {
            cartPanel.style.display = 'block';
        }
    }

    // Clear cart when switching sections
    clearCart();
}

// ========== Package Button Handlers ==========
function setupPackageButtons() {
    const packageBtns = document.querySelectorAll('.package-btn:not(.expand-custom-btn)');

    packageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const packageType = btn.getAttribute('data-package');
            const section = btn.getAttribute('data-section');
            selectPackage(packageType, section);
        });
    });
}

function selectPackage(packageType, section) {
    cart.packageType = packageType;
    cart.section = section;
    cart.selectedServices = [];

    // Populate cart with package details
    const packageName = packageType.charAt(0).toUpperCase() + packageType.slice(1);
    cart.selectedServices.push({
        id: `${section}-${packageType}-package`,
        name: `${packageName} Package (${section})`,
        section: section
    });

    cartPackageName.textContent = `${packageName} (${section})`;
    cartPackageDisplay.style.display = 'block';
    cartPlanDisplay.style.display = 'none';

    updateCartUI();
}

// ========== Custom Package Expand Buttons ==========
function setupCustomExpandButtons() {
    const expandMusicBtn = document.getElementById('expand-music-custom');
    const expandVideoBtn = document.getElementById('expand-video-custom');
    const musicExpander = document.getElementById('music-custom-expander');
    const videoExpander = document.getElementById('video-custom-expander');

    if (expandMusicBtn && musicExpander) {
        expandMusicBtn.addEventListener('click', () => {
            if (musicExpander.style.display === 'none' || musicExpander.style.display === '') {
                musicExpander.style.display = 'block';
                expandMusicBtn.textContent = 'Hide Custom Options';
                cart.packageType = 'custom';
                cart.section = 'music';
                cartPackageName.textContent = 'Custom (music)';
                cartPackageDisplay.style.display = 'block';
                cartPlanDisplay.style.display = 'block';
            } else {
                musicExpander.style.display = 'none';
                expandMusicBtn.textContent = 'Configure Custom Package';
            }
        });
    }

    if (expandVideoBtn && videoExpander) {
        expandVideoBtn.addEventListener('click', () => {
            if (videoExpander.style.display === 'none' || videoExpander.style.display === '') {
                videoExpander.style.display = 'block';
                expandVideoBtn.textContent = 'Hide Custom Options';
                cart.packageType = 'custom';
                cart.section = 'video';
                cartPackageName.textContent = 'Custom (video)';
                cartPackageDisplay.style.display = 'block';
                cartPlanDisplay.style.display = 'none';

                // Clear music services when switching to video custom
                cart.selectedServices = cart.selectedServices.filter(s => s.section === 'video');
                updateCartUI();
            } else {
                videoExpander.style.display = 'none';
                expandVideoBtn.textContent = 'Configure Custom Package';
            }
        });
    }
}

// ========== Plan Type Selectors ==========
function setupPlanTypeSelectors() {
    const planOptions = document.querySelectorAll('.plan-option');

    planOptions.forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            if (!radio) return;

            radio.checked = true;
            cart.planType = radio.value;

            // Update active class
            planOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update cart display
            cartPlanType.textContent = radio.value === 'original' ? 'Original Song' : 'Cover Song';

            // Show/Hide Songwriting & Composition section based on plan type
            toggleSongwritingSection(radio.value);
        });
    });
}

// Toggle Songwriting & Composition category visibility
function toggleSongwritingSection(planType) {
    // Find the Songwriting & Composition category in the music section
    const musicSection = document.getElementById('music-custom-expander');
    if (!musicSection) return;

    const songwritingCategories = musicSection.querySelectorAll('.service-category');

    songwritingCategories.forEach(category => {
        const categoryTitle = category.querySelector('.category-title');
        if (categoryTitle && categoryTitle.textContent.includes('Songwriting & Composition')) {
            if (planType === 'cover') {
                // Hide the category
                category.style.display = 'none';

                // Uncheck and remove songwriting services from cart
                const songwritingCheckboxes = category.querySelectorAll('.service-checkbox');
                songwritingCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        const serviceId = checkbox.getAttribute('data-service');
                        removeFromCart(serviceId);
                    }
                });
            } else {
                // Show the category for original songs
                category.style.display = 'block';
            }
        }
    });
}

// ========== Service Radio Buttons (for Music Arrangement) ==========
function setupServiceRadios() {
    const serviceRadios = document.querySelectorAll('.service-radio');

    serviceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const serviceId = radio.getAttribute('data-service');
                const serviceName = radio.getAttribute('data-name');
                const serviceSection = radio.getAttribute('data-section');
                const radioName = radio.getAttribute('name');

                // Remove other radio selections from the same group from cart
                const sameGroupRadios = document.querySelectorAll(`input[name="${radioName}"]`);
                sameGroupRadios.forEach(otherRadio => {
                    if (otherRadio !== radio) {
                        const otherId = otherRadio.getAttribute('data-service');
                        removeFromCart(otherId);
                    }
                });

                // Add the selected radio to cart
                addToCart(serviceId, serviceName, serviceSection);
            }
        });
    });
}

// ========== Select All Checkboxes ==========
function setupSelectAllCheckboxes() {
    const selectAllCheckboxes = document.querySelectorAll('.select-all-checkbox');

    selectAllCheckboxes.forEach(selectAll => {
        selectAll.addEventListener('change', () => {
            const category = selectAll.getAttribute('data-category');
            const section = selectAll.getAttribute('data-section');

            // Find all checkboxes in the same category
            const categoryCheckboxes = document.querySelectorAll(
                `.service-checkbox[data-category="${category}"][data-section="${section}"]:not(:disabled)`
            );

            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;

                const serviceId = checkbox.getAttribute('data-service');
                const serviceName = checkbox.getAttribute('data-name');

                if (selectAll.checked) {
                    addToCart(serviceId, serviceName, section);
                } else {
                    removeFromCart(serviceId);
                }
            });
        });
    });
}

// ========== Service Checkbox Handlers ==========
function setupServiceCheckboxes() {
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox');

    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const serviceId = checkbox.getAttribute('data-service');
            const serviceName = checkbox.getAttribute('data-name');
            const serviceSection = checkbox.getAttribute('data-section');

            if (checkbox.checked) {
                addToCart(serviceId, serviceName, serviceSection);
            } else {
                removeFromCart(serviceId);
            }
        });
    });
}

// ========== Cart Management Functions ==========
function addToCart(serviceId, serviceName, section) {
    // Check if service already in cart
    if (cart.selectedServices.find(s => s.id === serviceId)) {
        return;
    }

    // Remove package selection if adding custom services
    if (cart.packageType !== 'custom') {
        cart.selectedServices = [];
        cart.packageType = 'custom';
        cartPackageName.textContent = `Custom (${section})`;
        cartPackageDisplay.style.display = 'block';
    }

    cart.selectedServices.push({
        id: serviceId,
        name: serviceName,
        section: section
    });

    updateCartUI();
}

function removeFromCart(serviceId) {
    cart.selectedServices = cart.selectedServices.filter(s => s.id !== serviceId);

    // Uncheck the checkbox
    const checkbox = document.querySelector(`[data-service="${serviceId}"]`);
    if (checkbox && !checkbox.disabled) {
        checkbox.checked = false;
    }

    updateCartUI();
}

function clearCart() {
    cart.selectedServices = [];
    cart.packageType = null;
    cart.planType = 'original';

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.service-checkbox:not(:disabled)');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide expanders
    const expanders = document.querySelectorAll('.custom-expander');
    expanders.forEach(expander => {
        expander.style.display = 'none';
    });

    // Reset expand buttons
    const expandBtns = document.querySelectorAll('.expand-custom-btn');
    expandBtns.forEach(btn => {
        btn.textContent = 'Configure Custom Package';
    });

    cartPackageDisplay.style.display = 'none';
    cartPlanDisplay.style.display = 'none';

    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';

    if (cart.selectedServices.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">No services selected yet. Choose a package or configure a custom selection.</p>';
        orderBtn.disabled = true;
        clearCartBtn.style.display = 'none';
        return;
    }

    // Show services in cart
    cart.selectedServices.forEach(service => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
      <span>${service.name}</span>
      <button class="cart-remove-btn" data-id="${service.id}" title="Remove">Ã—</button>
    `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Enable order button
    orderBtn.disabled = false;
    clearCartBtn.style.display = 'block';

    // Setup remove buttons
    setupCartRemoveButtons();
}

function setupCartRemoveButtons() {
    const removeBtns = document.querySelectorAll('.cart-remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceId = btn.getAttribute('data-id');
            removeFromCart(serviceId);
        });
    });
}

// ========== Cart Action Buttons ==========
function setupCartButtons() {
    // Order Now button
    if (orderBtn) {
        orderBtn.addEventListener('click', orderViaWhatsApp);
    }

    // Clear Cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
}

function generateWhatsAppMessage() {
    let message = `Hi! I'd like to order the following from Ayush Studio:\n\n`;
    message += `ðŸ“ Section: ${cart.section.charAt(0).toUpperCase() + cart.section.slice(1)}\n`;

    if (cart.packageType) {
        message += `ðŸ“¦ Package: ${cart.packageType.charAt(0).toUpperCase() + cart.packageType.slice(1)}\n`;
    }

    if (cart.section === 'music' && cart.packageType === 'custom') {
        message += `ðŸŽµ Plan Type: ${cart.planType === 'original' ? 'Original Song' : 'Cover Song'}\n`;
    }

    message += `\nðŸ’¼ Selected Services:\n`;
    cart.selectedServices.forEach((service, index) => {
        message += `${index + 1}. ${service.name}\n`;
    });

    message += `\nPlease provide me with a quote for these services. Thank you!`;

    return encodeURIComponent(message);
}

function orderViaWhatsApp() {
    if (cart.selectedServices.length === 0) {
        alert('Please select at least one service before ordering.');
        return;
    }

    const message = generateWhatsAppMessage();
    // TODO: Replace with actual WhatsApp Business number
    const whatsappNumber = '91XXXXXXXXXX'; // Replace with real number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');

    // Optional: Clear cart after order
    // clearCart();
}

// ========== Save/Load Cart (Optional - LocalStorage) ==========
function saveCartToLocalStorage() {
    localStorage.setItem('ayush-studio-cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('ayush-studio-cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        Object.assign(cart, parsedCart);
        updateCartUI();

        // Re-check the checkboxes
        cart.selectedServices.forEach(service => {
            const checkbox = document.querySelector(`[data-service="${service.id}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

// Uncomment to enable cart persistence
// window.addEventListener('load', loadCartFromLocalStorage);
// window.addEventListener('beforeunload', saveCartToLocalStorage);
