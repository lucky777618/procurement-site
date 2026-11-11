/* Lucky7Link — site behaviour
   No dependencies. Three jobs: mobile nav, FAQ accordion, quote form. */

(function () {
  "use strict";

  /* ---- config ----------------------------------------------------------
     Set formEndpoint to enable the quote form. Until then the form tells the
     visitor to email instead, rather than pretending to send.
     Example: https://api.web3forms.com/submit  (add accessKey below)
  ---------------------------------------------------------------------- */
  window.L7L_CONFIG = window.L7L_CONFIG || { formEndpoint: "", accessKey: "" };
  var CONFIG = window.L7L_CONFIG;

  /* ---- mobile navigation ---------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- FAQ accordion --------------------------------------------------- */
  var questions = document.querySelectorAll(".faq-q");

  Array.prototype.forEach.call(questions, function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---- quote form ------------------------------------------------------ */
  var form = document.getElementById("quote-form");
  var status = document.getElementById("form-status");

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.className = "form-status is-visible" + (isError ? " is-error" : "");
  }

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var required = ["q-name", "q-email", "q-country", "q-products"];
      var missing = [];

      required.forEach(function (id) {
        var field = document.getElementById(id);
        if (field && !field.value.trim()) {
          missing.push(field);
        }
      });

      if (missing.length) {
        showStatus("Please fill in: " + missing.map(function (f) { return f.previousElementSibling ? f.previousElementSibling.textContent.replace(" *", "") : f.name; }).join(", ") + ".", true);
        missing[0].focus();
        return;
      }

      var emailField = document.getElementById("q-email");
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailField.value.trim())) {
        showStatus("That email address does not look right. Please check it.", true);
        emailField.focus();
        return;
      }

      var honeypot = document.getElementById("q-hp");
      if (honeypot && honeypot.value) {
        return; /* silently drop bots */
      }

      var payload = {};
      new FormData(form).forEach(function (value, key) {
        payload[key] = value;
      });
      payload.page = window.location.href;
      payload.sent_at = new Date().toISOString();

      if (!CONFIG.formEndpoint) {
        showStatus("The form is not connected to our inbox yet. Please email hello@lucky7link.com with the same details — it reaches the same desk.", true);
        return;
      }

      var submit = form.querySelector("button[type=submit]");
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }
      showStatus("Sending your request…", false);

      var body = payload;
      if (CONFIG.accessKey) {
        body = Object.assign({ access_key: CONFIG.accessKey }, payload);
      }

      fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body)
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          showStatus("Thanks — your request is in. You will hear from us within 24 hours, usually sooner.", false);
          form.reset();
        })
        .catch(function () {
          showStatus("Sending failed. Please email hello@lucky7link.com instead — your message will reach the same desk.", true);
        })
        .then(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = "Send quote request";
          }
        });
    });
  }
})();
