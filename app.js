document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("imageForm");
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxDescription = document.getElementById("lightboxDescription");
  const close = document.getElementById("close");

  let images = JSON.parse(localStorage.getItem("images")) || [];
  let currentIndex = 0;

  function renderGallery() {
    gallery.innerHTML = "";
    images.forEach((image, index) => {
      const item = document.createElement("div");
      item.classList.add("gallery-item");
      item.innerHTML = `<img src="${image.imageUrl}" alt="${image.imageDesc}" data-index="${index}"/>
      <button class = 'delete-btn' data-index='${index}'>X</button>`;
      gallery.appendChild(item);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const imageUrl = document.getElementById("imageUrl").value;
    const imageDesc = document.getElementById("imageDescription").value;

    images.push({ imageUrl, imageDesc });
    saveImages();
    renderGallery();
    form.reset();
  });

  gallery.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      currentIndex = parseInt(e.target.dataset.index, 10);
      openLightbox();
    } else if (e.target.classList.contains("delete-btn")) {
      const index = parseInt(e.target.dataset.index, 10);
      images.splice(index, 1);
      saveImages();
      renderGallery();
    }
  });

  function openLightbox() {
    const image = images[currentIndex];
    lightboxImage.src = image.imageUrl;
    lightboxImage.alt = image.imageDesc;
    lightboxDescription.textContent = `${currentIndex + 1}/${
      images.length
    } ${image.imageDesc}`;
    lightbox.classList.remove("hidden");
  }

  close.addEventListener("click", () => {
    lightbox.classList.add("hidden");
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    openLightbox();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    openLightbox();
  });
  function saveImages() {
    localStorage.setItem("images", JSON.stringify(images));
  }
  renderGallery();
});