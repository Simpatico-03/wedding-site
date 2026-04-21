const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbzPfZZh0noo6uG-A9i2MiOSNuCspmrV33vGjVDh77ng6pSvVEzl-tRLvIdFdaKRU2Rb/exec";

function toggleForm() {
  const form = document.getElementById("rsvp-form");
  if (form) {
    form.classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setFormStatus(form, message, type) {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;

  status.textContent = message;
  status.className = `form-status ${type || ""}`.trim();
}

async function submitRsvp(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);

  if (!RSVP_ENDPOINT) {
    setFormStatus(form, "RSVP is almost ready. Please add the Google Apps Script URL in rsvp.js.", "error");
    return;
  }

  setFormStatus(form, "Sending your RSVP...", "pending");
  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    await fetch(RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    form.reset();
    setFormStatus(form, "Thank you. Your RSVP has been received.", "success");
  } catch (error) {
    setFormStatus(form, `Unable to submit RSVP. Error: ${error.message}`, "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash === "#rsvp-form") {
    const formSection = document.getElementById("rsvp-form");
    if (formSection) {
      formSection.classList.remove("hidden");
      window.setTimeout(() => {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  document.querySelectorAll("[data-rsvp-form]").forEach((form) => {
    form.addEventListener("submit", submitRsvp);
  });
});
