document.addEventListener("DOMContentLoaded", () => {
  const langSwitches = document.querySelectorAll(".lang-switch");

  langSwitches.forEach((langSwitch) => {
    const selected = langSwitch.querySelector(".selected");
    const options = langSwitch.querySelector(".options");

    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      langSwitch.classList.toggle("open");
    });

    options.querySelectorAll("li").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        if (lang === "en") window.location.href = "index.html";
        if (lang === "pt") window.location.href = "pt.html";
      });
    });
  });

  document.addEventListener("click", () => {
    langSwitches.forEach((el) => el.classList.remove("open"));
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const burgerBtn = document.getElementById("burgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (!burgerBtn || !navMenu) {
    return;
  }

  const closeMenu = () => {
    burgerBtn.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
  };

  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    burgerBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (e) => {
    if (
      document.body.classList.contains("menu-open") &&
      !navMenu.contains(e.target) &&
      !burgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const WORKER_URL = "https://little-dust-4d98.natalia-vorobei27.workers.dev";
  const forms = document.querySelectorAll(".contact-form");
  console.log("🔍 contact-form elements found:", forms.length);

  if (!forms.length) return;

  forms.forEach((form, idx) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("📨 form submit captured for form index:", idx);

      const get = (n) =>
        form.querySelector(`[name="${n}"]`)
          ? form.querySelector(`[name="${n}"]`).value.trim()
          : "";
      const checkbox = form.querySelector('[name="consent"]');
      const payload = {
        name: get("name"),
        email: get("email"),
        organisation: get("organisation"),
        subject: get("subject"),
        message: get("message"),
        consent: checkbox ? checkbox.checked : false,
      };

      console.log("📦 payload:", payload);

      if (!payload.name || !payload.email) {
        console.warn("⚠️ name or email missing");
        alert("Please fill Name and Corporate Email.");
        return;
      }

      try {
        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let json = null;
        try {
          json = await res.json();
        } catch (err) {
          console.warn("response not json", err);
        }

        console.log("✅ fetch completed, status:", res.status, "body:", json);
        if (res.ok && json && json.success) {
          alert("✅ Message sent successfully!");
          form.reset();
        } else if (res.ok) {
          alert("✅ Request sent (but worker returned no success flag).");
          form.reset();
        } else {
          alert("❌ Error sending message. Server status: " + res.status);
        }
      } catch (err) {
        console.error("❌ Network / fetch error:", err);
        alert("Network error: " + err.message);
      }
    });
  });
});
