const track = document.getElementById("image-track");
let isDragging = false; // To keep track of dragging state

const handleOnDown = (e) => {
  track.dataset.mouseDownAt = e.clientX || e.touches[0].clientX; // Handle both mouse and touch
  isDragging = true;
};

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  isDragging = false;
};

const handleOnMove = (e) => {
  if (!isDragging) return;

  const clientX = e.clientX || e.touches[0].clientX; // Support for both desktop and mobile
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - clientX;
  const maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  // Apply the transformation for horizontal scroll
  track.style.transform = `translate(${nextPercentage}%, -50%)`;

  // Adjust image positions for the parallax effect
  for (const image of track.getElementsByClassName("image")) {
    image.style.objectPosition = `${100 + nextPercentage}% center`;
  }
};

// Prevent default scrolling on touch move to keep the horizontal effect
const preventScroll = (e) => {
  if (isDragging) e.preventDefault();
};

// Mouse Events
window.onmousedown = (e) => handleOnDown(e);
window.onmousemove = (e) => handleOnMove(e);
window.onmouseup = handleOnUp;

// Touch Events
window.ontouchstart = (e) => handleOnDown(e);
window.ontouchmove = (e) => {
  handleOnMove(e);
  preventScroll(e); // Prevent the default behavior (scrolling)
};
window.ontouchend = handleOnUp;
