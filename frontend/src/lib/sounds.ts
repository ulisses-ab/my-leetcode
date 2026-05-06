let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// Sine tone — for musical feedback sounds
function tone(
  freq: number,
  duration: number,
  volume = 0.07,
  type: OscillatorType = "sine",
  delaySeconds = 0,
) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delaySeconds;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

// White-noise burst through a highpass filter — sounds like a physical button
function noiseBurst(duration: number, volume: number, hipassHz: number, delaySeconds = 0) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delaySeconds;
  const numSamples = Math.ceil(c.sampleRate * duration);
  const buf = c.createBuffer(1, numSamples, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < numSamples; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = hipassHz;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  src.connect(hp);
  hp.connect(gain);
  gain.connect(c.destination);
  src.start(t);
  src.stop(t + duration + 0.01);
}

// Generic button click — noise burst with subtle low thump for body
export function playClick() {
  noiseBurst(0.022, 0.14, 900);
  tone(160, 0.016, 0.022, "square", 0);
}

// Tab switch — higher-pitched, shorter; less intrusive than click
export function playTab() {
  noiseBurst(0.015, 0.09, 1300);
  tone(260, 0.012, 0.016, "square", 0);
}

// File/node select — quiet tick, softer than click
export function playSelect() {
  noiseBurst(0.013, 0.07, 1100);
}

// Open dialog or dropdown — quick ascending double blip
export function playOpen() {
  tone(880, 0.032, 0.048, "sine", 0);
  tone(1108.73, 0.048, 0.038, "sine", 0.032);
}

// Close / cancel — brief descending tone
export function playClose() {
  tone(622.25, 0.032, 0.048, "sine", 0);
  tone(440, 0.042, 0.036, "sine", 0.032);
}

// Delete — harsh double noise burst (destructive feedback)
export function playDelete() {
  noiseBurst(0.019, 0.16, 380, 0);
  noiseBurst(0.013, 0.11, 560, 0.032);
}

// Copy to clipboard — two-tone ping
export function playCopy() {
  tone(1318.51, 0.038, 0.044, "sine", 0);
  tone(1567.98, 0.055, 0.034, "sine", 0.038);
}

// Enter problem — noise snap + smooth rising octave sweep (G4 → G5), feels like "launching in"
export function playEnter() {
  noiseBurst(0.016, 0.12, 850);
  const c = ac();
  if (!c) return;
  const t = c.currentTime + 0.008;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(392, t);
  osc.frequency.exponentialRampToValueAtTime(784, t + 0.08);
  gain.gain.setValueAtTime(0.075, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.start(t);
  osc.stop(t + 0.13);
}

// Submit — rising sine sweep C5 → G5 (perfect fifth)
export function playSubmit() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, t);
  osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.09);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  osc.start(t);
  osc.stop(t + 0.16);
}

// Success — C major arpeggio: C5 → E5 → G5 → C6
export function playSuccess() {
  tone(523.25, 0.07, 0.07, "sine", 0);
  tone(659.25, 0.07, 0.07, "sine", 0.07);
  tone(783.99, 0.07, 0.07, "sine", 0.14);
  tone(1046.5,  0.13, 0.06, "sine", 0.21);
}

// Error — descending square-wave pair: A4 → E4 (buzzy CRT feel)
export function playError() {
  tone(440, 0.09, 0.065, "square", 0);
  tone(329.63, 0.14, 0.055, "square", 0.09);
}
