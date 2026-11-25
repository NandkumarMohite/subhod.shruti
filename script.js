const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
let lastGalleryButton;

document.querySelectorAll(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => {
    lastGalleryButton = button;
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.dataset.alt;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => lastGalleryButton?.focus());
