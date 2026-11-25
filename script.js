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

const scrollRunner = document.querySelector(".scroll-runner");
const runnerMain = document.querySelector("main");
const runnerTrack = scrollRunner.querySelector(".scroll-runner-track");
const runnerFill = scrollRunner.querySelector(".scroll-runner-fill");
const runnerMarker = scrollRunner.querySelector(".scroll-runner-marker");
const runnerStar = scrollRunner.querySelector(".scroll-runner-star");
let scrollFramePending = false;
let runnerWidth = 0;
let runnerHeight = 0;
let runnerLength = 0;

function updateScrollRunner() {
  const bounds = runnerMain.getBoundingClientRect();
  if (bounds.width !== runnerWidth || bounds.height !== runnerHeight) {
    runnerWidth = bounds.width;
    runnerHeight = bounds.height;
    const segments = Math.max(1, Math.ceil(runnerHeight / 500));
    const step = runnerHeight / segments;
    let x = runnerWidth * 0.18;
    let path = `M ${x} 0`;
    for (let i = 0; i < segments; i++) {
      const nextX = runnerWidth * (i % 2 === 0 ? 0.82 : 0.18);
      path += ` C ${x} ${i * step + step / 3}, ${nextX} ${i * step + step * 2 / 3}, ${nextX} ${(i + 1) * step}`;
      x = nextX;
    }
    scrollRunner.setAttribute("viewBox", `0 0 ${runnerWidth} ${runnerHeight}`);
    runnerTrack.setAttribute("d", path);
    runnerFill.setAttribute("d", path);
    runnerLength = runnerTrack.getTotalLength();
    runnerFill.style.strokeDasharray = `${runnerLength} ${runnerLength}`;
  }
  const targetY = Math.min(runnerHeight, Math.max(0, window.innerHeight / 2 - bounds.top));
  let low = 0;
  let high = runnerLength;
  for (let i = 0; i < 14; i++) {
    const middle = (low + high) / 2;
    if (runnerTrack.getPointAtLength(middle).y < targetY) low = middle;
    else high = middle;
  }
  const distance = (low + high) / 2;
  const point = runnerTrack.getPointAtLength(distance);
  runnerMarker.setAttribute("transform", `translate(${point.x} ${point.y})`);
  runnerStar.setAttribute("transform", `rotate(${distance / runnerLength * 720})`);
  runnerFill.style.strokeDashoffset = `${runnerLength - distance}`;
  scrollFramePending = false;
}

function scheduleScrollRunner() {
  if (!scrollFramePending) {
    scrollFramePending = true;
    requestAnimationFrame(updateScrollRunner);
  }
}

window.addEventListener("scroll", scheduleScrollRunner, { passive: true });
window.addEventListener("resize", scheduleScrollRunner);
new ResizeObserver(scheduleScrollRunner).observe(runnerMain);
updateScrollRunner();
