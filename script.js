/* ============================================================
   SAIKRISHNA & KAVYA — WEDDING INVITATION CONFIGURATION
   Edit only the values in this section when you personalize it.
   ============================================================ */
const CONFIG = {
  weddingDate: "2026-11-15T00:00:00+05:30",

  // Paste your published Google Form responder URL here.
  // Example: https://docs.google.com/forms/d/e/XXXXXXXX/viewform

};

const $ = (id) => document.getElementById(id);

let isInvitationOpen = false;

// Auspicious Pushpa Vrishti (Flower Petal Shower)
function createPetalShower() {
  const container = document.createElement("div");
  container.className = "petal-container";
  container.setAttribute("aria-hidden", "true");
  document.body.appendChild(container);

  const colors = [
    "linear-gradient(135deg, #ffb703, #fb8500)",
    "linear-gradient(135deg, #e63946, #c1121f)",
    "linear-gradient(135deg, #ffd166, #f4a261)",
    "linear-gradient(135deg, #d90429, #9b2226)",
    "linear-gradient(135deg, #f3c053, #d49a37)"
  ];

  const petalCount = 36;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    const size = Math.random() * 12 + 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = Math.random() * 2 + 2.5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${left}%`;
    petal.style.background = color;
    petal.style.animationDelay = `${delay}s`;
    petal.style.animationDuration = `${duration}s`;

    if (Math.random() > 0.5) {
      petal.style.borderRadius = "50% 0 50% 0";
    } else {
      petal.style.borderRadius = "0 50% 0 50%";
    }

    container.appendChild(petal);
  }

  setTimeout(() => {
    container.remove();
  }, 5000);
}

// Open Invitation with animation, music, and smooth transition
function openInvitation() {
  // Start music on user interaction
  toggleMusic(true);

  if (isInvitationOpen) {
    const coupleSection = document.querySelector("#couple");
    if (coupleSection) {
      coupleSection.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  isInvitationOpen = true;

  // Button feedback
  if (openBtn) {
    openBtn.classList.remove("pulse-btn");
    openBtn.innerHTML = `<span>Opening...</span> <span style="font-size: 14px">❧</span>`;
  }

  // Trigger petal shower animation
  createPetalShower();

  // Unlock and reveal remaining sections
  document.body.classList.remove("is-locked");
  const pages = $("invitationPages");
  if (pages) {
    pages.classList.remove("invitation-locked");
    pages.classList.add("invitation-opening");
    pages.setAttribute("aria-hidden", "false");
  }

  // Update hint text
  const scrollHint = $("scrollHint");
  if (scrollHint) {
    scrollHint.textContent = "SCROLL TO EXPLORE ↓";
  }

  // Smooth cinematic scroll to the couple section
  setTimeout(() => {
    if (openBtn) {
      openBtn.innerHTML = `<span>Explore Invitation</span> <span>↓</span>`;
    }
    const coupleSection = document.querySelector("#couple");
    if (coupleSection) {
      coupleSection.scrollIntoView({ behavior: "smooth" });
    }
  }, 500);
}

const openBtn = $("openInvitation");
if (openBtn) {
  openBtn.addEventListener("click", openInvitation);
}

// Wedding countdown — uses the wedding date supplied by the couple.
function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  if ($("days")) $("days").textContent = String(days).padStart(2, "0");
  if ($("hours")) $("hours").textContent = String(hours).padStart(2, "0");
  if ($("minutes")) $("minutes").textContent = String(minutes).padStart(2, "0");
  if ($("seconds")) $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Optional background music. Browsers require user interaction before audio can play.
const music = $("bgMusic");
const musicButton = $("musicButton");
const musicLabel = $("musicLabel");

function updateMusicUI(isPlaying) {
  if (!musicButton || !musicLabel) return;
  if (isPlaying) {
    musicButton.classList.add("playing");
    musicLabel.textContent = "Pause";
    musicButton.setAttribute("aria-label", "Pause background music");
  } else {
    musicButton.classList.remove("playing");
    musicLabel.textContent = "Music";
    musicButton.setAttribute("aria-label", "Play background music");
  }
}

async function toggleMusic(onlyPlay = false) {
  if (!music) return;
  try {
    if (music.paused) {
      await music.play();
      updateMusicUI(true);
    } else if (!onlyPlay) {
      music.pause();
      updateMusicUI(false);
    }
  } catch (error) {
    console.warn("Music playback error:", error);
    if (!onlyPlay) {
      updateMusicUI(false);
    }
  }
}

if (musicButton) {
  musicButton.addEventListener("click", () => toggleMusic(false));
}

if (music) {
  music.addEventListener("play", () => updateMusicUI(true));
  music.addEventListener("pause", () => updateMusicUI(false));
  music.addEventListener("ended", () => updateMusicUI(false));
  music.addEventListener("error", () => {
    console.warn("Could not load music file.");
    if (musicLabel) musicLabel.textContent = "Music";
  });
}

// Smart image fallback: if .jpg fails, try .jpeg (and vice versa)
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    if (this.dataset.fallbackTried) {
      this.style.display = "none";
      const galleryItem = this.closest(".gallery-item");
      if (galleryItem) {
        galleryItem.style.display = "none";
      }
      return;
    }
    this.dataset.fallbackTried = "true";
    if (this.src.endsWith(".jpg")) {
      this.src = this.src.replace(/\.jpg$/, ".jpeg");
    } else if (this.src.endsWith(".jpeg")) {
      this.src = this.src.replace(/\.jpeg$/, ".jpg");
    }
  });
});
