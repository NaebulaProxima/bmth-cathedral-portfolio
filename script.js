// Ambient Floating Dust Particles in Cathedral Light
function createCathedralDust() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 35;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 3 + 1.5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${Math.random() * 10 + 12}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    container.appendChild(particle);
  }
}

// Lightbox Gallery Viewer
const cards = Array.from(document.querySelectorAll('.cathedral-card'));
const dialog = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxVerse = document.getElementById('lightbox-verse');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxRawBtn = document.getElementById('lightbox-raw-btn');
const closeBtn = document.getElementById('lightbox-close');
const prevBtn = document.getElementById('lightbox-prev');
const nextBtn = document.getElementById('lightbox-next');

let currentIndex = 0;

function openCard(index) {
  currentIndex = (index + cards.length) % cards.length;
  const card = cards[currentIndex];
  const fullSrc = card.dataset.full;
  const title = card.dataset.title;
  const verse = card.dataset.verse;
  const desc = card.dataset.desc;

  lightboxImg.src = fullSrc;
  lightboxTitle.textContent = title;
  lightboxVerse.textContent = verse;
  lightboxDesc.textContent = desc;
  lightboxRawBtn.href = fullSrc;
  lightboxRawBtn.setAttribute('download', fullSrc);

  dialog.showModal();
}

cards.forEach((card, idx) => {
  card.addEventListener('click', () => openCard(idx));
});

closeBtn?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

prevBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  openCard(currentIndex - 1);
});

nextBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  openCard(currentIndex + 1);
});

window.addEventListener('keydown', (e) => {
  if (!dialog?.open) return;
  if (e.key === 'ArrowLeft') openCard(currentIndex - 1);
  if (e.key === 'ArrowRight') openCard(currentIndex + 1);
  if (e.key === 'Escape') dialog.close();
});

// Ambient Cathedral Drone Synthesizer (Web Audio API)
let audioCtx = null;
let isAudioPlaying = false;
let masterGain = null;
let oscillators = [];

function toggleCathedralAudio() {
  const btn = document.getElementById('audio-toggle');
  const btnText = btn?.querySelector('.btn-text');

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Reverb simulation via feedback delay
    const delay = audioCtx.createDelay();
    delay.delayTime.setValueAtTime(0.45, audioCtx.currentTime);
    const feedback = audioCtx.createGain();
    feedback.gain.setValueAtTime(0.65, audioCtx.currentTime);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, audioCtx.currentTime);

    delay.connect(feedback);
    feedback.connect(filter);
    filter.connect(delay);
    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Low Cathedral Pipe Organ / Dark Drone chords (D minor sacred root: D2, A2, D3, F3)
    const frequencies = [73.42, 110.00, 146.83, 174.61];
    frequencies.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      const oscFilter = audioCtx.createBiquadFilter();
      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(320, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(delay);
      oscGain.connect(masterGain);

      osc.start();
      oscillators.push(osc);
    });
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (!isAudioPlaying) {
    masterGain.gain.setTargetAtTime(0.2, audioCtx.currentTime, 1.5);
    isAudioPlaying = true;
    if (btnText) btnText.textContent = 'AMBIENT : CHOIR ON';
    btn?.classList.add('active');
  } else {
    masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 1);
    isAudioPlaying = false;
    if (btnText) btnText.textContent = 'AMBIENT : OFF';
    btn?.classList.remove('active');
  }
}

document.getElementById('audio-toggle')?.addEventListener('click', toggleCathedralAudio);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  createCathedralDust();
});
