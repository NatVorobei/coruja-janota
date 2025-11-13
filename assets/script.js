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
  const lang = document.documentElement.lang?.toLowerCase() || "en";

  createPopupContainer();

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      clearErrors(form);

      const payload = Object.fromEntries(new FormData(form).entries());
      payload.consent = form.querySelector('[name="consent"]').checked;

      const validation = validateForm(payload, form, lang);
      if (validation !== true) return;

      try {
        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => null);

        if (res.ok && json?.success) {
          showPopup(getText(lang, "success"), "success");
          form.reset();
        } else if (res.ok) {
          showPopup(getText(lang, "sent"), "info");
          form.reset();
        } else {
          showPopup(getText(lang, "error") + res.status, "error");
        }
      } catch (err) {
        showPopup(getText(lang, "network") + err.message, "error");
      }
    });
  });
});

function validateForm(data, form, lang = "en") {
  const t = (k) => getText(lang, k);
  let valid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!data.name || data.name.length < 2) {
    showError(form, "name", t("fillName"));
    valid = false;
  }
  if (!emailRegex.test(data.email)) {
    showError(form, "email", t("fillEmail"));
    valid = false;
  }
  if (!data.message || data.message.length < 5) {
    showError(form, "message", t("fillMessage"));
    valid = false;
  }
  if (!data.consent) {
    showError(form, "consent", t("agree"));
    valid = false;
  }

  return valid;
}

function showError(form, fieldName, message) {
  const field = form.querySelector(`[name="${fieldName}"]`);
  if (!field) return;
  field.classList.add("input-error");

  let msg = document.createElement("div");
  msg.className = "error-msg";
  msg.textContent = message;
  field.insertAdjacentElement("afterend", msg);
}

function clearErrors(form) {
  form.querySelectorAll(".error-msg").forEach((el) => el.remove());
  form
    .querySelectorAll(".input-error")
    .forEach((el) => el.classList.remove("input-error"));
}

function getText(lang, key) {
  const texts = {
    en: {
      fillName: "Please enter your name (at least 2 characters).",
      fillEmail: "Please enter a valid corporate email.",
      fillMessage: "Please write a short message.",
      agree: "Please confirm confidential handling of this request.",
      success: "✅ Message sent successfully!",
      sent: "✅ Request sent (but worker returned no success flag).",
      error: "❌ Error sending message. Server status: ",
      network: "Network error: ",
    },
    pt: {
      fillName: "Por favor, insira o seu nome (mínimo 2 caracteres).",
      fillEmail: "Por favor, insira um email corporativo válido.",
      fillMessage: "Por favor, escreva uma breve mensagem.",
      agree: "Por favor, confirme o tratamento confidencial deste pedido.",
      success: "✅ Mensagem enviada com sucesso!",
      sent: "✅ Pedido enviado (mas o servidor não retornou sucesso).",
      error: "❌ Erro ao enviar a mensagem. Código do servidor: ",
      network: "Erro de rede: ",
    },
  };
  return texts[lang.startsWith("pt") ? "pt" : "en"][key];
}

function createPopupContainer() {
  const container = document.createElement("div");
  container.className = "popup-container";
  document.body.appendChild(container);
}

function showPopup(message, type = "info") {
  const container = document.querySelector(".popup-container");
  if (!container) return;

  const popup = document.createElement("div");
  popup.className = `popup popup-${type}`;
  popup.textContent = message;

  container.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 10);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 4000);
}
