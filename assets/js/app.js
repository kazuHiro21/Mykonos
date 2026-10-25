/* =========================================
   MYKONOS PARFUMS — MAIN APPLICATION
   Interactive single-page experience
   ========================================= */

// --- CONFIG ---
const CONFIG = {
    brand: "MYKONOS",
    currency: "IDR",
    currencySymbol: "Rp",
    social: {
        instagram: "https://instagram.com/mykonosparfums",
        tiktok: "https://tiktok.com/@mykonosparfums",
        whatsapp: "https://wa.me/628123456789"
    },
    locations: ["Indonesia", "Malaysia", "Philippines", "United States"],
    email: "hello@mykonosparfums.com"
};

// --- STATE ---
const state = {
    products: [],
    filtered: [],
    cart: JSON.parse(localStorage.getItem("mykonos_cart")) || [],
    currentFilter: "all",
    featuredShown: 8
};

// --- DOM ELEMENTS ---
const els = {
    navbar: document.getElementById("navbar"),
    navLinks: document.querySelectorAll(".nav-link"),
    mobileBtn: document.getElementById("nav-mobile-btn"),
    navLinksContainer: document.getElementById("nav-links"),
    cartBtn: document.getElementById("nav-cart-btn"),
    cartCount: document.getElementById("cart-count"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartOverlay: document.getElementById("cart-overlay"),
    cartPanel: document.getElementById("cart-panel"),
    cartClose: document.getElementById("cart-close"),
    cartItems: document.getElementById("cart-items"),
    cartFooter: document.getElementById("cart-footer"),
    quickModal: document.getElementById("quick-view-modal"),
    modalOverlay: document.getElementById("modal-overlay"),
    modalClose: document.getElementById("modal-close"),
    modalBody: document.getElementById("modal-body"),
    featuredGrid: document.getElementById("featured-grid"),
    collectionGrid: document.getElementById("collection-grid"),
    collectionCount: document.getElementById("collection-count"),
    filters: document.getElementById("filters"),
    loadMoreBtn: document.getElementById("load-more-btn"),
    categoryGrid: document.getElementById("category-grid"),
    newsletterForm: document.getElementById("newsletter-form"),
    newsletterMessage: document.getElementById("newsletter-message"),
    contactForm: document.getElementById("contact-form"),
    contactMessage: document.getElementById("contact-message")
};

// --- INIT ---
document.addEventListener("DOMContentLoaded", async () => {
    initNav();
    initScrollReveal();
    await loadProducts();
    renderFeatured();
    renderCategories();
    renderCollection();
    setupFilters();
    setupCart();
    setupQuickView();
    setupForms();
    setupSmoothScroll();
    window.addEventListener("scroll", handleScroll);
});

// --- DATA LOADING ---
async function loadProducts() {
    try {
        const res = await fetch("data/products.json");
        state.products = await res.json();
        state.filtered = [...state.products];
    } catch (err) {
        console.error("Failed to load products:", err);
    }
}

// --- RENDERING ---
function createProductCard(p, showQuickView = true) {
    const price = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(p.price_idr);

    const badgeHtml = p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : "";
    const soldHtml = p.status === "sold-out" ? `<span class="badge badge-sold">sold out</span>` : "";
    const inCart = state.cart.some(item => item.id === p.id);
    const btnText = p.status === "sold-out" ? "Sold Out" : (inCart ? "Added" : "Add to Bag");
    const btnDisabled = p.status === "sold-out" || inCart;

    return `
        <a href="#" class="product-card" data-id="${p.id}">
            <div class="product-img-wrap">
                <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='Images and Videos/INCEPTION.png'">
                ${badgeHtml}
                ${soldHtml}
                <div class="product-actions-overlay">
                    <button class="quick-add" title="Quick view" data-id="${p.id}">👁</button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-edition">${p.edition}</span>
                <div class="product-family">${p.family}</div>
                <h3>${p.name}</h3>
                <div class="product-notes">${p.notes.top.join(", ")} • ${p.notes.middle.join(", ")}</div>
                <span class="product-price">${price}</span>
                <button class="product-btn add-to-bag" data-id="${p.id}" ${btnDisabled ? "disabled" : ""}>
                    ${btnText}
                </button>
            </div>
        </a>
    `;
}

function renderFeatured() {
    if (!els.featuredGrid) return;
    const featured = state.products.filter(p => p.badge === "best-seller" || p.badge === "new");
    const shown = featured.slice(0, state.featuredShown);
    els.featuredGrid.innerHTML = shown.map(p => createProductCard(p)).join("");
    attachCardListeners();
}

function renderCollection() {
    if (!els.collectionGrid) return;
    els.collectionGrid.innerHTML = state.filtered.map(p => createProductCard(p)).join("");
    if (els.collectionCount) els.collectionCount.textContent = `${state.filtered.length} scents`;
    attachCardListeners();
}

function renderCategories() {
    if (!els.categoryGrid) return;
    const categories = [
        { name: "Fresh & Aquatic", key: "Fresh & Aquatic" },
        { name: "Citrus", key: "Citrus" },
        { name: "Fruity & Gourmand", key: "Fruity & Gourmand" },
        { name: "Woody & Spicy", key: "Woody & Spicy" },
        { name: "Floral", key: "Floral" },
        { name: "Woody & Vanilla", key: "Woody & Vanilla" },
        { name: "Sunforged Collection", key: "sunforged" },
        { name: "Special Edition", key: "Special Edition" }
    ];
    els.categoryGrid.innerHTML = categories.map(c => `
        <button class="category-tile" data-filter="${c.key}">
            <span class="category-name">${c.name}</span>
        </button>
    `).join("");
    els.categoryGrid.querySelectorAll(".category-tile").forEach(btn => {
        btn.addEventListener("click", () => {
            setFilter(btn.dataset.filter);
            document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
        });
    });
}

function attachCardListeners() {
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-to-bag") || e.target.classList.contains("quick-add")) {
                e.preventDefault();
                e.stopPropagation();
                const id = e.target.dataset.id;
                if (e.target.classList.contains("add-to-bag")) {
                    addToCart(id);
                } else {
                    openQuickView(id);
                }
                return;
            }
            e.preventDefault();
            openQuickView(card.dataset.id);
        });
    });

    document.querySelectorAll(".add-to-bag").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(btn.dataset.id);
        });
    });
}

// --- FILTERING ---
function setupFilters() {
    if (!els.filters) return;
    const filterLabels = {
        all: "All",
        "Fresh & Aquatic": "Fresh & Aquatic",
        Citrus: "Citrus",
        "Fruity & Gourmand": "Fruity & Gourmand",
        "Woody & Spicy": "Woody & Spicy",
        Floral: "Floral",
        "Woody & Vanilla": "Woody & Vanilla",
        Gourmand: "Gourmand",
        "Floral & Musky": "Floral & Musky",
        Sunforged: "Sunforged Collection",
        "Special Edition": "Special Edition"
    };
    const allFilters = ["all", ...Object.keys(filterLabels).filter(f => f !== "all")];
    els.filters.innerHTML = allFilters.map(f => `
        <button class="filter-btn ${state.currentFilter === f ? "active" : ""}" data-filter="${f}">
            ${filterLabels[f] || f}
        </button>
    `).join("");

    els.filters.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            setFilter(btn.dataset.filter);
        });
    });
}

function setFilter(filter) {
    state.currentFilter = filter;
    if (filter === "all") {
        state.filtered = [...state.products];
    } else {
        state.filtered = state.products.filter(p => p.family === filter || p.collection === filter);
    }
    renderCollection();
    updateFilterButtons();
}

function updateFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === state.currentFilter);
    });
}

// --- CART ---
function setupCart() {
    els.cartBtn.addEventListener("click", toggleCart);
    els.cartOverlay.addEventListener("click", closeCart);
    els.cartClose.addEventListener("click", closeCart);
    updateCartBadge();
    renderCart();
}

function toggleCart() {
    els.cartDrawer.classList.toggle("open");
}

function closeCart() {
    els.cartDrawer.classList.remove("open");
}

function addToCart(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    const existing = state.cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ id, qty: 1 });
    }

    localStorage.setItem("mykonos_cart", JSON.stringify(state.cart));
    updateCartBadge();
    renderCart();
    toggleCart();

    // Button feedback
    const btn = document.querySelector(`.add-to-bag[data-id="${id}"]`);
    if (btn) {
        const original = btn.textContent;
        btn.textContent = "Added ✓";
        btn.style.background = "var(--accent-teal)";
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = "";
        }, 1500);
    }
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    localStorage.setItem("mykonos_cart", JSON.stringify(state.cart));
    updateCartBadge();
    renderCart();
    attachCardListeners();
}

function updateCartBadge() {
    const total = state.cart.reduce((sum, item) => sum + item.qty, 0);
    els.cartCount.textContent = total;
}

function renderCart() {
    if (!els.cartItems) return;

    if (state.cart.length === 0) {
        els.cartItems.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:40px 20px;">Your bag is empty.</div>`;
        els.cartFooter.innerHTML = ``;
        return;
    }

    els.cartItems.innerHTML = state.cart.map(item => {
        const p = state.products.find(prod => prod.id === item.id);
        if (!p) return "";
        const price = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(p.price_idr);
        return `
            <div class="cart-item">
                <img src="${p.image}" alt="${p.name}" class="cart-item-img" loading="lazy" onerror="this.src='Images and Videos/INCEPTION.png'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${price}</div>
                </div>
                <button class="cart-item-remove" data-id="${p.id}">Remove</button>
            </div>
        `;
    }).join("");

    const total = state.cart.reduce((sum, item) => {
        const p = state.products.find(prod => prod.id === item.id);
        return sum + (p ? p.price_idr * item.qty : 0);
    }, 0);
    const totalFormatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(total);

    els.cartFooter.innerHTML = `
        <div class="cart-total">
            <span class="cart-total-label">Total</span>
            <span class="cart-total-value">${totalFormatted}</span>
        </div>
        <button class="cart-checkout" onclick="window.location.href='#contact'">Checkout via WhatsApp</button>
    `;

    els.cartItems.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeFromCart(btn.dataset.id);
        });
    });
}

// --- QUICK VIEW ---
function setupQuickView() {
    els.modalClose.addEventListener("click", closeQuickView);
    els.modalOverlay.addEventListener("click", closeQuickView);
}

function openQuickView(id) {
    const p = state.products.find(prod => prod.id === id);
    if (!p) return;

    const price = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(p.price_idr);

    const badgeHtml = p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : "";
    const soldHtml = p.status === "sold-out" ? `<span class="badge badge-sold">sold out</span>` : "";

    els.modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='Images and Videos/INCEPTION.png'">
        </div>
        <div class="modal-details">
            <div class="modal-badge-row">${badgeHtml}${soldHtml}</div>
            <h2>${p.name}</h2>
            <div class="modal-family">${p.family}</div>
            <div class="modal-price">${price}</div>
            <p class="modal-description">${p.description}</p>
            <div class="modal-sizes">
                ${p.sizes.map(size => `<button class="modal-size-btn">${size}</button>`).join("")}
            </div>
            <div class="modal-actions">
                <button class="modal-btn-add" ${p.status === "sold-out" ? "disabled" : ""} data-id="${p.id}">
                    ${p.status === "sold-out" ? "Sold Out" : "Add to Bag"}
                </button>
                <button class="modal-btn-sample">Request Free Sample</button>
            </div>
        </div>
    `;

    els.modalBody.querySelector(".modal-btn-add").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(id);
        closeQuickView();
    });

    els.quickModal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeQuickView() {
    els.quickModal.classList.remove("open");
    document.body.style.overflow = "";
}

// --- SCROLL REVEAL ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// --- NAVIGATION ---
function initNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    els.navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        }
        if (href.includes("#")) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                    els.navLinksContainer.classList.remove("open");
                    els.mobileBtn.textContent = "☰";
                }
            });
        }
    });

    els.mobileBtn.addEventListener("click", () => {
        const isOpen = els.navLinksContainer.classList.toggle("open");
        els.mobileBtn.textContent = isOpen ? "✕" : "☰";
    });
}

function handleScroll() {
    if (window.scrollY > 50) {
        els.navbar.classList.add("scrolled");
    } else {
        els.navbar.classList.remove("scrolled");
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// --- FORMS ---
function setupForms() {
    // Newsletter
    if (els.newsletterForm) {
        els.newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("newsletter-email").value;
            const btn = els.newsletterForm.querySelector("button");
            const original = btn.textContent;
            btn.textContent = "Subscribing...";
            btn.disabled = true;

            setTimeout(() => {
                els.newsletterMessage.textContent = "Thank you for subscribing!";
                els.newsletterMessage.style.color = "var(--accent-teal)";
                els.newsletterForm.reset();
                btn.textContent = original;
                btn.disabled = false;
                setTimeout(() => { els.newsletterMessage.textContent = ""; }, 5000);
            }, 1000);
        });
    }

    // Contact
    if (els.contactForm) {
        els.contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = els.contactForm.querySelector("button[type='submit']");
            const original = btn.textContent;
            btn.textContent = "Sending...";
            btn.disabled = true;

            setTimeout(() => {
                els.contactMessage.textContent = "Message sent! We'll get back to you shortly.";
                els.contactMessage.style.color = "var(--accent-teal)";
                els.contactForm.reset();
                btn.textContent = original;
                btn.disabled = false;
                setTimeout(() => { els.contactMessage.textContent = ""; }, 5000);
            }, 1500);
        });
    }
}
