const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const metalLogo = document.querySelector(".metal-logo");
const modal = document.getElementById("portfolio-modal");
const modalImage = document.getElementById("portfolio-modal-image");
const modalTitle = document.getElementById("portfolio-modal-title");
const modalCounter = document.getElementById("portfolio-modal-counter");
const modalDescription = document.getElementById("portfolio-modal-description");
const modalCloseButton = document.querySelector(".portfolio-modal-close");
const modalPrev = document.querySelector(".portfolio-modal-nav.prev");
const modalNext = document.querySelector(".portfolio-modal-nav.next");
const portfolioItems = document.querySelectorAll(".portfolio-item");

function closeMenu() {
  if (menuButton && navigation) {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    if (modal && modal.classList.contains("is-open")) {
      closeGallery();
    }
  }
});

if (metalLogo) {
  metalLogo.addEventListener("pointermove", (event) => {
    const rect = metalLogo.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    metalLogo.style.setProperty("--tilt-x", `${(-y * 12).toFixed(2)}deg`);
    metalLogo.style.setProperty("--tilt-y", `${(x * 18).toFixed(2)}deg`);
  });

  metalLogo.addEventListener("pointerleave", () => {
    metalLogo.style.setProperty("--tilt-x", "0deg");
    metalLogo.style.setProperty("--tilt-y", "0deg");
  });

  metalLogo.addEventListener("focus", () => {
    metalLogo.style.setProperty("--tilt-x", "8deg");
    metalLogo.style.setProperty("--tilt-y", "12deg");
  });

  metalLogo.addEventListener("blur", () => {
    metalLogo.style.setProperty("--tilt-x", "0deg");
    metalLogo.style.setProperty("--tilt-y", "0deg");
  });
}

let currentGallery = [];
let currentGalleryIndex = 0;

function closeGallery() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openGallery(item) {
  if (!modal || !modalImage || !modalTitle || !modalCounter || !modalDescription) return;

  const galleryTitle = item.dataset.galleryTitle || item.querySelector("figcaption span:last-child")?.textContent || "Portfolio";
  const galleryImages = (item.dataset.galleryImages || "").split(",").map((image) => image.trim()).filter(Boolean);

  if (galleryImages.length === 0) {
    galleryImages.push(item.querySelector("img")?.src || "");
  }

  currentGallery = galleryImages;
  currentGalleryIndex = 0;
  modalTitle.textContent = galleryTitle;
  modalDescription.textContent = galleryTitle + " portfolio";
  modalImage.src = galleryImages[0];
  modalImage.alt = galleryTitle + " portfolio image";
  modalCounter.textContent = `1 / ${galleryImages.length}`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function updateGalleryFrame() {
  if (!modalImage || !modalCounter || currentGallery.length === 0) return;
  const imageSrc = currentGallery[currentGalleryIndex];
  modalImage.src = imageSrc;
  modalImage.alt = `${modalTitle.textContent} portfolio image ${currentGalleryIndex + 1}`;
  modalCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
}

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => {
    openGallery(item);
  });

  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(item);
    }
  });

  item.tabIndex = 0;
});

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", closeGallery);
}

if (modal && modal.dataset && modal.dataset.closeModal !== undefined) {
  // handled by the backdrop click below
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal='true']") || event.target === modal) {
      closeGallery();
    }
  });
}

document.querySelectorAll("[data-app-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const appLink = link.dataset.appLink;
    const webLink = link.dataset.webLink || link.href;

    if (!appLink) return;

    window.location.href = appLink;
    window.setTimeout(() => {
      window.location.href = webLink;
    }, 900);

    event.preventDefault();
  });
});

const inquiryForm = document.getElementById("inquiry-form");

if (inquiryForm) {
  inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = inquiryForm.querySelector("button[type='submit']");
    const formData = new FormData(inquiryForm);
    const name = (formData.get("name") || "").toString().trim();

    try {
      const response = await fetch(inquiryForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      if (response.ok) {
        inquiryForm.reset();
        if (submitButton) {
          submitButton.textContent = "Sent";
          submitButton.disabled = true;
        }
        return;
      }
    } catch (error) {
      // fallback to email if the form service is unavailable
    }

    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const projectType = (formData.get("project-type") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`New inquiry from ${name || "client"}`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || "Not provided"}\n` +
      `Project type: ${projectType || "Not specified"}\n\n` +
      `Project details:\n${message}`
    );

    window.location.href = `mailto:luxrenascistudios@gmail.com?subject=${subject}&body=${body}`;
    inquiryForm.reset();
  });
}

if (modalPrev) {
  modalPrev.addEventListener("click", () => {
    if (!currentGallery.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
    updateGalleryFrame();
  });
}

if (modalNext) {
  modalNext.addEventListener("click", () => {
    if (!currentGallery.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
    updateGalleryFrame();
  });
}
