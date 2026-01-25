const audios = document.querySelectorAll("audio");
const tracks = document.querySelectorAll(".track");

const playerBar = document.getElementById("player-bar");
const playPauseBtn = document.getElementById("playPause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const titleDisplay = document.getElementById("track-title");
const timeDisplay = document.getElementById("track-time");

let currentAudio = null;
let currentIndex = -1;

/* ⏱ utilitaire mm:ss */
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

/* ▶ Lancer une chanson */
function playTrack(index) {
  audios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });

  tracks.forEach(track => track.classList.remove("playing"));

  currentAudio = audios[index];
  currentIndex = index;

  currentAudio.play();
  playerBar.style.display = "flex";
  playPauseBtn.textContent = "⏸";
  titleDisplay.textContent = currentAudio.dataset.title;
  timeDisplay.textContent = "0:00 / 0:00";

  tracks[index].classList.add("playing");
}

/* ▶ / ⏸ Play Pause */
playPauseBtn.addEventListener("click", () => {
  if (!currentAudio) return;

  if (currentAudio.paused) {
    currentAudio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    currentAudio.pause();
    playPauseBtn.textContent = "▶";
  }
});

/* ⏭ Suivant */
nextBtn.addEventListener("click", () => {
  if (currentIndex < audios.length - 1) {
    playTrack(currentIndex + 1);
  }
});

/* ⏮ Précédent */
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    playTrack(currentIndex - 1);
  }
});

/* ⏱ Progression + temps */
audios.forEach(audio => {

  audio.addEventListener("loadedmetadata", () => {
    if (audio === currentAudio) {
      timeDisplay.textContent =
        `0:00 / ${formatTime(audio.duration)}`;
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (audio === currentAudio) {
      const percent =
        (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + "%";

      timeDisplay.textContent =
        `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });

  audio.addEventListener("ended", () => {
    if (currentIndex < audios.length - 1) {
      playTrack(currentIndex + 1);
    } else {
      playerBar.style.display = "none";
      progress.style.width = "0%";
      playPauseBtn.textContent = "▶";
      timeDisplay.textContent = "0:00 / 0:00";
      currentAudio = null;
      currentIndex = -1;
      tracks.forEach(track => track.classList.remove("playing"));
    }
  });
});

/* 🎯 Click sur la barre */
progressContainer.addEventListener("click", e => {
  if (!currentAudio) return;

  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  currentAudio.currentTime =
    (clickX / width) * currentAudio.duration;
});

