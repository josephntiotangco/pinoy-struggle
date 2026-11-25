"use strict";

//JT-2026/11/25 - share the selected fighter and gloria's move data across both modes and the preview
const FIGHTER_STORAGE = "pinoy-struggle-fighter";
const GLORIA_FRAME = { width: 520, height: 248, x: 140, y: 215, scale: 1.5 };
const GLORIA_SPIRIT_FRAME = { ...GLORIA_FRAME, height: 292 };
const GLORIA_ATLASES = { base: "hero_girl_0", barrage: "hero_girl_1", basooka: "hero_girl_2", spirit: "hero_girl_5" };
const GLORIA_PROFILE = { id: GLORIA_ATLASES.base, maxHealth: 100, size: 1.21, body: 25, speed: 263 };
const GLORIA_SPIRIT_RISE = .48;
const GLORIA_SPIRIT_CHARGE = 2.7;
const GLORIA_SKILLS = {
  punch: { label: "Slap", sheet: "base", row: 2, frames: 5, duration: .42, impact: .18, effect: "gloriaSlap",
    arena: { damage: 14, reach: 85, push: 144, stun: .25 }, survival: { damage: 30, reach: 1.45, charge: 30 },
    description: "A quick close-range strike that builds Special charge on hit.", inspiration: "the open-hand strikes used by arcade fighters.",
    sound: { file: "floraphonic-cartoon-slap-2-189831.mp3", offset: 0, duration: .37, volume: .54 } },
  kick: { label: "Throw", sheet: "base", row: 3, frames: 6, duration: .59, impact: .37, thrown: true, effect: "gloriaThrow",
    arena: { damage: 23, reach: 0, push: 205, stun: .29 }, survival: { damage: 50, charge: 50 },
    description: "Hurls a stapler across the stage and builds Special charge when it connects.", inspiration: "office supplies turned into improvised arcade projectiles.",
    sound: { file: "freesound_community-throw_object-97796.mp3", offset: .7, duration: .28, volume: .55 } },
  haduken: { label: "Basooka", sheet: "basooka", row: 0, frames: 8, columns: 4, duration: 1.16, impact: .50, beamEnd: .84, effect: "gloriaBasooka",
    arena: { damage: 100, reach: Infinity, push: 235, stun: .33 }, survival: { damage: 120, special: true, reach: 12 },
    description: "Fires a cannon beam straight ahead for one Special Bar. It can hit several enemies in the same lane in Survival.", inspiration: "the oversized energy cannons of arcade fighters.",
    sound: { file: "edr-pulse-laser-blast-135820.mp3", offset: 0, duration: .65, volume: .33 } },
  senpu: { label: "Kick Barrage", sheet: "barrage", row: 0, frames: 10, columns: 5, duration: .98, impact: .33, followUps: [.51, .69], effect: "gloriaBarrage",
    arena: { damage: 20, reach: 120, push: 28, stun: .22 }, survival: { damage: 27, special: true, reach: 2.6 },
    description: "Unleashes three lightning-fast kicks for one Special Bar. Each strike hits nearby enemies in Survival.", inspiration: "Chun-Li's lightning kicks in Street Fighter.",
    sound: { file: "floraphonic-cartoon-slap-2-189831.mp3", offset: 0, duration: .15, volume: .38 } },
  pray: { label: "Pray (Aura Charge)", sheet: "base", duration: 2.5,
    description: "Hold to charge one Special Bar every 2.5 seconds in Arena.", inspiration: "prayer and arcade power-up poses." },
  almightyPush: { label: "Spirit Bomb", sheet: "spirit", bars: 2, chargeEnd: GLORIA_SPIRIT_CHARGE,
    duration: GLORIA_SPIRIT_CHARGE + 2.43, impact: GLORIA_SPIRIT_CHARGE + .94,
    flashEnd: GLORIA_SPIRIT_CHARGE + 1.4, landingStart: GLORIA_SPIRIT_CHARGE + 1.78,
    chargeSound: { file: "super_saiyan_god.mp3", offset: .1, volume: .57 },
    soundEnd: GLORIA_SPIRIT_CHARGE + 1.632, sound: { file: "spirit-bomb!-made-with-Voicemod.mp3", volume: .58 }, syncSound: true,
    arena: { reach: 0, push: 350, stun: .34 }, survival: { special: true },
    description: "Gloria gathers energy overhead for 2.7 seconds, then hurls the Spirit Bomb diagonally downward for a one-hit knockout. It requires two full Special Bars and protects her until she lands.", inspiration: "the Spirit Bomb from Dragon Ball." },
};
const GLORIA_EFFECTS = Object.fromEntries(Object.values(GLORIA_SKILLS).filter(skill => skill.effect).map(skill => [skill.effect, skill.sound]));
const ARENA_SKILL_SLOTS = { light: "punch", heavy: "kick", energyWave: "haduken", superUpperCut: "senpu" };
const FIGHTER_KEY_SLOTS = { J: "punch", K: "kick", L: "haduken", I: "senpu", O: "almightyPush" };
//JT-2026/11/25 - share the measured hand height and release timing from juan's sprite
const JUAN_HADUKEN = { row: 7, impact: .29, duration: .72, handHeight: 96 };

//JT-2026/11/25 - use an explicit page selection before the saved fighter and default to juan
function selectedFighter() {
  const search = window.location?.search;
  const choice = search && new URLSearchParams(search).get("fighter");
  if (choice === "juan" || choice === "gloria") return choice;
  try { return window.localStorage.getItem(FIGHTER_STORAGE) === "gloria" ? "gloria" : "juan"; }
  catch { return "juan"; }
}

//JT-2026/11/25 - keep fighter selection usable when browser storage is unavailable
function rememberFighter(fighter) {
  try { window.localStorage.setItem(FIGHTER_STORAGE, fighter); }
  catch { /* The mode links also carry the selection. */ }
}

//JT-2026/11/25 - keep the selected fighter on links between static pages
function linkToFighterPage(link, fighter) {
  const href = link.getAttribute("href").split("?")[0];
  link.setAttribute("href", `${href}?fighter=${fighter}`);
}

//JT-2026/11/25 - keep control labels and the mode select link consistent with gloria's move set
function labelGloriaControls() {
  for (const item of document.querySelectorAll(".key-guide li")) {
    const slot = FIGHTER_KEY_SLOTS[item.querySelector("kbd")?.textContent];
    if (slot) item.querySelector("span").textContent = GLORIA_SKILLS[slot].label + (slot === "almightyPush" ? " · 2 bars to cast" : "");
  }
  for (const button of document.querySelectorAll("#touch-controls button[data-input], .touch-controls button[data-input]")) {
    const input = button.dataset.input;
    const slot = ARENA_SKILL_SLOTS[input] ?? input;
    if (slot !== "pray" && GLORIA_SKILLS[slot]) button.textContent = GLORIA_SKILLS[slot].label;
  }
  for (const link of document.querySelectorAll('.mode-link[href="./index.html"], .menu-link[href="index.html"], .menu-option[href="index.html"]')) {
    linkToFighterPage(link, "gloria");
  }
}

//JT-2026/11/25 - reuse the same strike timing and animation in combat and in the preview
function gloriaSkillPose(slot, elapsed) {
  const skill = GLORIA_SKILLS[slot];
  const id = GLORIA_ATLASES[skill.sheet];
  if (slot === "pray") {
    const step = Math.floor(elapsed * 10);
    return [id, 7, step < 5 ? step : 5 + (step - 5) % 2];
  }
  if (slot === "almightyPush") {
    if (elapsed < GLORIA_SPIRIT_RISE) return [id, 0, Math.floor(elapsed / GLORIA_SPIRIT_RISE * 4)];
    if (elapsed < skill.impact) return [id, 0, 3];
    const releasing = elapsed < skill.landingStart;
    const row = releasing ? 2 : 3;
    const [start, end, frames] = releasing ? [skill.impact, skill.landingStart, 2] : [skill.landingStart, skill.duration, 3];
    return [id, row, Math.min(frames - 1, Math.floor((elapsed - start) * frames / (end - start)))];
  }
  const step = Math.min(skill.frames - 1, Math.floor(elapsed / skill.duration * skill.frames));
  const columns = skill.columns ?? skill.frames;
  return [id, skill.row + Math.floor(step / columns), step % columns];
}

//JT-2026/11/25 - leave room for the growing orb during the hover and lift into release
function gloriaSpiritLift(elapsed) {
  const { impact, landingStart, duration } = GLORIA_SKILLS.almightyPush;
  const rise = Math.max(0, Math.min(1, (elapsed - .12) / .49));
  const releaseLift = Math.max(0, Math.min(1, (elapsed - impact) / .18));
  const descent = Math.max(0, Math.min(1, (elapsed - landingStart) / (duration - landingStart)));
  return (35 + 32 * releaseLift) * rise * (1 - descent);
}

//JT-2026/11/25 - schedule each of the three barrage hits at its own strike frame
function queueGloriaFollowUp(attack, followUps) {
  const next = attack.followUpIndex ?? 0;
  if (!followUps || next >= followUps.length) return;
  attack.followUpIndex = next + 1;
  attack.nextImpact = followUps[next];
  attack.spent = false;
}

//JT-2026/11/25 - paint the basooka beam using the move's release window
function drawBasookaBeam(context, length, elapsed, thickness) {
  const { impact, beamEnd } = GLORIA_SKILLS.haduken;
  if (elapsed < impact || elapsed >= beamEnd) return;
  const fade = 1 - (elapsed - impact) / (beamEnd - impact);
  context.save();
  context.globalAlpha *= .25 + .75 * fade;
  context.shadowColor = "#5fdcff";
  context.shadowBlur = 20;
  context.fillStyle = "#5bccff";
  context.fillRect(0, -thickness / 2, length, thickness);
  context.fillStyle = "#edffff";
  context.fillRect(0, -thickness / 5, length, thickness * .4);
  context.restore();
}

//JT-2026/11/25 - grow the spirit orb overhead without clipping it against the viewport
function drawGloriaSpiritOrb(context, atlas, x, y, size, elapsed, stageWidth) {
  const { chargeEnd, impact } = GLORIA_SKILLS.almightyPush;
  if (elapsed < GLORIA_SPIRIT_RISE || elapsed >= impact) return;
  const progress = Math.min(1, (elapsed - GLORIA_SPIRIT_RISE) / (chargeEnd - GLORIA_SPIRIT_RISE));
  const handY = y - 148 * size;
  const width = Math.min((24 + 134 * progress ** .72) * size, (handY - 6) * 201 / 189, stageWidth - 12);
  if (width <= 0) return;
  const height = width * 189 / 201;
  const left = Math.min(stageWidth - width - 6, Math.max(6, x - width / 2));
  const frame = GLORIA_SPIRIT_FRAME;
  context.drawImage(atlas, 3 * frame.width + 41, frame.height + 44, 201, 189, left, handY - height, width, height);
}

//JT-2026/11/25 - switch to juan's outstretched hands at the projectile launch frame
function juanHadukenPose(elapsed, duration = JUAN_HADUKEN.duration) {
  const { row, impact } = JUAN_HADUKEN;
  const column = elapsed < impact * .63 ? 0 : elapsed < impact ? 1 : elapsed < (impact + duration) / 2 ? 2 : 3;
  return [row, column];
}
