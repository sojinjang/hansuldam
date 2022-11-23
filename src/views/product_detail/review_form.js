const reviewModalForm = document.querySelector(".modal-overlay");
const reviewWriteButton = document.querySelector(".review-write-button");
const reviewWriteCloseButton = document.querySelector(".close-area");

function addCloseFormEvent(modalForm) {
  reviewWriteCloseButton.addEventListener("click", () => {
    modalForm.style.display = "none";
  });

  modalForm.addEventListener("click", (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains("modal-overlay")) {
      modalForm.style.display = "none";
    }
  });
  window.addEventListener("keyup", (e) => {
    if (modalForm.style.display === "flex" && e.key === "Escape") {
      modalForm.style.display = "none";
    }
  });
}

reviewWriteButton.addEventListener("click", () => {
  reviewModalForm.style.display = "flex";
});
addCloseFormEvent(reviewModalForm);
