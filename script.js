
const tracks = [
  { title: "Lofi1",      artist: "lofi1", src: "music/track1.mp3", duration: "2:10" },
  { title: "Lofi2",        artist: "lofi2",   src: "music/track2.mp3", duration: "2:01" },
  { title: "Lofi3", artist: "lofi3", src: "music/track3.mp3", duration: "1:18" },
];

let currentTrack = 0;
let playing = false;

const audio = new Audio();


const playIcon    = document.getElementById('play-icon');
const trackTitle  = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl   = document.getElementById('total-time');


function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  totalTimeEl.textContent = track.duration;
  currentTimeEl.textContent = "0:00";
  progressFill.style.width = "0%";
}

function playPause() {
  if (playing) {
    audio.pause();
    playIcon.src = "btn-play.png";
  } else {
    audio.play();
    playIcon.src = "btn-pause.png";
  }
  playing = !playing;
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  if (playing) audio.play();
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  if (playing) audio.play();
}


const { ipcRenderer } = require('electron');


document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('close-app');
});


document.getElementById('minimize-btn').addEventListener('click', () => {
  ipcRenderer.send('minimize-app');
});


audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = fmtTime(audio.currentTime);
  }
});


audio.addEventListener('ended', nextTrack);


document.querySelector('.progress-bar').addEventListener('click', (e) => {
  const bar = e.currentTarget;
  const pct = e.offsetX / bar.offsetWidth;
  audio.currentTime = pct * audio.duration;
});


document.querySelector('.btn-play').addEventListener('click', playPause);
document.querySelector('.btn-next').addEventListener('click', nextTrack);
document.querySelector('.btn-prev').addEventListener('click', prevTrack);


loadTrack(currentTrack);