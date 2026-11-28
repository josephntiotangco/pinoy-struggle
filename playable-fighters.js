"use strict";

//JT-2026/11/25 - share the selected fighter and ana's move data across both modes and the preview
const FIGHTER_STORAGE = "pinoy-struggle-fighter";
// const GLORIA_FRAME = { width: 520, height: 248, x: 140, y: 215, scale: 1.5 };
// const GLORIA_SPIRIT_FRAME = { ...GLORIA_FRAME, height: 292 };
//JT-2026/11/28 - use ana for the fighter and her moves
const ANA_FRAME = { width: 520, height: 248, x: 140, y: 215, scale: 1.5 };
const ANA_SPIRIT_FRAME = { ...ANA_FRAME, height: 292 };
// const GLORIA_ATLASES = { base: "hero_girl_0", barrage: "hero_girl_1", basooka: "hero_girl_2", spirit: "hero_girl_5" };
//JT-2026/11/27 - point ana's ranged special at the rei gun atlas
const ANA_ATLASES = { base: "hero_girl_0", barrage: "hero_girl_1", reiGun: "hero_girl_2", spirit: "hero_girl_5" };
// const GLORIA_PROFILE = { id: GLORIA_ATLASES.base, maxHealth: 100, size: 1.21, body: 25, speed: 263 };
// const GLORIA_SPIRIT_RISE = .48;
// const GLORIA_SPIRIT_CHARGE = 2.7;
// const GLORIA_SKILLS = {
  // punch: { label: "Slap", sheet: "base", row: 2, frames: 5, duration: .42, impact: .18, effect: "gloriaSlap",
//JT-2026/11/28 - use ana for the fighter and her moves
const ANA_PROFILE = { id: ANA_ATLASES.base, maxHealth: 100, size: 1.21, body: 25, speed: 263 };
const ANA_SPIRIT_RISE = .48;
const ANA_SPIRIT_CHARGE = 2.7;
const ANA_SKILLS = {
  punch: { label: "Slap", sheet: "base", row: 2, frames: 5, duration: .42, impact: .18, effect: "anaSlap",
    arena: { damage: 14, reach: 85, push: 144, stun: .25 }, survival: { damage: 30, reach: 1.45, charge: 30 },
    description: "A quick close-range strike that builds Special charge on hit.", inspiration: "the open-hand strikes used by arcade fighters.",
    sound: { file: "floraphonic-cartoon-slap-2-189831.mp3", offset: 0, duration: .37, volume: .54 } },
  // kick: { label: "Throw", sheet: "base", row: 3, frames: 6, duration: .59, impact: .37, thrown: true, effect: "gloriaThrow",
  //JT-2026/11/28 - use ana for the fighter and her moves
  kick: { label: "Throw", sheet: "base", row: 3, frames: 6, duration: .59, impact: .37, thrown: true, effect: "anaThrow",
    arena: { damage: 23, reach: 0, push: 205, stun: .29 }, survival: { damage: 50, charge: 50 },
    description: "Hurls a stapler across the stage and builds Special charge when it connects.", inspiration: "office supplies turned into improvised arcade projectiles.",
    sound: { file: "freesound_community-throw_object-97796.mp3", offset: .7, duration: .28, volume: .55 } },
  // haduken: { label: "Basooka", sheet: "basooka", row: 0, frames: 8, columns: 4, duration: 1.16, impact: .50, beamEnd: .84, effect: "gloriaBasooka",
  //   arena: { damage: 100, reach: Infinity, push: 235, stun: .33 }, survival: { damage: 120, special: true, reach: 12 },
  //   description: "Fires a cannon beam straight ahead for one Special Bar. It can hit several enemies in the same lane in Survival.", inspiration: "the oversized energy cannons of arcade fighters.",
  //   sound: { file: "edr-pulse-laser-blast-135820.mp3", offset: 0, duration: .65, volume: .33 } },
  //JT-2026/11/27 - time the rei gun hit and sound to ana's finger blast
  haduken: { label: "Rei Gun", sheet: "reiGun", row: 0, frames: 10, columns: 5, duration: 1.3, impact: .39, beamEnd: .78, effect: "anaReiGun",
    arena: { damage: 100, reach: Infinity, push: 235, stun: .33 }, survival: { damage: 120, special: true, reach: 12 },
    description: "Ana charges energy at her fingertip and fires a beam for one Special Bar. It can hit several enemies in the same lane in Survival.", inspiration: "the Spirit Gun from Yu Yu Hakusho.",
    sound: { file: "edr-pulse-laser-blast-135820.mp3", offset: 0, duration: .65, volume: .33 } },
  // senpu: { label: "Kick Barrage", sheet: "barrage", row: 0, frames: 10, columns: 5, duration: .98, impact: .33, followUps: [.51, .69], effect: "gloriaBarrage",
  //JT-2026/11/28 - use ana for the fighter and her moves
  senpu: { label: "Kick Barrage", sheet: "barrage", row: 0, frames: 10, columns: 5, duration: .98, impact: .33, followUps: [.51, .69], effect: "anaBarrage",
    arena: { damage: 20, reach: 120, push: 28, stun: .22 }, survival: { damage: 27, special: true, reach: 2.6 },
    description: "Unleashes three lightning-fast kicks for one Special Bar. Each strike hits nearby enemies in Survival.", inspiration: "Chun-Li's lightning kicks in Street Fighter.",
    sound: { file: "floraphonic-cartoon-slap-2-189831.mp3", offset: 0, duration: .15, volume: .38 } },
  pray: { label: "Pray (Aura Charge)", sheet: "base", duration: 2.5,
    description: "Hold to charge one Special Bar every 2.5 seconds in Arena.", inspiration: "prayer and arcade power-up poses." },
  // almightyPush: { label: "Spirit Bomb", sheet: "spirit", bars: 2, chargeEnd: GLORIA_SPIRIT_CHARGE,
    // duration: GLORIA_SPIRIT_CHARGE + 2.43, impact: GLORIA_SPIRIT_CHARGE + .94,
    // flashEnd: GLORIA_SPIRIT_CHARGE + 1.4, landingStart: GLORIA_SPIRIT_CHARGE + 1.78,
  //JT-2026/11/28 - use ana for the fighter and her moves
  almightyPush: { label: "Spirit Bomb", sheet: "spirit", bars: 2, chargeEnd: ANA_SPIRIT_CHARGE,
    duration: ANA_SPIRIT_CHARGE + 2.43, impact: ANA_SPIRIT_CHARGE + .94,
    flashEnd: ANA_SPIRIT_CHARGE + 1.4, landingStart: ANA_SPIRIT_CHARGE + 1.78,
    chargeSound: { file: "super_saiyan_god.mp3", offset: .1, volume: .57 },
    // soundEnd: GLORIA_SPIRIT_CHARGE + 1.632, sound: { file: "spirit-bomb!-made-with-Voicemod.mp3", volume: .58 }, syncSound: true,
    //JT-2026/11/28 - use ana for the fighter and her moves
    soundEnd: ANA_SPIRIT_CHARGE + 1.632, sound: { file: "spirit-bomb!-made-with-Voicemod.mp3", volume: .58 }, syncSound: true,
    arena: { reach: 0, push: 350, stun: .34 }, survival: { special: true },
    // description: "Gloria gathers energy overhead for 2.7 seconds, then hurls the Spirit Bomb diagonally downward for a one-hit knockout. It requires two full Special Bars and protects her until she lands.", inspiration: "the Spirit Bomb from Dragon Ball." },
    //JT-2026/11/28 - use ana for the fighter and her moves
    description: "Ana gathers energy overhead for 2.7 seconds, then hurls the Spirit Bomb diagonally downward for a one-hit knockout. It requires two full Special Bars and protects her until she lands.", inspiration: "the Spirit Bomb from Dragon Ball." },
};
// const GLORIA_EFFECTS = Object.fromEntries(Object.values(GLORIA_SKILLS).filter(skill => skill.effect).map(skill => [skill.effect, skill.sound]));
//JT-2026/11/28 - use ana for the fighter and her moves
const ANA_EFFECTS = Object.fromEntries(Object.values(ANA_SKILLS).filter(skill => skill.effect).map(skill => [skill.effect, skill.sound]));
const ARENA_SKILL_SLOTS = { light: "punch", heavy: "kick", energyWave: "haduken", superUpperCut: "senpu" };
const FIGHTER_KEY_SLOTS = { J: "punch", K: "kick", L: "haduken", I: "senpu", O: "almightyPush" };
//JT-2026/11/25 - share the measured hand height and release timing from juan's sprite
const JUAN_HADUKEN = { row: 7, impact: .29, duration: .72, handHeight: 96 };

//JT-2026/11/27 - share jose's move timing, prayer, and recorded cues across modes
const FIGHTER_NAMES = { juan: "Juan", ana: "Ana", jose: "Jose", maria: "Maria" };
const JOSE_FRAME = { width: 360, height: 264, x: 150, y: 241, scale: 1.5 };
const JOSE_PROFILE = { id: "hero_jose", maxHealth: 100, size: 1.21, body: 25, speed: 263 };
const JOSE_SKILLS = {
  punch: { label: "Newspaper Hack", row: 2, frames: 4, duration: .44, impact: .18, effect: "joseHack",
    arena: { damage: 14, reach: 92, push: 144, stun: .25 }, survival: { damage: 30, reach: 1.55, charge: 30 },
    description: "Jose swings one rolled newspaper in a quick slash and builds Special charge on hit.",
    inspiration: "the rolled newspapers carried by street vendors.",
    sound: { file: "54427377-sword-slash-476148.mp3", offset: .51, volume: .52, duration: .58 } },
  kick: { label: "Kick", row: 3, frames: 4, duration: .6, impact: .32, effect: "joseKick",
    arena: { damage: 23, reach: 120, push: 205, stun: .29 }, survival: { damage: 50, reach: 1.95, charge: 50 },
    description: "A long front kick that builds more Special charge on hit.",
    inspiration: "front kicks in arcade fighters.",
    sound: { file: "alice_soundz-best-sword-sounds-slice-slash-crash-swoosh-etc-224090.mp3", offset: 10.26, volume: .52, duration: .43 } },
  haduken: { label: "Megaphone Blast", row: 8, frames: 8, duration: 1.04, impact: .52, effect: "joseMegaphone",
    projectile: { column: 0, handHeight: 90, speed: 680, survivalSpeed: 12, survivalRadius: .5, size: .75 },
    arena: { damage: 90, reach: 0, push: 235, stun: .33 }, survival: { damage: 105, special: true },
    description: "Fires a fast sound wave from a megaphone for one Special Bar.",
    inspiration: "Sonic Boom from Street Fighter and the sound of a street megaphone.",
    sound: { file: "soundreality-blaster-fx-343681.mp3", offset: 0, volume: .43, duration: .58 } },
  senpu: { label: "Giant Swing", row: 9, frames: 5, duration: 1.12, impact: .49, effect: "joseSwing",
    projectile: { column: 1, handHeight: 90, speed: 500, survivalSpeed: 9, survivalRadius: .77, size: 1.05 },
    arena: { damage: 110, reach: 0, push: 270, stun: .35 }, survival: { damage: 125, special: true },
    description: "Swings a giant rolled newspaper to launch a wide crescent for one Special Bar.",
    inspiration: "the traveling crescent of Ichigo's Getsuga Tenshō in Bleach.",
    sound: { file: "getsuga_tenshou.mp3", offset: 0, volume: .52, duration: 2.6 } },
  pray: { label: "Pray (Aura Charge)", row: 7, frames: 8, duration: 2.5,
    description: ANA_SKILLS.pray.description, inspiration: ANA_SKILLS.pray.inspiration },
  almightyPush: { label: "3 Sword Style", row: 10, firstColumn: 4, frames: 4, bars: 2, duration: 1.55, impact: 0,
    soundEnd: 1.45, syncSound: true,
    sound: { file: "roronoa-zoro-santoryu.mp3", volume: .53 },
    arena: { reach: 0, push: 350, stun: .34 }, survival: { special: true },
    description: "Combines three rolled newspapers in a crossing strike. Requires two full Special Bars and empties the meter for an instant knockout.",
    inspiration: "Zoro's three-sword stance in One Piece and Jose's newspaper props." },
};
const JOSE_EFFECTS = Object.fromEntries(Object.values(JOSE_SKILLS).filter(skill => skill.effect).map(skill => [skill.effect, skill.sound]));

//JT-2026/11/28 - match maria's moves to the character and effect sprite grids
const MARIA_FRAME = { width: 360, height: 264, x: 128, y: 241, scale: 1.5 };
const MARIA_FX_FRAME = { width: 320, height: 220, x: 160, y: 204 };
const MARIA_ATLASES = { base: "hero_maria", fx: "hero_maria_fx" };
const MARIA_PROFILE = { id: MARIA_ATLASES.base, maxHealth: 100, size: 1.21, body: 25, speed: 263 };
const MARIA_SKILLS = {
  punch: { label: "Hanger Slap", row: 2, frames: 8, duration: .48, impact: .18, effect: "mariaSlap",
    arena: { damage: 14, reach: 85, push: 144, stun: .25 }, survival: { damage: 30, reach: 1.45, charge: 30 },
    description: "Swings a hanger at close range and builds Special charge on hit.", inspiration: "clothes hangers from a shop rack.",
    sound: { file: "floraphonic-cartoon-slap-2-189831.mp3", offset: 0, duration: .37, volume: .54 } },
  kick: { label: "Hanger Throw", row: 3, frames: 9, duration: .72, impact: .24, thrown: true, effect: "mariaThrow",
    projectile: { atlas: MARIA_ATLASES.fx, row: 0, frames: 8, handHeight: 95, speed: 610, survivalSpeed: 11, survivalRadius: .46, size: .72 },
    arena: { damage: 23, reach: 0, push: 205, stun: .29 }, survival: { damage: 50, charge: 50 },
    description: "Hurls a hanger across the stage and builds Special charge when it connects.", inspiration: "improvised projectiles from everyday items.",
    sound: { file: "freesound_community-throw_object-97796.mp3", offset: .7, duration: .28, volume: .55 } },
  haduken: { label: "Merchandise Barrage", row: 8, frames: 9, duration: .99, impact: .33, followUps: [.44, .55], effect: "mariaBarrage",
    projectile: { atlas: MARIA_ATLASES.fx, row: 1, volleyColumns: [2, 1, 5], handHeight: 90, speed: 575, survivalSpeed: 10, survivalRadius: .6, size: .8 },
    arena: { damage: 20, reach: 120, push: 28, stun: .22 }, survival: { damage: 27, special: true, reach: 2.6 },
    description: "Throws shirts, shoes, and other merchandise in three volleys for one Special Bar.", inspiration: "the clothes, shoes, and hangers on retail displays.",
    sound: { file: "floraphonic-cartoon-slap-2-189831.mp3", offset: 0, duration: .15, volume: .38 } },
  senpu: { label: "Gondola Push", row: 9, frames: 9, duration: 1.08, impact: .48, effect: "mariaGondolaPush",
    projectile: { atlas: MARIA_ATLASES.fx, row: 4, frames: 2, firstColumn: 1, handHeight: 0, speed: 525, survivalSpeed: 8, survivalRadius: .82, size: .95, pierces: true },
    arena: { damage: 100, reach: Infinity, push: 235, stun: .33 }, survival: { damage: 120, special: true, reach: 12 },
    description: "Sends a rolling merchandise rack down the lane for one Special Bar. It can hit several enemies in Survival.", inspiration: "the wheeled gondolas used for shop displays.",
    sound: { file: "rsf_studios-car-crash-swerving-and-crash-592672.mp3", offset: .36, duration: .65, volume: .33 } },
  pray: { label: "Pray (Aura Charge)", row: 7, frames: 9, duration: 2.5,
    description: ANA_SKILLS.pray.description, inspiration: ANA_SKILLS.pray.inspiration },
  almightyPush: { label: "Gondola Fall", row: 10, frames: 9, bars: 2, duration: 1.45, dropStart: .23, impact: .65,
    soundEnd: 1.33, soundAtImpact: true,
    sound: { file: "rsf_studios-car-crash-swerving-and-crash-592672.mp3", volume: .53, offset: .36 },
    arena: { reach: 0, push: 350, stun: .34 }, survival: { special: true },
    description: "Summons a gondola above each active opponent. Each rack knocks its target out on landing. Requires two full Special Bars and empties the meter.",
    inspiration: "gondola hazards in arcade stages." },
};
const MARIA_EFFECTS = Object.fromEntries(Object.values(MARIA_SKILLS).filter(skill => skill.effect).map(skill => [skill.effect, skill.sound]));

//JT-2026/11/25 - use an explicit page selection before the saved fighter and default to juan
function selectedFighter() {
  const search = window.location?.search;
  // const choice = search && new URLSearchParams(search).get("fighter");
  //JT-2026/11/28 - resolve old fighter links to ana's current id
  const query = search && new URLSearchParams(search).get("fighter");
  const choice = canonicalFighterId(query);
  // if (choice === "juan" || choice === "gloria") return choice;
  // try { return window.localStorage.getItem(FIGHTER_STORAGE) === "gloria" ? "gloria" : "juan"; }
  // catch { return "juan"; }
  //JT-2026/11/28 - update old links and saved selections without changing the fighter
  if (Object.hasOwn(FIGHTER_NAMES, choice)) {
    if (choice !== query) {
      const url = new URL(window.location.href);
      url.searchParams.set("fighter", choice);
      try { window.history.replaceState(window.history.state, "", url); }
      catch { /* Mode links still use the current fighter id. */ }
    }
    return choice;
  }
  try {
    const previous = window.localStorage.getItem(FIGHTER_STORAGE);
    const saved = canonicalFighterId(previous);
    if (saved !== previous) rememberFighter(saved);
    return Object.hasOwn(FIGHTER_NAMES, saved) ? saved : "juan";
  } catch { return "juan"; }
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

//JT-2026/11/25 - keep control labels and the mode select link consistent with ana's move set
// function labelGloriaControls() {
//JT-2026/11/27 - use the selected fighter's keyboard and touch labels in both modes
function labelFighterControls(fighter, skills) {
  for (const item of document.querySelectorAll(".key-guide li")) {
    const slot = FIGHTER_KEY_SLOTS[item.querySelector("kbd")?.textContent];
    // if (slot) item.querySelector("span").textContent = GLORIA_SKILLS[slot].label + (slot === "almightyPush" ? " · 2 bars to cast" : "");
    //JT-2026/11/27 - display the chosen fighter's keyboard moves
    if (slot) item.querySelector("span").textContent = skills[slot].label + (slot === "almightyPush" ? " · 2 bars to cast" : "");
  }
  for (const button of document.querySelectorAll("#touch-controls button[data-input], .touch-controls button[data-input]")) {
    const input = button.dataset.input;
    const slot = ARENA_SKILL_SLOTS[input] ?? input;
    // if (slot !== "pray" && GLORIA_SKILLS[slot]) button.textContent = GLORIA_SKILLS[slot].label;
    //JT-2026/11/27 - display the chosen fighter's touch moves
    if (slot !== "pray" && skills[slot]) button.textContent = skills[slot].label;
  }
  for (const link of document.querySelectorAll('.mode-link[href="./index.html"], .menu-link[href="index.html"], .menu-option[href="index.html"]')) {
    // linkToFighterPage(link, "gloria");
    //JT-2026/11/27 - carry the chosen fighter back to the menu
    linkToFighterPage(link, fighter);
  }
}

//JT-2026/11/25 - reuse the same strike timing and animation in combat and in the preview
// function gloriaSkillPose(slot, elapsed) {
  // const skill = GLORIA_SKILLS[slot];
  // const id = GLORIA_ATLASES[skill.sheet];
//JT-2026/11/28 - use ana for the fighter and her moves
function anaSkillPose(slot, elapsed) {
  const skill = ANA_SKILLS[slot];
  const id = ANA_ATLASES[skill.sheet];
  if (slot === "pray") {
    const step = Math.floor(elapsed * 10);
    return [id, 7, step < 5 ? step : 5 + (step - 5) % 2];
  }
  if (slot === "almightyPush") {
    // if (elapsed < GLORIA_SPIRIT_RISE) return [id, 0, Math.floor(elapsed / GLORIA_SPIRIT_RISE * 4)];
    //JT-2026/11/28 - use ana for the fighter and her moves
    if (elapsed < ANA_SPIRIT_RISE) return [id, 0, Math.floor(elapsed / ANA_SPIRIT_RISE * 4)];
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
// function gloriaSpiritLift(elapsed) {
  // const { impact, landingStart, duration } = GLORIA_SKILLS.almightyPush;
//JT-2026/11/28 - use ana for the fighter and her moves
function anaSpiritLift(elapsed) {
  const { impact, landingStart, duration } = ANA_SKILLS.almightyPush;
  const rise = Math.max(0, Math.min(1, (elapsed - .12) / .49));
  const releaseLift = Math.max(0, Math.min(1, (elapsed - impact) / .18));
  const descent = Math.max(0, Math.min(1, (elapsed - landingStart) / (duration - landingStart)));
  return (35 + 32 * releaseLift) * rise * (1 - descent);
}

//JT-2026/11/25 - schedule each of the three barrage hits at its own strike frame
// function queueGloriaFollowUp(attack, followUps) {
//JT-2026/11/28 - use ana for the fighter and her moves
function queueAttackFollowUp(attack, followUps) {
  const next = attack.followUpIndex ?? 0;
  if (!followUps || next >= followUps.length) return;
  attack.followUpIndex = next + 1;
  attack.nextImpact = followUps[next];
  attack.spent = false;
}

//JT-2026/11/25 - paint the basooka beam using the move's release window
/*
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
*/

//JT-2026/11/25 - grow the spirit orb overhead without clipping it against the viewport
// function drawGloriaSpiritOrb(context, atlas, x, y, size, elapsed, stageWidth) {
  // const { chargeEnd, impact } = GLORIA_SKILLS.almightyPush;
  // if (elapsed < GLORIA_SPIRIT_RISE || elapsed >= impact) return;
  // const progress = Math.min(1, (elapsed - GLORIA_SPIRIT_RISE) / (chargeEnd - GLORIA_SPIRIT_RISE));
//JT-2026/11/28 - use ana for the fighter and her moves
function drawAnaSpiritOrb(context, atlas, x, y, size, elapsed, stageWidth) {
  const { chargeEnd, impact } = ANA_SKILLS.almightyPush;
  if (elapsed < ANA_SPIRIT_RISE || elapsed >= impact) return;
  const progress = Math.min(1, (elapsed - ANA_SPIRIT_RISE) / (chargeEnd - ANA_SPIRIT_RISE));
  const handY = y - 148 * size;
  const width = Math.min((24 + 134 * progress ** .72) * size, (handY - 6) * 201 / 189, stageWidth - 12);
  if (width <= 0) return;
  const height = width * 189 / 201;
  const left = Math.min(stageWidth - width - 6, Math.max(6, x - width / 2));
  // const frame = GLORIA_SPIRIT_FRAME;
  //JT-2026/11/28 - use ana for the fighter and her moves
  const frame = ANA_SPIRIT_FRAME;
  context.drawImage(atlas, 3 * frame.width + 41, frame.height + 44, 201, 189, left, handY - height, width, height);
}

//JT-2026/11/25 - switch to juan's outstretched hands at the projectile launch frame
function juanHadukenPose(elapsed, duration = JUAN_HADUKEN.duration) {
  const { row, impact } = JUAN_HADUKEN;
  const column = elapsed < impact * .63 ? 0 : elapsed < impact ? 1 : elapsed < (impact + duration) / 2 ? 2 : 3;
  return [row, column];
}

//JT-2026/11/27 - loop the prayer aura and start the ultimate at the crossed slash
function joseSkillPose(slot, elapsed, finishPray = false) {
  const move = JOSE_SKILLS[slot];
  if (slot === "pray" && !finishPray) {
    const step = Math.floor(elapsed * 10);
    return [move.row, step < 4 ? step : 4 + (step - 4) % 2];
  }
  const column = Math.min(move.frames - 1, Math.floor(elapsed / move.duration * move.frames));
  return [move.row, (move.firstColumn ?? 0) + column];
}

//JT-2026/11/27 - draw jose's sound wave or crescent from its own cell
function drawJoseProjectile(context, image, projectile, scale) {
  const { width, height, x } = JOSE_FRAME;
  const size = projectile.size * scale;
  context.drawImage(image, projectile.column * width, 11 * height, width, height,
    -x * size, -height * size / 2, width * size, height * size);
}

//JT-2026/11/27 - match each rei gun release to the fingertip in its pose
function reiGunBeamPose(elapsed) {
  const move = ANA_SKILLS.haduken;
  if (elapsed < move.impact || elapsed >= move.beamEnd) return null;
  const [, row, column] = anaSkillPose("haduken", elapsed);
  const release = row * move.columns + column - 3;
  return { column: release, x: release === 0 ? 66 : 69, y: [70, 71, 86][release] };
}

//JT-2026/11/27 - draw the release art along the active beam path
function drawReiGunBeam(context, atlas, length, size, column) {
  if (!atlas?.naturalWidth || length <= 0) return;
  const { width, height } = ANA_FRAME;
  const reach = column === 0 ? Math.min(length, 228 * size) : length;
  context.drawImage(atlas, column * width, 2 * height, width, height,
    0, -height * size / 2, reach, height * size);
}

//JT-2026/11/28 - select maria's cast frames and loop her prayer aura
function mariaSkillPose(slot, elapsed, finishPray = false) {
  const move = MARIA_SKILLS[slot];
  if (slot === "pray" && !finishPray) {
    const step = Math.floor(elapsed * 10);
    return [move.row, step < 6 ? step : 6 + (step - 6) % 2];
  }
  return [move.row, Math.min(move.frames - 1, Math.floor(elapsed / move.duration * move.frames))];
}

//JT-2026/11/28 - animate maria's airborne props and grounded rack from the effects atlas
function drawMariaProjectile(context, image, projectile, elapsed, scale, volley) {
  if (!image?.naturalWidth) return;
  const { width, height, x, y } = MARIA_FX_FRAME;
  const size = projectile.size * scale;
  const column = projectile.volleyColumns?.[volley] ??
    ((projectile.firstColumn ?? 0) + Math.floor(elapsed * 16) % projectile.frames);
  const anchorY = projectile.handHeight ? height / 2 : y;
  context.drawImage(image, column * width, projectile.row * height, width, height,
    -x * size, -anchorY * size, width * size, height * size);
}

//JT-2026/11/28 - animate the falling rack with the active cast timing and drop height
function drawMariaGondolaFall(context, image, x, floor, size, elapsed, move = MARIA_SKILLS.almightyPush) {
  const { dropStart, impact, duration, dropHeight = 185 } = move;
  if (!image?.naturalWidth || elapsed < dropStart || elapsed >= duration) return;
  const { width, height, x: anchorX, y: anchorY } = MARIA_FX_FRAME;
  const falling = elapsed < impact;
  const progress = falling ? (elapsed - dropStart) / (impact - dropStart) : (elapsed - impact) / (duration - impact);
  const row = falling ? 5 : 6;
  const column = falling ? Math.min(4, Math.floor(progress * 5)) : Math.min(6, Math.floor(progress * 7));
  const lift = falling ? Math.min(dropHeight * size, floor * .6) * (1 - progress ** 1.7) : 0;
  context.drawImage(image, column * width, row * height, width, height,
    x - anchorX * size, floor - lift - anchorY * size, width * size, height * size);
}

//JT-2026/11/28 - keep existing links, browser selections, and scores associated with ana
function canonicalFighterId(fighter) {
  return fighter === "gloria" ? "ana" : fighter;
}
