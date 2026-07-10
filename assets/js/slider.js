/* ============================================================
   SALUS SAFETY — slider.js
   Lightweight slider: any element with [data-slider]
   ============================================================ */

(function () {
  "use strict";

  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const slides = slider.querySelectorAll(".slide");
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;
    const auto = slider.dataset.autoplay !== "false";
    const interval = parseInt(slider.dataset.interval || "6000", 10);

    /* Dots */
    const nav = document.createElement("div");
    nav.className = "slider-nav";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => go(i, true));
      nav.appendChild(dot);
    });
    slider.after(nav);

    /* Arrows */
    const arrows = document.createElement("div");
    arrows.className = "slider-arrows";
    ["prev", "next"].forEach((dir) => {
      const b = document.createElement("button");
      b.className = "slider-arrow";
      b.setAttribute("aria-label", dir === "prev" ? "Previous slide" : "Next slide");
      b.innerHTML =
        dir === "prev"
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      b.addEventListener("click", () => go(index + (dir === "prev" ? -1 : 1), true));
      arrows.appendChild(b);
    });
    slider.appendChild(arrows);

    function go(i, manual) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      nav.querySelectorAll(".slider-dot").forEach((d, di) => d.classList.toggle("active", di === index));
      if (manual) restart();
    }

    function restart() {
      if (!auto) return;
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), interval);
    }

    /* Touch swipe */
    let startX = null;
    track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    track.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1), true);
        startX = null;
      },
      { passive: true }
    );

    restart();
  });
})();
