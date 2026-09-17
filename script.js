// RET site — lightweight entrance animation
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(14px)";

    setTimeout(() => {
      card.style.transition = "opacity .6s ease, transform .6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 120 + i * 70);
  });
});
