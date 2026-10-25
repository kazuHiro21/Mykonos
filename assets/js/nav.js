/* =========================================
   MYKONOS PARFUMS — NAVIGATION
   Mobile menu, active link, smooth scroll
   ========================================= */
function initNav() {
    const navLinks = document.querySelectorAll(".nav-links a");
    const mobileBtn = document.querySelector(".nav-mobile-btn");
    const navList = document.querySelector(".nav-links");

    // Highlight active link based on current page
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        }
        if (href.includes("#")) {
            link.addEventListener("click", (e) => {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        }
    });

    // Mobile menu toggle
    if (mobileBtn && navList) {
        mobileBtn.addEventListener("click", () => {
            navList.classList.toggle("open");
            const isOpen = navList.classList.contains("open");
            mobileBtn.textContent = isOpen ? "✕" : "☰";
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.padding = "12px 60px";
            navbar.style.background = "rgba(15, 23, 42, 0.85)";
        } else {
            navbar.style.padding = "18px 60px";
            navbar.style.background = "rgba(15, 23, 42, 0.55)";
        }
    });
}
