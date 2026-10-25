/* =========================================
   MYKONOS PARFUMS — FORM
   Contact form handling
   ========================================= */
function initContactForm() {
    const form = document.querySelector(".contact-form form");
    if (!form) return;

    const messageEl = document.querySelector(".form-message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.textContent;
        btn.textContent = "Sending...";
        btn.disabled = true;

        // Simulate form submission (replace with Formspree/Netlify Forms endpoint)
        setTimeout(() => {
            messageEl.textContent = "Message sent! We'll get back to you shortly.";
            messageEl.classList.add("show");
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;

            setTimeout(() => {
                messageEl.classList.remove("show");
            }, 5000);
        }, 1500);
    });
}
