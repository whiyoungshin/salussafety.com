/* ============================================================
   SALUS SAFETY — contact.js
   Client-side validation + graceful success state.
   Wire the form to your backend / form service via data-endpoint.
   ============================================================ */

(function () {
  "use strict";

  const form = document.querySelector("#contact-form");
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    const wrap = field.closest(".form-field");
    if (!wrap) return true;
    let ok = true;

    if (field.hasAttribute("required") && !field.value.trim()) ok = false;
    if (ok && field.type === "email" && field.value && !emailRe.test(field.value)) ok = false;

    wrap.classList.toggle("invalid", !ok);
    return ok;
  }

  form.querySelectorAll("input, select, textarea").forEach((f) => {
    f.addEventListener("blur", () => validateField(f));
    f.addEventListener("input", () => f.closest(".form-field")?.classList.remove("invalid"));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let allOk = true;
    form.querySelectorAll("input, select, textarea").forEach((f) => {
      if (!validateField(f)) allOk = false;
    });

    if (!allOk) {
      form.querySelector(".form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea")?.focus();
      return;
    }

    const endpoint = form.dataset.endpoint;
    const success = document.querySelector("#form-success");
    const btn = form.querySelector('button[type="submit"]');

    const showSuccess = () => {
      if (success) success.style.display = "block";
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = "Send Message"; }
      success?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    if (endpoint) {
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(showSuccess)
        .catch(showSuccess);
    } else {
      /* No backend configured — demo success state */
      showSuccess();
    }
  });
})();
