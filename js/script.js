document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
      // Close mobile menu after clicking a link
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }
    });
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll("section");
  const navLi = document.querySelectorAll(".nav-links li a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach((li) => {
      li.classList.remove("active");
      if (li.getAttribute("href").includes(current)) {
        li.classList.add("active");
      }
    });
  });

  // Header background on scroll
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("active");
      } else {
        backToTopBtn.classList.remove("active");
      }
    });
  }

  // Formspree submission logic
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.createElement("div");
  formStatus.className = "form-status";
  contactForm.parentNode.insertBefore(formStatus, contactForm.nextSibling);

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formStatus.innerHTML =
          '<p class="success-message">Thanks for your message! I will get back to you shortly.</p>';
        form.reset();
        // Clear the message after 7 seconds
        setTimeout(() => {
          formStatus.innerHTML = "";
        }, 7000);
      } else {
        const result = await response.json();
        if (result.errors) {
          formStatus.innerHTML = `<p class="error-message">${result.errors
            .map((error) => error.field)
            .join(", ")}</p>`;
        } else {
          formStatus.innerHTML =
            '<p class="error-message">Oops! There was a problem submitting your form.</p>';
        }
      }
    } catch (error) {
      formStatus.innerHTML =
        '<p class="error-message">Oops! There was a problem submitting your form.</p>';
    }
  });
});

function showStatusMessage(message, type = "success") {
  const status = document.querySelector(".form-status");
  if (!status) return;

  // Reset
  status.className =
    "form-status " + (type === "success" ? "success-message" : "error-message");
  status.textContent = message;

  // Show
  status.classList.add("show");

  // Auto-hide after 3s
  setTimeout(() => {
    status.classList.remove("show");
  }, 3000);
}

// Example usage inside your form submit
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(contactForm);
    try {
      let response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "✅ Thanks for your message!";
        formStatus.classList.add("success-message");
        contactForm.reset();
      } else {
        formStatus.textContent = "❌ Oops, something went wrong.";
        formStatus.classList.add("error-message");
      }
    } catch (error) {
      formStatus.textContent = "❌ Network error.";
      formStatus.classList.add("error-message");
    }

    // Auto hide
    setTimeout(() => {
      formStatus.textContent = "";
      formStatus.classList.remove("success-message", "error-message");
    }, 4000);
  });
}
