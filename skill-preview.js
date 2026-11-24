"use strict";

//JT-2026/11/24 - reuse juan's three combat sprite sheets in the preview
const skillSheets = {
  base: { id: "hero_0", frame: { width: 504, height: 234, x: 156, y: 225 } },
  actions: { id: "hero_1", frame: { width: 192, height: 250, x: 72, y: 241 } },
  ultimate: { id: ALMIGHTY_PUSH.id, frame: ALMIGHTY_PUSH.frame },
};
const idleSkillPose = { sheet: "base", row: 0, frames: 1 };

//JT-2026/11/24 - describe each move and pair it with its animation and sound
const skillPreviews = {
  punch: {
    description: "A quick close-range strike that builds Special charge on hit.",
    inspiration: "the short, straight jab used in boxing.",
    sheet: "actions", row: 0, frames: 9, duration: .42, tone: [175, 77, .07],
  },
  kick: {
    description: "A stronger close-range strike that reaches farther than Punch and builds more Special charge.",
    inspiration: "front kicks used in martial arts and arcade fighters.",
    sheet: "base", row: 3, frames: 4, duration: .61, tone: [145, 45, .13],
  },
  haduken: {
    description: "Fires a traveling burst of energy for one Special Bar.",
    inspiration: "Dragon Ball’s Kamehameha and Street Fighter’s Hadoken.",
    sheet: "base", row: 7, frames: 4, duration: .72, previewDuration: 1.4, projectile: true,
    sound: { file: "hadouken.mp3", volume: .7, duration: .9 },
  },
  senpu: {
    description: "A sweeping kick that costs one Special Bar. In Survival, it hits every enemy in its ring.",
    inspiration: "the Leaf Whirlwind from Naruto.",
    sheet: "base", row: 8, frames: 4, duration: .8, lift: 29,
    sound: { file: "konoha_senpu.mp3", volume: .7, duration: 1.64 },
  },
  pray: {
    description: "Hold to charge one Special Bar every 2.5 seconds in Arena.",
    inspiration: "a quiet moment of prayer and the rising auras of Dragon Ball power-ups.",
    sheet: "actions", duration: 2.5, pose: prayPreviewPose,
    sound: { file: "super_saiyan_god.mp3", volume: .72, duration: 2.5 },
  },
  almightyPush: {
    description: "Requires two full Special Bars and empties the meter. It knocks out the Arena opponent or every enemy on the field in Survival.",
    inspiration: "Shinra Tensei, Pain’s repulsive-force technique in Naruto.",
    sheet: "ultimate", duration: ALMIGHTY_PUSH.duration, pose: almightyPushPose,
    //JT-2026/11/24 - use the same voice and cast timeline as gameplay
    sound: ALMIGHTY_PUSH.sound, syncSound: true,
  },
};

//JT-2026/11/24 - connect the selection buttons and prepare art near the preview
const skillSection = document.getElementById("skills");
const skillCanvas = document.getElementById("skill-canvas");
const skillContext = skillCanvas.getContext("2d");
const skillButtons = [...skillSection.querySelectorAll("[data-skill]")];
const skillName = document.getElementById("skill-name");
const skillDescription = document.getElementById("skill-description");
const skillInspiration = document.getElementById("skill-inspiration");
const skillStatus = document.getElementById("skill-preview-status");
const skillReplay = document.getElementById("skill-replay");
let selectedSkillButton = skillButtons[0];
let skillFrame = 0;
let skillAudio = null;
let skillAudioTimer = 0;
let skillAudioContext = null;
let skillOscillator = null;
let skillPlayback = 0;

showSkillDetails(selectedSkillButton);
for (const button of skillButtons) button.addEventListener("click", () => playSkillPreview(button));
skillReplay.addEventListener("click", () => playSkillPreview(selectedSkillButton));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;
  stopSkillPreview();
  drawSkillPreview(skillPreviews[selectedSkillButton.dataset.skill]);
});
if ("IntersectionObserver" in window) {
  const nearby = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    nearby.disconnect();
    loadSkillPreviewArt();
  }, { rootMargin: "480px" });
  nearby.observe(skillSection);
} else {
  loadSkillPreviewArt();
}

//JT-2026/11/24 - decode the sprite sheets before enabling their moves
async function loadSkillPreviewArt() {
  skillStatus.hidden = false;
  skillStatus.textContent = "Loading skill preview…";
  await Promise.allSettled(Object.values(skillSheets).map(async sheet => {
    const image = new Image();
    image.src = "assets/arcade/" + sheet.id + ".png";
    await image.decode();
    sheet.image = image;
  }));
  for (const button of skillButtons) {
    button.disabled = !skillContext || !skillSheets[skillPreviews[button.dataset.skill].sheet].image;
  }
  const available = skillButtons.find(button => !button.disabled);
  if (!available) {
    skillStatus.textContent = "Skill previews could not load.";
    return;
  }
  if (selectedSkillButton.disabled) showSkillDetails(available);
  skillStatus.hidden = true;
  skillReplay.disabled = false;
  drawSkillPreview(skillPreviews[selectedSkillButton.dataset.skill]);
}

//JT-2026/11/24 - highlight the selected move and show what inspired it
function showSkillDetails(button) {
  selectedSkillButton = button;
  const skill = skillPreviews[button.dataset.skill];
  for (const item of skillButtons) item.setAttribute("aria-pressed", String(item === button));
  skillName.textContent = button.firstElementChild.textContent;
  skillDescription.textContent = skill.description;
  skillInspiration.textContent = "Inspired by " + skill.inspiration;
}

//JT-2026/11/24 - wait for timed audio before advancing its matching animation
async function playSkillPreview(button) {
  stopSkillPreview();
  showSkillDetails(button);
  const skill = skillPreviews[button.dataset.skill];
  const playback = skillPlayback;
  const sound = playSkillSound(skill, playback);
  drawSkillPreview(skill, 0);
  const clip = skill.syncSound ? await sound : null;
  if (playback === skillPlayback) animateSkillPreview(skill, clip);
}

//JT-2026/11/24 - stop the last animation and sound when the selection changes
function stopSkillPreview() {
  skillPlayback++;
  cancelAnimationFrame(skillFrame);
  clearTimeout(skillAudioTimer);
  skillAudio?.pause();
  skillAudio = null;
  skillOscillator?.stop();
  skillOscillator = null;
}

//JT-2026/11/24 - let timed previews follow the playing clip while keeping the original fight tones
function playSkillSound(skill, playback) {
  if (skill.sound) {
    const clip = new Audio("assets/" + skill.sound.file);
    clip.volume = skill.sound.volume;
    skillAudio = clip;
    return clip.play().then(() => {
      if (skillAudio === clip && skill.sound.duration) {
        skillAudioTimer = setTimeout(() => clip.pause(), skill.sound.duration * 1000);
      }
      return clip;
    }).catch(() => null);
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  skillAudioContext ??= new AudioContext();
  skillAudioContext.resume().then(() => {
    if (playback !== skillPlayback) return;
    const [high, low, duration] = skill.tone;
    const time = skillAudioContext.currentTime;
    const oscillator = skillAudioContext.createOscillator();
    const level = skillAudioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(high, time);
    oscillator.frequency.exponentialRampToValueAtTime(low, time + duration);
    level.gain.setValueAtTime(.045, time);
    level.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(level).connect(skillAudioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + duration);
    skillOscillator = oscillator;
    oscillator.onended = () => { if (skillOscillator === oscillator) skillOscillator = null; };
  }).catch(() => {});
}

//JT-2026/11/24 - show the selected skill on a fixed stage without starting a fight
function drawSkillPreview(skill, elapsed = Infinity) {
  if (!skillContext) return;
  const active = elapsed < skill.duration;
  const pose = active || !skillSheets.base.image ? skill : idleSkillPose;
  const { image, frame } = skillSheets[pose.sheet];
  const x = skill.projectile ? 300 : skillCanvas.width / 2;
  const floor = 308;
  const size = 1.24;
  skillContext.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
  if (!image) return;
  skillContext.fillStyle = "#110e0bb3";
  skillContext.beginPath();
  skillContext.ellipse(x, floor + 2, 41, 9, 0, 0, Math.PI * 2);
  skillContext.fill();
  const time = active ? elapsed : 0;
  const [row, column] = pose.pose?.(time) ?? [pose.row, Math.floor(time / (pose.duration ?? 1) * pose.frames)];
  let lift = 0;
  if (active && pose.sheet === "ultimate") lift = almightyPushLift(elapsed) * size;
  else if (active && skill.lift) lift = Math.sin(elapsed / skill.duration * Math.PI) * skill.lift;
  skillContext.drawImage(image, column * frame.width, row * frame.height, frame.width, frame.height,
    x - frame.x * size, floor - lift - frame.y * size, frame.width * size, frame.height * size);
  if (skill.projectile && elapsed >= .29 && elapsed < skill.previewDuration) drawSkillProjectile(x, floor, elapsed - .29);
}

//JT-2026/11/24 - send the existing energy wave sprite across the preview stage
function drawSkillProjectile(x, floor, elapsed) {
  const { image, frame } = skillSheets.base;
  const size = .93;
  const position = x + 36 + elapsed * 470;
  skillContext.drawImage(image, 0, 9 * frame.height, frame.width, frame.height,
    position - frame.x * size, floor - 65 - frame.height * size / 2, frame.width * size, frame.height * size);
}

//JT-2026/11/24 - repeat the peak aura frames while juan prays
function prayPreviewPose(elapsed) {
  const step = Math.floor(elapsed * 10);
  return [1, step < 5 ? step : 5 + (step - 5) % 2];
}

//JT-2026/11/24 - follow the voice cue and keep the delayed landing active after playback
function animateSkillPreview(skill, clip) {
  const started = performance.now();
  const duration = skill.previewDuration ?? skill.duration;
  const cast = clip ? { elapsed: 0, voice: { clip, started: true, stalled: 0 } } : null;
  let lastFrame = started;
  skillFrame = requestAnimationFrame(function animateSkill(now) {
    if (cast) advanceAlmightyPush(cast, (now - lastFrame) / 1000);
    lastFrame = now;
    const elapsed = cast?.elapsed ?? (now - started) / 1000;
    const playing = elapsed < duration;
    drawSkillPreview(skill, playing ? elapsed : Infinity);
    skillFrame = playing ? requestAnimationFrame(animateSkill) : 0;
  });
}
