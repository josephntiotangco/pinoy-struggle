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
    // sheet: "base", row: 7, frames: 4, duration: .72, previewDuration: 1.4, projectile: true,
    //JT-2026/11/25 - preview the same haduken release pose used in combat
    sheet: "base", pose: juanHadukenPose, duration: JUAN_HADUKEN.duration, previewDuration: 1.4, projectile: true,
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

//JT-2026/11/25 - reuse ana's combat sheets and share the prayer sound between fighters
// const gloriaPreviewSheets = Object.fromEntries(Object.entries(GLORIA_ATLASES).map(([key, id]) => [key, {
  // id, frame: key === "spirit" ? GLORIA_SPIRIT_FRAME : GLORIA_FRAME,
//JT-2026/11/28 - use ana for the fighter and her moves
const anaPreviewSheets = Object.fromEntries(Object.entries(ANA_ATLASES).map(([key, id]) => [key, {
  id, frame: key === "spirit" ? ANA_SPIRIT_FRAME : ANA_FRAME,
}]));
// const gloriaPreviews = Object.fromEntries(Object.entries(GLORIA_SKILLS).map(([slot, skill]) => [slot, {
//JT-2026/11/28 - use ana for the fighter and her moves
const anaPreviews = Object.fromEntries(Object.entries(ANA_SKILLS).map(([slot, skill]) => [slot, {
  ...skill, slot, previewDuration: skill.thrown ? 1.35 : skill.duration,
  sound: slot === "pray" ? skillPreviews.pray.sound : skill.sound,
}]));

//JT-2026/11/27 - preview jose with the same poses, projectiles, and sounds as combat
const josePreviewSheets = { base: { id: JOSE_PROFILE.id, frame: JOSE_FRAME } };
const josePreviews = Object.fromEntries(Object.entries(JOSE_SKILLS).map(([slot, skill]) => [slot, {
  ...skill, slot, sheet: "base", previewDuration: skill.projectile ? 1.8 : skill.duration,
  sound: slot === "pray" ? skillPreviews.pray.sound : skill.sound,
}]));

//JT-2026/11/28 - give maria's preview enough time to show the falling rack and crash
const mariaPreviewSheets = { base: { id: MARIA_ATLASES.base }, fx: { id: MARIA_ATLASES.fx } };
const mariaPreviewLanding = 1.15;
const mariaPreviews = Object.fromEntries(Object.entries(MARIA_SKILLS).map(([slot, skill]) => {
  const move = skill.dropStart ? {
    ...skill, impact: mariaPreviewLanding, duration: 2.7, dropHeight: 116,
    soundEnd: mariaPreviewLanding + (skill.soundEnd - skill.impact),
  } : skill;
  return [slot, {
    ...move, slot, sheet: "base", previewDuration: skill.projectile ? 1.85 : move.duration,
    sound: slot === "pray" ? skillPreviews.pray.sound : skill.sound,
  }];
}));

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
//JT-2026/11/25 - track fighter selection and preserve the default juan labels
//JT-2026/11/27 - add jose to the existing web and android fighter picker
appendJoseFighterOption();
//JT-2026/11/27 - add maria to the existing web and android fighter picker
appendMariaFighterOption();
const fighterButtons = [...document.querySelectorAll("button[data-fighter]")];
const fighterModeLinks = [...document.querySelectorAll(".mode-grid a")];
//JT-2026/11/28 - give players the background of each fighter before choosing a mode
const fighterDescription = document.getElementById("fighter-description");
const fighterDescriptions = {
  juan: "Juan is an off-duty construction worker on a no-work, no-pay contract. He faces the everyday challenges of life as a Filipino.",
  ana: "Ana works in an office in a well-known central business district. She faces a tough commute every workday while dealing with the everyday challenges of life in the Philippines.",
  jose: "Jose is a company driver and union leader at a beverage company. He stands up for fair benefits for his coworkers while facing the everyday hardships of life in the Philippines.",
  maria: "Maria is a contract sales associate at a well-known department store. Under a no-work, no-pay policy, she faces the daily challenge of making ends meet in the Philippines.",
};
const juanSkillLabels = new Map(skillButtons.map(button => [button, button.firstElementChild.textContent]));
let previewFighter;
let activeSkillSheets = skillSheets;
let activeSkillPreviews = skillPreviews;
let skillArtRequested = false;
//JT-2026/11/25 - retain the spirit bomb cast so switching previews can stop its active cue
let skillUltimateCast = null;

// showSkillDetails(selectedSkillButton);
//JT-2026/11/25 - switch fighter previews and carry the selection into arena or survival
setPreviewFighter(selectedFighter());
for (const button of fighterButtons) button.addEventListener("click", () => setPreviewFighter(button.dataset.fighter, true));
for (const button of skillButtons) button.addEventListener("click", () => playSkillPreview(button));
skillReplay.addEventListener("click", () => playSkillPreview(selectedSkillButton));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;
  stopSkillPreview();
  // drawSkillPreview(skillPreviews[selectedSkillButton.dataset.skill]);
  //JT-2026/11/25 - return to the selected fighter's idle pose when the tab is hidden
  drawSkillPreview(activeSkillPreviews[selectedSkillButton.dataset.skill]);
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
  //JT-2026/11/25 - cache decoded sheets and ignore a load from a previous fighter
  skillArtRequested = true;
  const sheets = activeSkillSheets;
  skillStatus.hidden = false;
  skillStatus.textContent = "Loading skill preview…";
  // await Promise.allSettled(Object.values(skillSheets).map(async sheet => {
  //   const image = new Image();
  //   image.src = "assets/arcade/" + sheet.id + ".png";
  //   await image.decode();
  //   sheet.image = image;
  // }));
  await Promise.allSettled(Object.values(sheets).map(sheet => sheet.ready ??= (async () => {
    const image = new Image();
    image.src = "assets/arcade/" + sheet.id + ".png";
    await image.decode();
    sheet.image = image;
  })()));
  if (sheets !== activeSkillSheets) return;
  for (const sheet of Object.values(sheets)) if (!sheet.image) sheet.ready = null;
  for (const button of skillButtons) {
    // button.disabled = !skillContext || !skillSheets[skillPreviews[button.dataset.skill].sheet].image;
    // button.disabled = !skillContext || !sheets[activeSkillPreviews[button.dataset.skill].sheet].image;
    //JT-2026/11/28 - require maria's effects sheet for previews that use it
    const skill = activeSkillPreviews[button.dataset.skill];
    button.disabled = !skillContext || !sheets[skill.sheet].image ||
      (sheets === mariaPreviewSheets && Boolean(skill.projectile || skill.dropStart) && !sheets.fx.image);
  }
  const available = skillButtons.find(button => !button.disabled);
  if (!available) {
    skillStatus.textContent = "Skill previews could not load.";
    return;
  }
  if (selectedSkillButton.disabled) showSkillDetails(available);
  skillStatus.hidden = true;
  skillReplay.disabled = false;
  // drawSkillPreview(skillPreviews[selectedSkillButton.dataset.skill]);
  drawSkillPreview(activeSkillPreviews[selectedSkillButton.dataset.skill]);
}

//JT-2026/11/24 - highlight the selected move and show what inspired it
function showSkillDetails(button) {
  selectedSkillButton = button;
  // const skill = skillPreviews[button.dataset.skill];
  //JT-2026/11/25 - show the selected fighter's move description and inspiration
  const skill = activeSkillPreviews[button.dataset.skill];
  for (const item of skillButtons) item.setAttribute("aria-pressed", String(item === button));
  skillName.textContent = button.firstElementChild.textContent;
  skillDescription.textContent = skill.description;
  skillInspiration.textContent = "Inspired by " + skill.inspiration;
}

//JT-2026/11/24 - wait for timed audio before advancing its matching animation
async function playSkillPreview(button) {
  stopSkillPreview();
  showSkillDetails(button);
  // const skill = skillPreviews[button.dataset.skill];
  //JT-2026/11/25 - play the selected fighter's sprite sequence and audio
  const skill = activeSkillPreviews[button.dataset.skill];
  const playback = skillPlayback;
  //JT-2026/11/25 - preview spirit bomb with the same charge and release timeline as combat
  // if (skill.chargeSound) {
  //JT-2026/11/27 - give jose's immediate slash the same standalone audio as combat
  if (skill.slot === "almightyPush") {
    skillUltimateCast = { kind: button.dataset.skill, elapsed: 0, cast: skill };
    resumeAlmightyPushVoice(skillUltimateCast);
    drawSkillPreview(skill, 0);
    animateSkillPreview(skill, null);
    return;
  }
  // const sound = playSkillSound(skill, playback);
  //JT-2026/11/25 - wait until release frames for ana's strike effects
  const sound = skill.effect ? null : playSkillSound(skill, playback);
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
  //JT-2026/11/25 - stop either spirit bomb cue when the player leaves its preview
  pauseAlmightyPushVoice(skillUltimateCast);
  skillUltimateCast = null;
  skillOscillator?.stop();
  skillOscillator = null;
}

//JT-2026/11/24 - let timed previews follow the playing clip while keeping the original fight tones
function playSkillSound(skill, playback) {
  if (skill.sound) {
    const clip = new Audio("assets/" + skill.sound.file);
    clip.volume = skill.sound.volume;
    //JT-2026/11/25 - start the throw preview at the audible portion of the recorded clip
    if (skill.sound.offset) clip.currentTime = skill.sound.offset;
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
  //JT-2026/11/27 - use jose's shared pose and projectile art in the preview
  if (previewFighter === "jose") {
    drawJoseSkillPreview(skill, elapsed);
    return;
  }
  //JT-2026/11/27 - use maria's shared pose and projectile art in the preview
  if (previewFighter === "maria") {
    drawMariaSkillPreview(skill, elapsed);
    return;
  }
  //JT-2026/11/25 - draw ana's animation from the selected combat atlas
  // if (previewFighter === "gloria") {
    // drawGloriaSkillPreview(skill, elapsed);
  //JT-2026/11/28 - use ana for the fighter and her moves
  if (previewFighter === "ana") {
    drawAnaSkillPreview(skill, elapsed);
    return;
  }
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
  // if (active && pose.sheet === "ultimate") lift = almightyPushLift(elapsed) * size;
  //JT-2026/11/25 - preview the expanding shockwave from juan's torso
  if (active && pose.sheet === "ultimate") {
    lift = almightyPushLift(elapsed) * size;
    drawAlmightyPushWave(skillContext, x, floor - lift, size, elapsed);
  }
  else if (active && skill.lift) lift = Math.sin(elapsed / skill.duration * Math.PI) * skill.lift;
  skillContext.drawImage(image, column * frame.width, row * frame.height, frame.width, frame.height,
    x - frame.x * size, floor - lift - frame.y * size, frame.width * size, frame.height * size);
  // if (skill.projectile && elapsed >= .29 && elapsed < skill.previewDuration) drawSkillProjectile(x, floor, elapsed - .29);
  //JT-2026/11/25 - launch the preview wave at juan's hand height
  if (skill.projectile && elapsed >= JUAN_HADUKEN.impact && elapsed < skill.previewDuration) {
    drawSkillProjectile(x, floor - JUAN_HADUKEN.handHeight * size, elapsed - JUAN_HADUKEN.impact);
  }
}

//JT-2026/11/24 - send the existing energy wave sprite across the preview stage
// function drawSkillProjectile(x, floor, elapsed) {
//JT-2026/11/25 - hold the projectile on the hand's vertical line in the preview
function drawSkillProjectile(x, handY, elapsed) {
  const { image, frame } = skillSheets.base;
  const size = .93;
  const position = x + 36 + elapsed * 470;
  skillContext.drawImage(image, 0, 9 * frame.height, frame.width, frame.height,
    // position - frame.x * size, floor - 65 - frame.height * size / 2, frame.width * size, frame.height * size);
    position - frame.x * size, handY - frame.height * size / 2, frame.width * size, frame.height * size);
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
  // const cast = clip ? { elapsed: 0, voice: { clip, started: true, stalled: 0 } } : null;
  //JT-2026/11/25 - advance the shared spirit bomb cast or the original preview audio
  const cast = skillUltimateCast ?? (clip ? { elapsed: 0, voice: { clip, started: true, stalled: 0 } } : null);
  const cueTimes = skill.effect ? [skill.impact, ...(skill.followUps ?? [])] : [];
  let nextCue = 0;
  let lastFrame = started;
  skillFrame = requestAnimationFrame(function animateSkill(now) {
    if (cast) advanceAlmightyPush(cast, (now - lastFrame) / 1000);
    lastFrame = now;
    const elapsed = cast?.elapsed ?? (now - started) / 1000;
    if (elapsed >= cueTimes[nextCue]) {
      skillAudio?.pause();
      clearTimeout(skillAudioTimer);
      playSkillSound(skill, skillPlayback);
      nextCue++;
    }
    const playing = elapsed < duration;
    drawSkillPreview(skill, playing ? elapsed : Infinity);
    skillFrame = playing ? requestAnimationFrame(animateSkill) : 0;
  });
}

//JT-2026/11/25 - update the fighter choice, mode links, and skill controls together
function setPreviewFighter(fighter, save = false) {
  if (fighter === previewFighter) return;
  stopSkillPreview();
  previewFighter = fighter;
  // const gloria = fighter === "gloria";
  //JT-2026/11/28 - use ana for the fighter and her moves
  const ana = fighter === "ana";
  // const name = gloria ? "Gloria" : "Juan";
  //JT-2026/11/27 - display the selected name and pass jose into both mode links
  const name = FIGHTER_NAMES[fighter];
  if (save) {
    rememberFighter(fighter);
    const url = new URL(window.location.href);
    url.searchParams.set("fighter", fighter);
    try { window.history.replaceState(null, "", url); }
    catch { /* Mode links retain the selection on local pages. */ }
  }
  for (const button of fighterButtons) button.setAttribute("aria-pressed", String(button.dataset.fighter === fighter));
  //JT-2026/11/28 - update the description with the current fighter selection
  if (fighterDescription) fighterDescription.textContent = fighterDescriptions[fighter] ?? "";
  for (const link of fighterModeLinks) {
    // if (gloria) linkToFighterPage(link, fighter);
    //JT-2026/11/27 - carry both alternate fighters to combat
    if (fighter !== "juan") linkToFighterPage(link, fighter);
    else link.setAttribute("href", link.getAttribute("href").split("?")[0]);
  }
  document.getElementById("skills-fighter").textContent = name + "’s";
  skillCanvas.setAttribute("aria-label", name + "’s skill animation");
  // activeSkillSheets = gloria ? gloriaPreviewSheets : skillSheets;
  // activeSkillPreviews = gloria ? gloriaPreviews : skillPreviews;
  //JT-2026/11/27 - choose jose's shared preview data and atlas
  activeSkillSheets = fighter === "jose" ? josePreviewSheets : fighter === "maria" ? mariaPreviewSheets : ana ? anaPreviewSheets : skillSheets;
  activeSkillPreviews = fighter === "jose" ? josePreviews : fighter === "maria" ? mariaPreviews : ana ? anaPreviews : skillPreviews;
  for (const button of skillButtons) {
    // button.firstElementChild.textContent = gloria ? activeSkillPreviews[button.dataset.skill].label : juanSkillLabels.get(button);
    //JT-2026/11/27 - keep move labels in sync with the active preview
    button.firstElementChild.textContent = activeSkillPreviews[button.dataset.skill].label ?? juanSkillLabels.get(button);
    button.disabled = true;
  }
  skillReplay.disabled = true;
  showSkillDetails(skillButtons[0]);
  skillContext?.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
  if (skillArtRequested) loadSkillPreviewArt();
}

//JT-2026/11/25 - preview ana's throw, beam, barrage, and airborne spirit bomb
// function drawGloriaSkillPreview(skill, elapsed) {
//JT-2026/11/28 - use ana for the fighter and her moves
function drawAnaSkillPreview(skill, elapsed) {
  const active = elapsed < skill.duration;
  const spirit = skill.slot === "almightyPush";
  // const [, row, column] = active ? gloriaSkillPose(skill.slot, elapsed) : [GLORIA_ATLASES.base, 0, 0];
  // const { image, frame } = gloriaPreviewSheets[active ? skill.sheet : "base"];
  //JT-2026/11/28 - use ana for the fighter and her moves
  const [, row, column] = active ? anaSkillPose(skill.slot, elapsed) : [ANA_ATLASES.base, 0, 0];
  const { image, frame } = anaPreviewSheets[active ? skill.sheet : "base"];
  const x = skill.thrown || skill.beamEnd ? 285 : 385;
  const floor = spirit ? 325 : 308;
  const size = spirit ? 1 : 1.23;
  const { width, height, x: anchorX, y: anchorY } = frame;
  skillContext.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
  if (!image) return;
  skillContext.fillStyle = "#110e0bb3";
  skillContext.beginPath();
  skillContext.ellipse(x, floor + 2, 41, 9, 0, 0, Math.PI * 2);
  skillContext.fill();
  // if (active && skill.beamEnd) {
  //   skillContext.save();
  //   skillContext.translate(x + 165 * size, floor - 81 * size);
  //   drawBasookaBeam(skillContext, skillCanvas.width - x, elapsed, 19);
  //   skillContext.restore();
  // }
  //JT-2026/11/27 - align the rei gun preview with the shared release art
  const beam = active && skill.beamEnd && reiGunBeamPose(elapsed);
  if (beam) {
    const start = x + beam.x * size;
    skillContext.save();
    skillContext.translate(start, floor - beam.y * size);
    drawReiGunBeam(skillContext, image, skillCanvas.width - start, size, beam.column);
    skillContext.restore();
  }
  // const lift = active && spirit ? gloriaSpiritLift(elapsed) * size : 0;
  // if (active && spirit) drawGloriaSpiritOrb(skillContext, image, x, floor - lift, size, elapsed, skillCanvas.width);
  //JT-2026/11/28 - use ana for the fighter and her moves
  const lift = active && spirit ? anaSpiritLift(elapsed) * size : 0;
  if (active && spirit) drawAnaSpiritOrb(skillContext, image, x, floor - lift, size, elapsed, skillCanvas.width);
  skillContext.drawImage(image, column * width, row * height, width, height,
    x - anchorX * size, floor - lift - anchorY * size, width * size, height * size);
  // if (skill.thrown && elapsed >= skill.impact && elapsed < skill.previewDuration && gloriaPreviewSheets.base.image) {
  //JT-2026/11/28 - use ana for the fighter and her moves
  if (skill.thrown && elapsed >= skill.impact && elapsed < skill.previewDuration && anaPreviewSheets.base.image) {
    const position = x + 55 + (elapsed - skill.impact) * 465;
    // skillContext.drawImage(gloriaPreviewSheets.base.image, 0, 8 * height, width, height,
    //JT-2026/11/28 - use ana for the fighter and her moves
    skillContext.drawImage(anaPreviewSheets.base.image, 0, 8 * height, width, height,
      position - anchorX, floor - 66 - anchorY, width, height);
  }
}

//JT-2026/11/27 - add the third portrait wherever the shared fighter picker is present
function appendJoseFighterOption() {
  const options = document.querySelector(".fighter-options");
  if (!options || options.querySelector('[data-fighter="jose"]')) return;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.fighter = "jose";
  button.setAttribute("aria-pressed", "false");
  const portrait = document.createElement("img");
  portrait.src = "assets/arcade/previews/hero_jose.png";
  portrait.alt = "";
  portrait.width = 128;
  portrait.height = 160;
  const label = document.createElement("span");
  label.textContent = FIGHTER_NAMES.jose;
  button.append(portrait, label);
  options.append(button);
}

//JT-2026/11/27 - add the fourth portrait wherever the shared fighter picker is present
function appendMariaFighterOption() {
  const options = document.querySelector(".fighter-options");
  if (!options || options.querySelector('[data-fighter="maria"]')) return;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.fighter = "maria";
  button.setAttribute("aria-pressed", "false");
  const portrait = document.createElement("img");
  portrait.src = "assets/arcade/previews/hero_maria.png";
  portrait.alt = "";
  portrait.width = 128;
  portrait.height = 160;
  const label = document.createElement("span");
  label.textContent = FIGHTER_NAMES.maria;
  button.append(portrait, label);
  options.append(button);
}

//JT-2026/11/27 - show jose's full moves, including the end of his prayer sequence
function drawJoseSkillPreview(skill, elapsed) {
  const { image, frame } = josePreviewSheets.base;
  skillContext.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
  if (!image) return;
  const x = skill.projectile ? 285 : skillCanvas.width / 2;
  const floor = 308;
  const size = 1.24;
  const { width, height, x: anchorX, y: anchorY } = frame;
  const [row, column] = elapsed < skill.duration ? joseSkillPose(skill.slot, elapsed, true) : [0, 0];
  skillContext.fillStyle = "#110e0bb3";
  skillContext.beginPath();
  skillContext.ellipse(x, floor + 2, 41, 9, 0, 0, Math.PI * 2);
  skillContext.fill();
  skillContext.drawImage(image, column * width, row * height, width, height,
    x - anchorX * size, floor - anchorY * size, width * size, height * size);
  if (skill.projectile && elapsed >= skill.impact && elapsed < skill.previewDuration) {
    const projectile = skill.projectile;
    skillContext.save();
    skillContext.translate(x + 65 + (elapsed - skill.impact) * projectile.speed * .75, floor - projectile.handHeight * size);
    drawJoseProjectile(skillContext, image, projectile, size);
    skillContext.restore();
  }
}

//JT-2026/11/28 - show maria's props and hold the broken rack after its preview lands
function drawMariaSkillPreview(skill, elapsed) {
  const image = mariaPreviewSheets.base.image;
  const effects = mariaPreviewSheets.fx.image;
  skillContext.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
  if (!image) return;
  const x = skill.projectile || skill.dropStart ? 285 : skillCanvas.width / 2;
  const floor = 308;
  const size = 1.23;
  const { width, height, x: anchorX, y: anchorY } = MARIA_FRAME;
  const poseTime = skill.dropStart ? elapsed * MARIA_SKILLS.almightyPush.duration / skill.duration : elapsed;
  const [row, column] = elapsed < skill.duration ? mariaSkillPose(skill.slot, poseTime, true) : [0, 0];
  skillContext.fillStyle = "#110e0bb3";
  skillContext.beginPath();
  skillContext.ellipse(x, floor + 2, 41, 9, 0, 0, Math.PI * 2);
  skillContext.fill();
  skillContext.drawImage(image, column * width, row * height, width, height,
    x - anchorX * size, floor - anchorY * size, width * size, height * size);
  if (skill.projectile && elapsed >= skill.impact && elapsed < skill.previewDuration) {
    const projectile = skill.projectile;
    const releases = [skill.impact, ...(skill.followUps ?? [])];
    for (const [volley, release] of releases.entries()) {
      const flight = elapsed - release;
      if (flight < 0) break;
      const position = x + 51 + flight * projectile.speed * .72;
      skillContext.save();
      skillContext.translate(position, floor - projectile.handHeight * size);
      drawMariaProjectile(skillContext, effects, projectile, flight, size, volley);
      skillContext.restore();
    }
  }
  if (skill.dropStart && elapsed >= skill.dropStart) {
    const landingX = skillCanvas.width * .68;
    const rackTime = Math.min(elapsed, skill.duration - .01);
    skillContext.fillStyle = "#110e0bb3";
    skillContext.beginPath();
    skillContext.ellipse(landingX, floor + 2, 57, 9, 0, 0, Math.PI * 2);
    skillContext.fill();
    drawMariaGondolaFall(skillContext, effects, landingX, floor, 1.05, rackTime, skill);
  }
}
