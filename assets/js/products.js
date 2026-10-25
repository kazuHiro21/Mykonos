/* =========================================
   MYKONOS PARFUMS — PRODUCTS
   Loads products.json, renders catalog, filters
   ========================================= */
class ProductCatalog {
    constructor() {
        this.products = [];
        this.filtered = [];
        this.currentFilter = "all";
        this.container = null;
        this.countEl = null;
    }

    async init(containerSelector, countSelector) {
        this.container = document.querySelector(containerSelector);
        this.countEl = document.querySelector(countSelector);
        if (!this.container) return;

        await this.loadProducts();
        this.render();
        this.setupFilters();
    }

    async loadProducts() {
        try {
            const res = await fetch("data/products.json");
            this.products = await res.json();
            this.filtered = [...this.products];
        } catch (err) {
            console.error("Failed to load products:", err);
            if (this.container) {
                this.container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:40px;">Unable to load catalog. Please try again later.</p>';
            }
        }
    }

    async loadProductsOnly() {
        try {
            const res = await fetch("data/products.json");
            this.products = await res.json();
            this.filtered = [...this.products];
        } catch (err) {
            console.error("Failed to load products:", err);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        if (filter === "all") {
            this.filtered = [...this.products];
        } else {
            this.filtered = this.products.filter(p => p.family === filter || p.collection === filter);
        }
        this.render();
        this.updateFilterButtons();
    }

    setupFilters() {
        const buttons = document.querySelectorAll(".filter-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const filter = btn.dataset.filter;
                this.setFilter(filter);
            });
        });
    }

    updateFilterButtons() {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === this.currentFilter);
        });
    }

    render() {
        if (!this.container) return;

        if (this.countEl) {
            this.countEl.textContent = `${this.filtered.length} scents`;
        }

        if (this.filtered.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align:center; padding:60px 20px; color:var(--text-muted);">
                    <p>No products found</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = this.filtered.map(p => this.cardHTML(p)).join("");
    }

    cardHTML(p) {
        const price = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(p.price_idr);

        const badgeHtml = p.badge ? `<span class="badge badge-${p.badge} product-badge">${p.badge}</span>` : "";
        const soldHtml = p.status === "sold-out" ? `<span class="badge badge-sold product-badge">sold out</span>` : "";

        return `
            <a href="product-detail.html?id=${p.id}" class="product-card">
                <div class="product-img-wrap">
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='Images and Videos/INCEPTION.png'">
                    <div class="product-actions-overlay">
                        <button class="quick-add" title="Quick add">+</button>
                    </div>
                    ${badgeHtml}
                    ${soldHtml}
                </div>
                <div class="product-info">
                    <div class="product-meta">
                        <span class="product-edition">${p.edition}</span>
                    </div>
                    <div class="product-family">${p.family}</div>
                    <h3>${p.name}</h3>
                    <div class="product-notes">${p.notes.top.join(", ")} • ${p.notes.middle.join(", ")}</div>
                    <div class="product-price">${price}</div>
                    <button class="product-btn" ${p.status === "sold-out" ? "disabled" : ""}>
                        ${p.status === "sold-out" ? "Sold Out" : "Add to Bag"}
                    </button>
                </div>
            </a>
        `;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getRelatedProducts(id, limit = 4) {
        return this.products
            .filter(p => p.id !== id && (p.family === this.getProductById(id)?.family || p.collection === this.getProductById(id)?.collection))
            .slice(0, limit);
    }
}

const catalog = new ProductCatalog();
