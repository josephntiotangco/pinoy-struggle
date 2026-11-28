"use strict";

//JT-2026/11/23 - define the arena bounds and the four levels of the campaign
const WORLD = { width: 16, depth: 10 };
const LEVELS = [
  {
    name: "Tondo, Manila", backdrop: "tondo", boss: "boss",
    spawns: [[1.4, 1.25], [14.6, 2.1], [2.05, 8.35], [13.85, 8.5], [8.7, 1.15], [4.25, 2.05]],
    waves: [
      ["snatcher", "snatcher", "snatcher"],
      ["snatcher", "rider", "snatcher", "rider"],
      ["boss", "snatcher", "rider", "snatcher"],
    ],
  },
  {
    name: "EDSA", backdrop: "edsa", boss: "mayabang",
    spawns: [[1.35, 2.35], [14.6, 2.45], [3.15, 7.8], [14.35, 7.45], [8.15, 1.15], [12.9, 4.3]],
    waves: [
      ["ebike", "traffic", "ebike"],
      ["traffic", "ebike", "traffic", "ebike"],
      ["mayabang", "traffic", "ebike", "traffic"],
    ],
  },
  {
    name: "Bahay", backdrop: "bahay", boss: "loans",
    spawns: [[1.7, 2.15], [13.85, 2.55], [2.8, 7.9], [13.45, 7.6], [7.95, 1.6], [11.55, 5.1]],
    waves: [
      ["bills", "stress", "bills"],
      ["stress", "emotionalDamage", "bills", "stress"],
      ["loans", "emotionalDamage", "bills", "stress"],
    ],
  },
  {
    name: "G. Araneta", backdrop: "araneta", boss: "baha",
    spawns: [[1.6, 2.3], [13.9, 2.15], [2.3, 8.3], [14.2, 7.4], [8.15, 1.8], [10.65, 8.4]],
    waves: [
      ["lubak", "traffic", "lubak"],
      ["traffic", "lubak", "traffic", "lubak", "lubak"],
      ["baha", "lubak", "traffic", "lubak", "traffic"],
    ],
  },
  //JT-2026/11/24 - add three balintawak waves ending with taas presyo
  {
    name: "Balintawak", backdrop: "balintawak", boss: "inflation",
    spawns: [[1.5, 2.35], [14.1, 2.2], [2.9, 7.9], [13.8, 7.7], [8.1, 1.45], [10.75, 8.55]],
    waves: [
      ["ebike", "petrolyo", "traffic", "ebike"],
      ["petrolyo", "traffic", "petrolyo", "ebike", "petrolyo"],
      ["inflation", "petrolyo", "traffic", "ebike", "petrolyo"],
    ],
  },
  //JT-2026/11/24 - add three padre faura waves ending with justice delayed
  {
    name: "Padre Faura", backdrop: "pfaura", boss: "injustice",
    spawns: [[1.6, 2.15], [14.2, 2.45], [2.5, 8.1], [13.65, 8.15], [8.35, 1.35], [8.8, 8.75]],
    waves: [
      ["matapobre", "lipunan", "matapobre", "lipunan"],
      ["politiko", "matapobre", "lipunan", "matapobre", "politiko"],
      ["injustice", "politiko", "matapobre", "lipunan", "matapobre", "politiko"],
    ],
  },
  //JT-2026/11/24 - add three malacanang waves ending with politiko
  {
    name: "Malacañang", backdrop: "malacaniang", boss: "politikoBoss",
    spawns: [[1.55, 2.6], [14.25, 2.35], [2.3, 8.2], [13.8, 8.55], [8.15, 1.25], [10.6, 8.4]],
    waves: [
      ["matapobre", "stress", "kahirapan", "matapobre", "stress"],
      ["kahirapan", "matapobre", "stress", "kahirapan", "matapobre"],
      ["politikoBoss", "matapobre", "kahirapan", "stress", "matapobre", "kahirapan"],
    ],
  },
  //JT-2026/11/24 - introduce adik in the three maypajo waves
  {
    name: "Maypajo", backdrop: "maypajo", boss: "adik",
    spawns: [[1.45, 2.25], [14.35, 2.6], [2.4, 8.45], [13.65, 8.2], [7.75, 1.4], [11.1, 8.7]],
    waves: [
      ["lubak", "ebike", "snatcher", "lubak", "ebike"],
      ["ebike", "lubak", "snatcher", "lubak", "ebike", "lubak"],
      ["adik", "ebike", "lubak", "snatcher", "lubak", "ebike"],
    ],
  },
];
const ENEMIES = {
  snatcher: {
    sprite: "snatcher", name: "Snatcher", hint: "Closes in fast and attacks at short range.",
    health: 46, radius: .39, size: 1, speed: 2.14, trigger: 1.25, reach: 1.4, windup: .38, duration: .78, delay: .73, damage: 9,
  },
  rider: {
    sprite: "rider", name: "Kamote Rider", hint: "Dashes along the marked lane.", vehicle: true,
    health: 76, radius: .55, size: 1.02, speed: 1.68, trigger: 5, reach: .9, windup: .76, duration: 1.29, delay: 1.26, damage: 15, dash: 8.8,
  },
  boss: {
    sprite: "boss", name: "Boss Mo", hint: "Hits a wide area after a warning ring.", boss: true,
    health: 235, radius: .58, size: 1.1, speed: 1.58, trigger: 2.05, reach: 2.35, windup: .88, duration: 1.29, delay: 1.05, damage: 21,
  },
  //JT-2026/11/23 - give the edsa enemies different approaches and lane threats
  ebike: {
    sprite: "ebike", name: "Ebike", hint: "Makes a short dash after a quick lane warning.", vehicle: true,
    health: 62, radius: .49, size: 1.08, speed: 2.32, trigger: 2.75, reach: .85, windup: .56, duration: .95, delay: .83, damage: 11, dash: 6.2,
  },
  traffic: {
    sprite: "traffic", name: "Traffic", hint: "A slow jeepney with a wide close-range hit.", vehicle: true,
    health: 104, radius: .68, size: 1.13, speed: 1.37, trigger: 1.68, reach: 1.96, windup: .7, duration: 1.12, delay: .92, damage: 14,
  },
  mayabang: {
    sprite: "mayabang", name: "Mayabang", hint: "Charges the SUV down a long lane. Dodge sideways.", boss: true, vehicle: true,
    health: 315, radius: .95, size: 1.32, speed: 1.68, trigger: 6.6, reach: 1.22, windup: .98, duration: 1.58, delay: 1.05, damage: 24, dash: 10.2,
  },
  //JT-2026/11/23 - give the bahay waves a fast chaser and increasingly wide attacks
  bills: {
    sprite: "bills", name: "Bills", hint: "Closes the gap and attacks with a short warning ring.",
    health: 114, radius: .47, size: 1.06, speed: 1.7, trigger: 1.49, reach: 1.7, windup: .54, duration: .91, delay: .84, damage: 15,
  },
  stress: {
    sprite: "stress", name: "Stress", hint: "Chases quickly and attacks with a short windup.",
    health: 91, radius: .43, size: 1.06, speed: 2.48, trigger: 1.32, reach: 1.46, windup: .31, duration: .71, delay: .77, damage: 13,
  },
  emotionalDamage: {
    sprite: "emotionalDamage", name: "Emotional Damage", hint: "Hits a wide area. Move out when the ring appears.",
    health: 148, radius: .59, size: 1.13, speed: 1.64, trigger: 2.02, reach: 2.35, windup: .76, duration: 1.17, delay: 1.05, damage: 19,
  },
  loans: {
    sprite: "loans", name: "Loans", hint: "Hits hard across a wide ring after a long windup.", boss: true,
    health: 390, radius: .77, size: 1.27, speed: 1.52, trigger: 2.45, reach: 2.95, windup: .98, duration: 1.49, delay: 1.24, damage: 25,
  },
  //JT-2026/11/23 - mix short ground strikes with a boss that rushes down lanes
  lubak: {
    sprite: "lubak", name: "Lubak", hint: "Strikes the ground nearby. Step outside its warning ring.",
    health: 138, radius: .58, size: 1.14, speed: 1.52, trigger: 1.85, reach: 2.06, windup: .66, duration: 1.06, delay: .94, damage: 18,
  },
  baha: {
    sprite: "baha", name: "Baha", hint: "Surges down the marked lane. Dodge sideways.", boss: true,
    health: 480, radius: .77, size: 1.34, speed: 1.65, trigger: 5.4, reach: 1.03, windup: .94, duration: 1.55, delay: 1.3, damage: 29, dash: 8.9,
  },
  //JT-2026/11/24 - give the balintawak enemies strong close-range attacks
  petrolyo: {
    sprite: "petrolyo", name: "Petrolyo", hint: "Attacks at close range after a short warning ring.",
    health: 164, radius: .58, size: 1.16, speed: 1.82, trigger: 1.85, reach: 2.17, windup: .59, duration: 1.07, delay: .92, damage: 20,
  },
  inflation: {
    sprite: "inflation", name: "Taas Presyo", hint: "Its Price Crush hits the whole warning ring. Back away before it lands.", boss: true,
    health: 550, radius: .82, size: 1.36, speed: 1.57, trigger: 2.62, reach: 3.12, windup: .92, duration: 1.47, delay: 1.16, damage: 30,
  },
  //JT-2026/11/24 - mix quick chasers and wide strikes before the final gavel attack
  matapobre: {
    sprite: "matapobre", name: "Matapobre", hint: "Chases Juan quickly and strikes at close range.",
    health: 114, radius: .45, size: 1.09, speed: 2.6, trigger: 1.43, reach: 1.67, windup: .38, duration: .78, delay: .72, damage: 15,
  },
  lipunan: {
    sprite: "lipunan", name: "Lipunan", hint: "Reaches farther than Matapobre. Step outside the warning ring.",
    health: 168, radius: .52, size: 1.13, speed: 1.63, trigger: 1.92, reach: 2.36, windup: .7, duration: 1.11, delay: .96, damage: 20,
  },
  politiko: {
    sprite: "politiko", name: "Politiko", hint: "Winds up for a heavy strike that covers a wide ring.",
    health: 180, radius: .56, size: 1.17, speed: 1.72, trigger: 2.3, reach: 2.59, windup: .83, duration: 1.26, delay: 1.02, damage: 22,
  },
  injustice: {
    sprite: "injustice", name: "Justice Delayed", hint: "Slams its gavel across a wide warning ring. Move away during its windup.", boss: true,
    health: 630, radius: .86, size: 1.38, speed: 1.55, trigger: 2.76, reach: 3.35, windup: 1, duration: 1.52, delay: 1.24, damage: 32,
  },
  //JT-2026/11/24 - give kahirapan and the malacanang boss distinct heavy strikes
  kahirapan: {
    sprite: "kahirapan", name: "Kahirapan", hint: "Moves slowly and hits hard. Step out of its warning ring before it strikes.",
    health: 200, radius: .63, size: 1.21, speed: 1.35, trigger: 2.07, reach: 2.54, windup: .79, duration: 1.24, delay: 1.09, damage: 23,
  },
  politikoBoss: {
    sprite: "politiko", name: "Politiko", hint: "Its heavy strike covers a wide ring. Use the long windup to get clear.", boss: true,
    health: 710, radius: .88, size: 1.43, speed: 1.45, trigger: 2.88, reach: 3.55, windup: 1.1, duration: 1.66, delay: 1.34, damage: 33,
  },
  //JT-2026/11/24 - give the maypajo boss a fast chase and short windup
  adik: {
    sprite: "adik", name: "Adik", hint: "Chases quickly and strikes after a short warning. Keep moving outside the ring.", boss: true,
    health: 765, radius: .71, size: 1.36, speed: 2.24, trigger: 2.1, reach: 2.65, windup: .6, duration: 1.02, delay: .86, damage: 30,
  },
};
const MOVES = {
  //JT-2026/11/23 - raise attack damage and award special charge on melee hits
  punch: { damage: 30, reach: 1.35, impact: .15, duration: .35, charge: 30 },
  kick: { damage: 50, reach: 1.89, impact: .29, duration: .58, charge: 50 },
  // haduken: { damage: 120, impact: .29, duration: .68, special: true },
  //JT-2026/11/25 - match the survival projectile release to the shared hand pose
  haduken: { damage: 120, impact: JUAN_HADUKEN.impact, duration: .68, special: true },
  senpu: { damage: 80, reach: 2.8, impact: .22, duration: .74, special: true },
  //JT-2026/11/24 - make almighty push a two-bar knockout across the arena
  almightyPush: { impact: ALMIGHTY_PUSH.impact, duration: ALMIGHTY_PUSH.duration, special: true, bars: ALMIGHTY_PUSH.bars },
};
const KEYS = {
  KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right",
  KeyW: "up", ArrowUp: "up", KeyS: "down", ArrowDown: "down",
  KeyJ: "punch", KeyK: "kick", KeyL: "haduken", KeyI: "senpu",
  //JT-2026/11/24 - bind almighty push to o in survival
  KeyO: "almightyPush",
};
// const ATTACK_KEYS = ["haduken", "senpu", "kick", "punch"];
//JT-2026/11/24 - resolve a requested almighty push before other attacks
const ATTACK_KEYS = ["almightyPush", "haduken", "senpu", "kick", "punch"];
const FRAME = { width: 504, height: 201, x: 156, y: 192 };
const HERO_FRAME = { ...FRAME, height: 234, y: 225 };
const ACTION_FRAME = { width: 192, height: 250, x: 72, y: 241 };
const ART = {
  tondo: "tondo_0.jpg",
  edsa: "edsa_0.jpg",
  hero: "hero_0.png",
  actions: "hero_1.png",
  //JT-2026/11/24 - load juan's almighty push animation
  almightyPush: ALMIGHTY_PUSH.id + ".png",
  snatcher: "snatcher_0.png",
  rider: "kamote_rider_0.png",
  boss: "bossy_0.png",
  ebike: "ebike_0.png",
  traffic: "traffic_0.png",
  mayabang: "mayabang_0.png",
  //JT-2026/11/23 - reuse the bahay backdrop and opponent sprites from arena mode
  bahay: "bahay_0.jpg",
  bills: "billing_0.png",
  stress: "stress_0.png",
  emotionalDamage: "emotional_damage_0.png",
  loans: "loans_0.png",
  //JT-2026/11/23 - use the shared araneta map and enemy artwork
  araneta: "g_araneta_0.jpg",
  lubak: "lubak_sa_daan_0.png",
  baha: "baha_0.png",
  //JT-2026/11/24 - use the shared market backdrop and challenger sprites
  balintawak: "balintawak_0.jpg",
  petrolyo: "gasoline_0.png",
  inflation: "inflation_0.png",
  //JT-2026/11/24 - reuse the padre faura backdrop and arena opponent art
  pfaura: "pfaura_0.jpg",
  matapobre: "matapobre_0.png",
  lipunan: "lipunan_0.png",
  politiko: "congressman_0.png",
  injustice: "injustice_0.png",
  //JT-2026/11/24 - load malacanang and kahirapan for level seven
  malacaniang: "malacaniang_0.jpg",
  kahirapan: "kahirapan_0.png",
  //JT-2026/11/24 - reuse the maypajo backdrop and adik fighter art
  maypajo: "maypajo_0.jpg",
  adik: "adik_0.png",
  //JT-2026/11/25 - register ana's atlases with the survival art loader
  // ...Object.fromEntries(Object.values(GLORIA_ATLASES).map(id => [id, id + ".png"])),
  //JT-2026/11/28 - use ana for the fighter and her moves
  ...Object.fromEntries(Object.values(ANA_ATLASES).map(id => [id, id + ".png"])),
  //JT-2026/11/27 - resolve jose's survival atlas with local game artwork
  [JOSE_PROFILE.id]: JOSE_PROFILE.id + ".png",
  //JT-2026/11/27 - resolve maria's survival atlases with local game artwork
  ...Object.fromEntries(Object.values(MARIA_ATLASES).map(id => [id, id + ".png"])),
};
const SOUNDS = {
  music: ["freesound_community-video-game-music-loop-27629.mp3", .14, 0],
  haduken: ["hadouken.mp3", .7, 0],
  senpu: ["konoha_senpu.mp3", .7, 0],
  chargeToken: ["super_saiyan_god.mp3", .66, .1],
  hurt: ["amber2023-ouch-208265.mp3", .67, .17],
  hit: ["freesound_community-ough-47202.mp3", .48, .36],
  crash: ["rsf_studios-car-crash-swerving-and-crash-592672.mp3", .44, .36],
  loss: ["make_more_sound-8-bit-video-game-fail-version-2-145478.mp3", .44, .18],
  //JT-2026/11/24 - load the same monster attack clips used in arena
  // ...Object.fromEntries(Object.entries(MONSTER_AUDIO).map(([name, { file, volume, offset, duration }]) => [name, [file, volume, offset, duration]])),
  //JT-2026/11/25 - load ana's strike effects alongside the existing clips
  // ...Object.fromEntries(Object.entries({ ...MONSTER_AUDIO, ...GLORIA_EFFECTS }).map(([name, { file, volume, offset, duration }]) => [name, [file, volume, offset, duration]])),
  //JT-2026/11/27 - play jose's recorded attacks during survival
  ...Object.fromEntries(Object.entries({ ...MONSTER_AUDIO, ...ANA_EFFECTS, ...JOSE_EFFECTS, ...MARIA_EFFECTS }).map(([name, { file, volume, offset, duration }]) => [name, [file, volume, offset, duration]])),
};
const BAR = 100;
const MAX_CHARGE = 3 * BAR;
//JT-2026/11/23 - spread charge tokens across the floor and limit active pickups
const TOKEN_POINTS = [[3.7, 6.9], [12.3, 5.4], [7.7, 2.6], [6.6, 8.4], [11.8, 8.6], [4.5, 3.3]];
const TOKEN_INTERVAL = 7;
const TOKEN_LIMIT = 2;
const CHARGE_ANIMATION_TIME = .58;
//JT-2026/11/25 - keep the selected fighter through the whole survival run
// const playingGloria = selectedFighter() === "gloria";
//JT-2026/11/27 - carry the selected fighter through every survival wave
const selectedFighterId = selectedFighter();
const playingAna = selectedFighterId === "ana";
const playingJose = selectedFighterId === "jose";
const playingMaria = selectedFighterId === "maria";
const alternateSkills = playingJose ? JOSE_SKILLS : playingAna ? ANA_SKILLS : playingMaria ? MARIA_SKILLS : null;
const playerSprite = playingJose ? JOSE_PROFILE.id : playingAna ? ANA_ATLASES.base : playingMaria ? MARIA_ATLASES.base : "hero";
const byId = id => document.getElementById(id);
const ui = {
  arena: byId("arena"), canvas: byId("fight"), start: byId("start"), pause: byId("pause"), sound: byId("sound"),
  screen: byId("screen"), title: byId("screen-title"), copy: byId("screen-copy"), location: byId("screen-location"),
  health: byId("health"), hpLabel: byId("hp-label"), special: byId("special"), specialLabel: byId("special-label"),
  wave: byId("wave"), remaining: byId("remaining"), notice: byId("notice"), status: byId("status"),
  level: byId("level"),
  //JT-2026/11/23 - connect the wave information below the controls
  waveGuide: byId("wave-guide"),
};
const context = ui.canvas.getContext("2d");
const view = { width: 0, height: 0, spriteScale: 1 };
const images = new Map();
const recordings = new Map();
const held = new Map();
const pressed = new Set();
const buttons = [...document.querySelectorAll(".touch-controls button")];
const state = {
  phase: "title", previousPhase: null, level: 0, wave: 0, clock: 0, notice: 0, rest: 0,
  player: createPlayer(), enemies: [], spawnQueue: [], shots: [], sparks: [],
  //JT-2026/11/23 - track available charge tokens and their spawn cadence
  tokens: [], tokenTimer: 2, nextTokenPoint: 0,
};
let soundEnabled = true;
let previousFrame = 0;
let lastHealth;
let lastCharge;
let lastWave;
let lastLevel;

//JT-2026/11/25 - show ana's name and controls in survival
// if (playingGloria) {
//   labelGloriaControls();
//   ui.health.previousElementSibling.querySelector("strong").textContent = "Gloria";
//   ui.health.setAttribute("aria-label", "Gloria's health");
//   const controlHint = document.querySelector(".control-hint");
//   if (controlHint) controlHint.textContent = "Pick up Charge Tokens to gain one Special Bar. Kick Barrage hits nearby enemies and Basooka hits enemies in a lane. Spirit Bomb needs two full bars and clears every enemy on the field.";
// }
//JT-2026/11/27 - display the current survival fighter and explain their specials
if (alternateSkills) {
  const name = FIGHTER_NAMES[selectedFighterId];
  labelFighterControls(selectedFighterId, alternateSkills);
  ui.health.previousElementSibling.querySelector("strong").textContent = name;
  ui.health.setAttribute("aria-label", name + "'s health");
  const controlHint = document.querySelector(".control-hint");
  const specials = playingJose ? "Megaphone Blast and Giant Swing send projectiles across the field."
    : playingMaria ? "Merchandise Barrage throws three volleys. Gondola Push rolls through enemies in its lane."
    : "Kick Barrage hits nearby enemies and " + alternateSkills.haduken.label + " hits enemies in a lane.";
  if (controlHint) controlHint.textContent = "Pick up Charge Tokens to gain one Special Bar. " + specials + " " +
    alternateSkills.almightyPush.label + " needs two full bars and clears every enemy on the field.";
}
ui.start.addEventListener("click", activate);
ui.pause.addEventListener("click", togglePause);
ui.sound.addEventListener("click", toggleSound);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", event => held.delete(event.code));
window.addEventListener("blur", () => {
  clearInputs();
  if (isPlaying()) togglePause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isPlaying()) togglePause();
});
wireTouch();
makeWaveGuide();
new ResizeObserver(resize).observe(ui.arena);
resize();
//JT-2026/11/23 - boot with the first level and defer later arena art until needed
prepareLevelArt(0)
  .then(() => { ui.start.disabled = false; ui.start.textContent = "Start survival"; })
  .catch(() => {
    state.phase = "error";
    showScreen("Arena unavailable", "Reload the page to try loading the game artwork again.", "Reload");
  });
requestAnimationFrame(frame);

//JT-2026/11/23 - initialize juan on the arena floor
function createPlayer() {
  return { x: 8, z: 6.6, radius: .37, health: 100, charge: 0, direction: 1, aimX: 1, aimZ: 0, moving: false, age: 0, stun: 0, invulnerable: 0, chargeAnimation: 0, attack: null };
}

//JT-2026/11/23 - track keyboard actions and the pause shortcut
function keyDown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.code === "Escape" && !event.repeat && (isPlaying() || state.phase === "paused")) {
    event.preventDefault();
    togglePause();
    return;
  }
  if (event.code === "Enter" && !ui.screen.hidden && !ui.start.disabled && !event.repeat && !event.target?.closest?.("a, button")) {
    event.preventDefault();
    activate();
    return;
  }
  const action = KEYS[event.code];
  if (!action || !isPlaying()) return;
  event.preventDefault();
  if (!event.repeat) hold(event.code, action);
}

//JT-2026/11/23 - let each touch pointer hold a direction or an action
function wireTouch() {
  for (const button of buttons) {
    button.addEventListener("pointerdown", event => {
      if (event.button !== 0 || !isPlaying()) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      hold(event.pointerId, button.dataset.input);
      button.classList.add("is-held");
    });
    const release = event => {
      held.delete(event.pointerId);
      button.classList.toggle("is-held", hasInput(button.dataset.input));
    };
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  }
}

//JT-2026/11/23 - remember both taps and held inputs
function hold(source, action) {
  if (!hasInput(action)) pressed.add(action);
  held.set(source, action);
}

//JT-2026/11/23 - query a held action across keyboard and touch
function hasInput(action) {
  for (const input of held.values()) {
    if (input === action) return true;
  }
  return false;
}

//JT-2026/11/23 - clear controls on menu transitions
function clearInputs() {
  held.clear();
  pressed.clear();
  buttons.forEach(button => button.classList.remove("is-held"));
}

//JT-2026/11/23 - accept combat controls during waves and their breaks
function isPlaying() {
  return state.phase === "wave" || state.phase === "rest";
}

//JT-2026/11/23 - start a fresh run, advance levels, or resume from pause
function activate() {
  if (state.phase === "error") {
    window.location.reload();
    return;
  }
  if (state.phase === "paused") {
    togglePause();
    return;
  }
  if (ui.start.disabled || isPlaying()) return;
  if (state.phase === "level-clear") {
    continueLevel();
    return;
  }
  prepareSounds();
  //JT-2026/11/26 - start a ranked survival run from the first level on the web
  // globalThis.pinoyLeaderboard?.start("survival", playingGloria ? "gloria" : "juan");
  //JT-2026/11/27 - record the chosen survival fighter on the leaderboard
  globalThis.pinoyLeaderboard?.start("survival", selectedFighterId);
  startLevel(0);
}

//JT-2026/11/23 - pause the fight and retain the active wave
function togglePause() {
  if (state.phase === "paused") {
    state.phase = state.previousPhase;
    ui.screen.hidden = true;
    ui.pause.textContent = "Pause";
    playSound("music");
    //JT-2026/11/24 - resume an active push from the same voice position
    if (soundEnabled) resumeAlmightyPushVoice(state.player.attack);
    return;
  }
  if (!isPlaying()) return;
  state.previousPhase = state.phase;
  state.phase = "paused";
  clearInputs();
  stopSounds();
  ui.pause.textContent = "Resume";
  showScreen("Paused", "Resume to keep fighting in this wave.", "Resume survival");
}

//JT-2026/11/23 - set accessible panel copy for run results and pause
function showScreen(title, copy, label) {
  ui.title.textContent = title;
  ui.copy.textContent = copy;
  ui.start.textContent = label;
  ui.start.disabled = false;
  ui.screen.hidden = false;
}

//JT-2026/11/23 - update wave messages without interrupting controls
function showNotice(message, duration) {
  ui.notice.textContent = message;
  ui.notice.hidden = false;
  state.notice = duration;
}

//JT-2026/11/23 - schedule enemies at several points around the arena
function beginWave() {
  const { name, waves, spawns, boss } = LEVELS[state.level];
  state.phase = "wave";
  state.wave++;
  state.enemies = [];
  state.shots = [];
  state.spawnQueue = waves[state.wave - 1].map((kind, index) => {
    const [x, z] = spawns[(index + state.wave - 1) % spawns.length];
    return { kind, x, z, time: .7 + index * .78 };
  });
  ui.status.textContent = name + ", wave " + state.wave + " of " + waves.length;
  if (state.wave === waves.length) showNotice("Final wave · " + ENEMIES[boss].name, 1.4);
  else showNotice((state.wave === 1 ? name + " · " : "") + "Wave " + state.wave, 1.4);
}

//JT-2026/11/23 - advance to the next arena or display the result at the end of the run
function finishRun(won) {
  const { name, waves, boss } = LEVELS[state.level];
  const next = LEVELS[state.level + 1];
  state.phase = won ? (next ? "level-clear" : "won") : "lost";
  endChargeAnimation(state.player);
  stopSounds();
  clearInputs();
  ui.pause.disabled = true;
  ui.pause.textContent = "Pause";
  ui.notice.hidden = true;
  if (won && next) {
    showScreen("Level " + (state.level + 1) + " cleared", ENEMIES[boss].name + " is down. You unlocked " + next.name + ".", "Enter " + next.name);
  } else if (won) {
    // showScreen("Run cleared", ENEMIES[boss].name + " is down. You survived all " + LEVELS.length + " arenas.", "Play again");
    //JT-2026/11/24 - congratulate players after the final survival wave
    const victoryMessage = "Congrats nagtagumpay ka bilang Pilipino!";
    showScreen("Run cleared", victoryMessage, "Play again");
    ui.status.textContent = victoryMessage;
  } else {
    // showScreen("Run over", "Juan fell in " + name + " during wave " + state.wave + " of " + waves.length + ".", "Try again");
    //JT-2026/11/25 - name the active fighter in the defeat screen
    // showScreen("Run over", (playingGloria ? "Gloria" : "Juan") + " fell in " + name + " during wave " + state.wave + " of " + waves.length + ".", "Try again");
    //JT-2026/11/27 - use the selected fighter's name in the survival result
    showScreen("Run over", FIGHTER_NAMES[selectedFighterId] + " fell in " + name + " during wave " + state.wave + " of " + waves.length + ".", "Try again");
    playSound("loss");
  }
}

//JT-2026/11/23 - step the fight before rendering each frame
function frame(now) {
  const dt = previousFrame ? Math.min((now - previousFrame) / 1000, .035) : 0;
  previousFrame = now;
  if (state.phase !== "paused") state.clock += dt;
  if (isPlaying() && dt > 0) updateGame(dt);
  if (state.phase !== "paused") state.player.age += dt;
  render();
  syncHud();
  requestAnimationFrame(frame);
}

//JT-2026/11/23 - resolve the current fight or the breathing room between waves
function updateGame(dt) {
  //JT-2026/11/26 - count combat time while a survival wave is active
  if (state.phase === "wave") globalThis.pinoyLeaderboard?.tick(dt);
  if (state.notice > 0) {
    state.notice -= dt;
    if (state.notice <= 0) ui.notice.hidden = true;
  }
  updatePlayer(dt);
  pressed.clear();
  updateSparks(dt);
  if (state.phase === "rest") {
    updateChargeTokens(dt);
    state.rest -= dt;
    if (state.rest <= 0) beginWave();
    return;
  }

  updateSpawns(dt);
  updateShots(dt);
  updateEnemies(dt);
  if (!state.player.health) {
    finishRun(false);
    return;
  }
  separateFighters();
  updateChargeTokens(dt);
  if (state.spawnQueue.length || state.enemies.some(enemy => enemy.health)) return;
  //JT-2026/11/24 - finish the cast before advancing a cleared wave
  if (state.player.attack?.kind === "almightyPush") return;
  //JT-2026/11/26 - record each cleared wave including the final wave of a level
  globalThis.pinoyLeaderboard?.clear();
  if (state.wave === LEVELS[state.level].waves.length) {
    finishRun(true);
    return;
  }
  state.phase = "rest";
  state.rest = 3.6;
  state.player.health = Math.min(100, state.player.health + 20);
  state.shots = [];
  showNotice("Wave clear · Health recovered", 3.5);
}

//JT-2026/11/23 - move juan and resolve his attacks or charge pickup animation
function updatePlayer(dt) {
  const player = state.player;
  player.stun = Math.max(0, player.stun - dt);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.moving = false;
  if (player.attack) {
    const attack = player.attack;
    // attack.elapsed += dt;
    //JT-2026/11/24 - time the push impact to its spoken cue
    if (attack.kind === "almightyPush") advanceAlmightyPush(attack, dt);
    else attack.elapsed += dt;
    // if (!attack.spent && attack.elapsed >= attack.move.impact) {
    //JT-2026/11/25 - apply kick barrage at each of its strike frames
    if (!attack.spent && attack.elapsed >= (attack.nextImpact ?? attack.move.impact)) {
      attack.spent = true;
      resolvePlayerAttack(player, attack);
      // queueGloriaFollowUp(attack, attack.move.followUps);
      //JT-2026/11/28 - use ana for the fighter and her moves
      queueAttackFollowUp(attack, attack.move.followUps);
    }
    if (attack.elapsed >= attack.move.duration) player.attack = null;
    return;
  }
  if (player.stun) return;
  if (player.chargeAnimation > 0) {
    player.chargeAnimation -= dt;
    if (player.chargeAnimation <= 0) endChargeAnimation(player);
    return;
  }

  const key = state.phase === "wave" ? ATTACK_KEYS.find(action => pressed.has(action)) : undefined;
  if (key && startAttack(player, key)) return;
  const dx = Number(hasInput("right")) - Number(hasInput("left"));
  const dz = Number(hasInput("down")) - Number(hasInput("up"));
  if (dx || dz) {
    const length = Math.hypot(dx, dz);
    player.aimX = dx / length;
    player.aimZ = dz / length;
    if (dx) player.direction = Math.sign(dx);
    move(player, player.aimX * 4.55 * dt, player.aimZ * 3.75 * dt);
    player.moving = true;
  }
}

//JT-2026/11/23 - aim a move and spend one full bar for a special
function startAttack(player, kind) {
  // const move = MOVES[kind];
  //JT-2026/11/25 - select the survival damage and timing for the active fighter
  // const skill = playingGloria ? GLORIA_SKILLS[kind] : null;
  //JT-2026/11/27 - resolve jose's survival moves using the existing control slots
  const skill = alternateSkills?.[kind];
  const move = skill ? { ...skill, ...skill.survival } : MOVES[kind];
  // if (move.special && player.charge + 1e-7 < BAR) {
  //   showNotice("Need one full Special Bar", 1.15);
  //   return false;
  // }
  //JT-2026/11/24 - check the selected move's charge without a distance requirement
  const cost = (move.bars ?? 1) * BAR;
  if (move.special && player.charge + 1e-7 < cost) {
    showNotice(move.bars ? "Need two full Special Bars" : "Need one full Special Bar", 1.15);
    return false;
  }
  const target = closestEnemy(player);
  if (target) {
    // const length = Math.hypot(target.x - player.x, target.z - player.z) || 1;
    // player.aimX = (target.x - player.x) / length;
    // player.aimZ = (target.z - player.z) / length;
    //JT-2026/11/25 - keep a valid shot direction when a target overlaps the fighter
    const dx = target.x - player.x;
    const dz = target.z - player.z;
    const length = Math.hypot(dx, dz);
    player.aimX = length ? dx / length : player.direction;
    player.aimZ = length ? dz / length : 0;
    if (Math.abs(player.aimX) > .07) player.direction = Math.sign(player.aimX);
  }
  // player.attack = { kind, move, elapsed: 0, spent: false };
  //JT-2026/11/25 - let spirit bomb follow its own voice timeline
  player.attack = { kind, move, elapsed: 0, spent: false, cast: move.soundEnd ? move : undefined };
  if (move.special) {
    // player.charge = Math.max(0, player.charge - BAR);
    // playSound(kind);
    //JT-2026/11/24 - empty the meter and start the voice at the beginning of the cast
    if (kind === "almightyPush") {
      player.charge = 0;
      if (soundEnabled) resumeAlmightyPushVoice(player.attack);
      //JT-2026/11/27 - resolve the instant knockout on the input frame
      if (move.impact === 0) {
        player.attack.spent = true;
        resolvePlayerAttack(player, player.attack);
      }
    } else {
      player.charge = Math.max(0, player.charge - cost);
      // playSound(kind);
      //JT-2026/11/25 - reserve juan's voiced specials for his moves
      // if (!playingGloria) playSound(kind);
      //JT-2026/11/27 - play jose's cast sounds when the projectiles launch
      if (!alternateSkills) playSound(kind);
    }
  }
  return true;
}

//JT-2026/11/23 - find the closest living target within the requested reach
// function closestEnemy(player, reach = Infinity) {
//JT-2026/11/28 - let a rolling rack skip enemies already hit by the same cast
function closestEnemy(player, reach = Infinity, alreadyHit) {
  let target;
  let nearest = Infinity;
  for (const enemy of state.enemies) {
    // if (!enemy.health) continue;
    //JT-2026/11/28 - check only living targets that the current shot can hit
    if (!enemy.health || alreadyHit?.has(enemy)) continue;
    const distance = Math.hypot(player.x - enemy.x, player.z - enemy.z);
    if (distance <= reach + enemy.profile.radius && distance < nearest) {
      target = enemy;
      nearest = distance;
    }
  }
  return target;
}

//JT-2026/11/23 - launch the projectile or apply a melee strike
function resolvePlayerAttack(player, attack) {
  const { kind, move } = attack;
  //JT-2026/11/25 - play ana's sounds at the release or each barrage hit
  if (move.effect) playSound(move.effect);
  //JT-2026/11/24 - knock out every living enemy on the field at impact
  if (kind === "almightyPush") {
    const targets = state.enemies.filter(enemy => enemy.health > 0);
    //JT-2026/11/28 - keep the impact art at each rack's landing point
    if (move.dropStart) attack.dropTargets = targets.map(({ x, z }) => ({ x, z }));
    for (const enemy of targets) hitEnemy(enemy, player, enemy.health, .95, false);
    burst(player.x, player.z, "#a6efff", 30);
    // showNotice("Almighty Push · " + targets.length + " K.O.", 1.4);
    //JT-2026/11/25 - announce the selected ultimate at its knockout cue
    showNotice((move.label ?? "Almighty Push") + " · " + targets.length + " K.O.", 1.4);
    return;
  }
  //JT-2026/11/25 - resolve the basooka beam or launch the selected projectile
  if (move.beamEnd) {
    // resolveGloriaBeam(player, move.reach, move.damage);
    //JT-2026/11/28 - use ana for the fighter and her moves
    resolveAnaBeam(player, move.reach, move.damage);
    return;
  }
  // if (kind === "haduken") {
  // if (kind === "haduken" || move.thrown) {
  //JT-2026/11/27 - send both of jose's specials toward his target
  if (kind === "haduken" || move.thrown || move.projectile) {
    // state.shots.push({ x: player.x + player.aimX * .55, z: player.z + player.aimZ * .55, dx: player.aimX, dz: player.aimZ, life: 1.62 });
    const shot = { x: player.x + player.aimX * .55, z: player.z + player.aimZ * .55, dx: player.aimX, dz: player.aimZ, life: 1.62 };
    // if (move.thrown) shot.move = move;
    //JT-2026/11/27 - carry the projectile's damage and art into its flight
    if (move.thrown || move.projectile) shot.move = move;
    //JT-2026/11/28 - keep each volley's merchandise and track targets hit by the rack
    if (move.projectile?.volleyColumns) shot.volley = attack.followUpIndex ?? 0;
    if (move.projectile?.pierces) shot.hit = new Set();
    state.shots.push(shot);
    burst(player.x, player.z, "#81f4d9", 6);
    return;
  }
  if (kind === "senpu") {
    for (const enemy of state.enemies) {
      if (enemy.health && Math.hypot(enemy.x - player.x, enemy.z - player.z) <= move.reach + enemy.profile.radius) {
        // hitEnemy(enemy, player, move.damage, .55);
        //JT-2026/11/25 - keep nearby enemies within the barrage for later kicks
        hitEnemy(enemy, player, move.damage, move.followUps ? .12 : .55);
      }
    }
    burst(player.x, player.z, "#ffdb82", 16);
    return;
  }
  const target = closestEnemy(player, move.reach);
  if (!target) return;
  hitEnemy(target, player, move.damage, kind === "kick" ? .54 : .28);
  player.charge = Math.min(MAX_CHARGE, player.charge + move.charge);
}

//JT-2026/11/23 - advance projectiles across the arena floor
function updateShots(dt) {
  state.shots = state.shots.filter(shot => {
    shot.life -= dt;
    // shot.x += shot.dx * dt * 10;
    // shot.z += shot.dz * dt * 10;
    //JT-2026/11/27 - use each ranged attack's travel speed on the survival floor
    const projectile = shot.move?.projectile;
    const speed = projectile?.survivalSpeed ?? 10;
    shot.x += shot.dx * dt * speed;
    shot.z += shot.dz * dt * speed;
    if (shot.life <= 0 || shot.x < -1 || shot.x > WORLD.width + 1 || shot.z < -1 || shot.z > WORLD.depth + 1) return false;
    // const target = closestEnemy(shot, .48);
    // if (!target) return true;
    // hitEnemy(target, { x: shot.x - shot.dx, z: shot.z - shot.dz }, MOVES.haduken.damage, .7);
    //JT-2026/11/25 - award throw charge only after the projectile connects
    // hitEnemy(target, { x: shot.x - shot.dx, z: shot.z - shot.dz }, (shot.move ?? MOVES.haduken).damage, .7);
    // if (shot.move?.charge) state.player.charge = Math.min(MAX_CHARGE, state.player.charge + shot.move.charge);
    // return false;
    //JT-2026/11/28 - keep the rack rolling after hitting each target once
    const reach = projectile?.survivalRadius ?? .48;
    const source = { x: shot.x - shot.dx, z: shot.z - shot.dz };
    let target = closestEnemy(shot, reach, shot.hit);
    while (target) {
      hitEnemy(target, source, (shot.move ?? MOVES.haduken).damage, .7);
      if (shot.move?.charge) state.player.charge = Math.min(MAX_CHARGE, state.player.charge + shot.move.charge);
      if (!shot.hit) return false;
      shot.hit.add(target);
      target = closestEnemy(shot, reach, shot.hit);
    }
    return true;
  });
}

//JT-2026/11/23 - place enemies only after showing a spawn warning
function updateSpawns(dt) {
  state.spawnQueue = state.spawnQueue.filter(spawn => {
    spawn.time -= dt;
    if (spawn.time > 0) return true;
    const profile = ENEMIES[spawn.kind];
    state.enemies.push({
      kind: spawn.kind, profile, x: spawn.x, z: spawn.z, direction: spawn.x < state.player.x ? 1 : -1,
      radius: profile.radius, health: profile.health, cooldown: .55, stun: 0, age: 0, death: 0, attack: null, moving: false,
    });
    burst(spawn.x, spawn.z, "#ffcd78", 6);
    return false;
  });
}

//JT-2026/11/23 - let each enemy chase or telegraph its own attack
function updateEnemies(dt) {
  const player = state.player;
  for (const enemy of state.enemies) {
    const { profile } = enemy;
    enemy.age += dt;
    enemy.moving = false;
    if (!enemy.health) {
      enemy.death += dt;
      continue;
    }
    enemy.stun = Math.max(0, enemy.stun - dt);
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    if (enemy.stun) continue;
    if (enemy.attack) {
      updateEnemyAttack(enemy, dt);
      continue;
    }

    const dx = player.x - enemy.x;
    const dz = player.z - enemy.z;
    const distance = Math.hypot(dx, dz) || 1;
    if (Math.abs(dx) > .08) enemy.direction = Math.sign(dx);
    if (!enemy.cooldown && distance <= profile.trigger) {
      enemy.attack = { time: 0, dx: dx / distance, dz: dz / distance, spent: false };
    } else if (distance > profile.radius + player.radius + .16) {
      move(enemy, dx / distance * profile.speed * dt, dz / distance * profile.speed * dt);
      enemy.moving = true;
    }
  }
}

//JT-2026/11/23 - resolve a swipe or lane charge after its danger marker
function updateEnemyAttack(enemy, dt) {
  const { attack, profile } = enemy;
  const player = state.player;
  // attack.time += dt;
  //JT-2026/11/24 - sound the attack once when it crosses the windup threshold
  const previousTime = attack.time;
  attack.time += dt;
  if (previousTime < profile.windup && attack.time >= profile.windup) {
    const spriteId = ART[profile.sprite].slice(0, -4);
    playSound(MONSTER_ATTACK_CUES[spriteId]);
  }
  if (attack.time >= profile.windup && attack.time < profile.duration) {
    if (profile.dash) {
      move(enemy, attack.dx * profile.dash * dt, attack.dz * profile.dash * dt);
      enemy.moving = true;
    }
    if (!attack.spent) {
      const inReach = Math.hypot(enemy.x - player.x, enemy.z - player.z) <= profile.reach + player.radius;
      if (inReach) hurtPlayer(profile.damage, enemy);
      if (inReach || !profile.dash) attack.spent = true;
    }
  }
  if (attack.time >= profile.duration) {
    enemy.attack = null;
    enemy.cooldown = profile.delay;
  }
}

//JT-2026/11/23 - apply damage to an enemy and interrupt its windup
// function hitEnemy(enemy, source, damage, push) {
//JT-2026/11/24 - allow a shared blast cue to replace individual hit sounds
function hitEnemy(enemy, source, damage, push, playImpact = true) {
  enemy.health = Math.max(0, enemy.health - damage);
  enemy.attack = null;
  enemy.stun = push >= .5 ? .37 : .22;
  const dx = enemy.x - source.x;
  const dz = enemy.z - source.z;
  const length = Math.hypot(dx, dz) || 1;
  move(enemy, dx / length * push, dz / length * push);
  burst(enemy.x, enemy.z, "#ffe09a", 7);
  // playSound(!enemy.health && enemy.profile.vehicle ? "crash" : "hit");
  //JT-2026/11/24 - keep individual hit sounds for ordinary attacks
  if (playImpact) playSound(!enemy.health && enemy.profile.vehicle ? "crash" : "hit");
}

//JT-2026/11/23 - take a hit and allow a short window to escape
function hurtPlayer(damage, source) {
  const player = state.player;
  //JT-2026/11/24 - shield juan while almighty push is active through release and landing
  if (player.attack?.kind === "almightyPush") return;
  if (player.invulnerable || !player.health) return;
  player.health = Math.max(0, player.health - damage);
  player.attack = null;
  player.invulnerable = .65;
  player.stun = .25;
  endChargeAnimation(player);
  const dx = player.x - source.x;
  const dz = player.z - source.z;
  const length = Math.hypot(dx, dz) || 1;
  move(player, dx / length * .37, dz / length * .37);
  burst(player.x, player.z, "#ff886d", 8);
  playSound("hurt");
}

//JT-2026/11/23 - keep movement inside the playable ground bounds
function move(fighter, dx, dz) {
  fighter.x = clamp(fighter.x + dx, fighter.radius, WORLD.width - fighter.radius);
  fighter.z = clamp(fighter.z + dz, fighter.radius, WORLD.depth - fighter.radius);
}

//JT-2026/11/23 - separate living fighters using their ground footprints
function separateFighters() {
  const fighters = [state.player, ...state.enemies.filter(enemy => enemy.health)];
  for (let i = 0; i < fighters.length - 1; i++) {
    for (let j = i + 1; j < fighters.length; j++) {
      const a = fighters[i];
      const b = fighters[j];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const distance = Math.hypot(dx, dz);
      const overlap = (a.radius + b.radius - distance) / 2;
      if (overlap <= 0) continue;
      const x = distance ? dx / distance * overlap : overlap;
      const z = distance ? dz / distance * overlap : 0;
      move(a, -x, -z);
      move(b, x, z);
    }
  }
}

//JT-2026/11/23 - give spawn and hit effects a short readable lifetime
function burst(x, z, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    state.sparks.push({ x, z, color, dx: Math.cos(angle) * 1.6, dz: Math.sin(angle) * 1.6, life: .34 + Math.random() * .21 });
  }
}

//JT-2026/11/23 - recycle finished particles
function updateSparks(dt) {
  state.sparks = state.sparks.filter(spark => {
    spark.life -= dt;
    spark.x += spark.dx * dt;
    spark.z += spark.dz * dt;
    return spark.life > 0;
  });
}

//JT-2026/11/23 - set canvas scale from the available play area
function resize() {
  const { width, height } = ui.arena.getBoundingClientRect();
  if (!width || !height) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  view.width = width;
  view.height = height;
  view.spriteScale = Math.min(width / 580, height / 530, 1.18);
  ui.canvas.width = Math.round(width * ratio);
  ui.canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

//JT-2026/11/23 - project ground coordinates with depth and foreshortening
function project(x, z) {
  const depth = z / WORLD.depth;
  const perspective = .6 + depth * .4;
  const floorDepth = Math.min(view.height * .4, view.width * .37);
  return {
    x: view.width * (.5 + (x / WORLD.width - .5) * .92 * perspective),
    y: view.height * .94 - (1 - depth) * floorDepth,
    scale: view.spriteScale * perspective,
  };
}

//JT-2026/11/23 - paint the arena then draw sprites from farthest to nearest
function render() {
  if (!view.width) return;
  context.clearRect(0, 0, view.width, view.height);
  drawArena();
  for (const spawn of state.spawnQueue) {
    if (spawn.time < .92) drawSpawn(spawn);
  }
  for (const enemy of state.enemies) {
    if (enemy.health && enemy.attack && enemy.attack.time < enemy.profile.windup) drawDanger(enemy);
  }
  //JT-2026/11/23 - show pickups and the full area covered by konoha senpu
  state.tokens.forEach(drawChargeToken);
  const attack = state.player.attack;
  //JT-2026/11/25 - draw the basooka in the same direction used to resolve hits
  // if (attack?.move.beamEnd) drawGloriaBeam(state.player, attack);
  //JT-2026/11/28 - use ana for the fighter and her moves
  if (attack?.move.beamEnd) drawAnaBeam(state.player, attack);
  // if (attack?.kind === "senpu") {
  //JT-2026/11/28 - reserve the ground ring for area attacks
  if (attack?.kind === "senpu" && !attack.move.projectile) {
    const { x, z } = state.player;
    drawGroundRing(x, z, attack.move.reach, "#ffde8d", attack.spent ? "#fbcb5970" : "#fbcb5936", 2.5);
  }

  const show = state.phase === "title"
    ? [{ ...state.player, x: 11.9, z: 7.5, direction: -1 }]
    : [state.player, ...state.enemies.filter(enemy => enemy.death < .85)];
  const actors = show.map(fighter => ({ fighter, z: fighter.z }));
  state.shots.forEach(shot => actors.push({ shot, z: shot.z }));
  actors.sort((a, b) => a.z - b.z);
  for (const actor of actors) {
    if (actor.fighter) drawFighter(actor.fighter);
    else drawShot(actor.shot);
  }
  //JT-2026/11/28 - show a falling rack over every targeted enemy
  if (attack?.move.dropStart && attack.elapsed >= attack.move.dropStart) {
    const image = images.get(MARIA_ATLASES.fx);
    const targets = attack.dropTargets ?? state.enemies.filter(enemy => enemy.health > 0);
    for (const target of targets) {
      const point = project(target.x, target.z);
      drawMariaGondolaFall(context, image, point.x, point.y, point.scale, attack.elapsed);
    }
  }
  for (const spark of state.sparks) drawSpark(spark);
}

//JT-2026/11/23 - frame the active arena art behind the projected floor
function drawArena() {
  const { width, height } = view;
  context.fillStyle = "#252a29";
  context.fillRect(0, 0, width, height);
  const art = images.get(LEVELS[state.level].backdrop);
  if (art?.complete && art.naturalWidth) {
    const backdropHeight = height * .64;
    const scale = Math.max(width / art.width, backdropHeight / art.height);
    const renderedWidth = art.width * scale;
    const renderedHeight = art.height * scale;
    context.drawImage(art, (width - renderedWidth) / 2, backdropHeight - renderedHeight, renderedWidth, renderedHeight);
  }
  const ground = context.createLinearGradient(0, height * .48, 0, height);
  ground.addColorStop(0, "#27302c02");
  ground.addColorStop(.22, "#252a295e");
  ground.addColorStop(.32, "#252a29");
  ground.addColorStop(.64, "#282b2b");
  ground.addColorStop(1, "#101516");
  context.fillStyle = ground;
  context.fillRect(0, height * .48, width, height * .52);

  const corners = [project(0, 0), project(WORLD.width, 0), project(WORLD.width, WORLD.depth), project(0, WORLD.depth)];
  const lane = context.createLinearGradient(0, corners[0].y, 0, corners[2].y);
  lane.addColorStop(0, "#2a2d281c");
  lane.addColorStop(1, "#5b594747");
  context.beginPath();
  corners.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
  context.closePath();
  context.fillStyle = lane;
  context.fill();
  context.strokeStyle = "#f6d08c55";
  context.lineWidth = 1;
  context.stroke();
  //JT-2026/11/24 - flash the entire floor when almighty push lands
  const attack = state.player.attack;
  // if (attack?.kind === "almightyPush" && attack.spent && attack.elapsed < ALMIGHTY_PUSH.soundEnd) {
  //   const fade = (ALMIGHTY_PUSH.soundEnd - attack.elapsed) / (ALMIGHTY_PUSH.soundEnd - ALMIGHTY_PUSH.impact);
  //JT-2026/11/25 - time the field flash to the selected ultimate
  const flashEnd = attack?.move.flashEnd ?? ALMIGHTY_PUSH.soundEnd;
  if (attack?.kind === "almightyPush" && attack.spent && attack.elapsed < flashEnd) {
    const fade = (flashEnd - attack.elapsed) / (flashEnd - attack.move.impact);
    context.fillStyle = `rgba(154, 231, 255, ${.32 * fade})`;
    context.fill();
  }
  for (const segment of [[.85, 3.2], [4.1, 6], [7.2, 9.1]]) {
    const start = project(segment[0], 6.15);
    const end = project(segment[1], 6.15);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = "#dfd5ac5e";
    context.lineWidth = 2;
    context.stroke();
  }

  const vignette = context.createLinearGradient(0, 0, 0, height);
  vignette.addColorStop(0, "#13181352");
  vignette.addColorStop(.62, "#081d2217");
  vignette.addColorStop(1, "#03101439");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
}

//JT-2026/11/23 - show a spawn ring at the point of entry
function drawSpawn(spawn) {
  drawGroundRing(spawn.x, spawn.z, .77, "#fbd270", "#f9c45331", 2);
  drawGroundRing(spawn.x, spawn.z, clamp(spawn.time, .09, .75), "#ffe9a8", "#f9c45318", 1);
}

//JT-2026/11/23 - telegraph swipes as rings and rider attacks as a ground lane
function drawDanger(enemy) {
  const { profile, attack } = enemy;
  if (!profile.dash) {
    drawGroundRing(enemy.x, enemy.z, profile.reach, "#ff8f67", "#eb553733", 2);
    return;
  }
  const length = profile.dash * (profile.duration - profile.windup);
  const start = project(enemy.x, enemy.z);
  const end = project(clamp(enemy.x + attack.dx * length, 0, WORLD.width), clamp(enemy.z + attack.dz * length, 0, WORLD.depth));
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.lineCap = "round";
  context.lineWidth = Math.max(13, view.width * .027);
  context.strokeStyle = "#f06a3b48";
  context.stroke();
  context.lineWidth = 2;
  context.strokeStyle = "#ff9676";
  context.stroke();
  context.lineCap = "butt";
}

//JT-2026/11/23 - draw markers using the arena's perspective transform
function drawGroundRing(x, z, radius, stroke, fill, width) {
  context.beginPath();
  for (let i = 0; i <= 36; i++) {
    const angle = i / 36 * Math.PI * 2;
    const point = project(x + Math.cos(angle) * radius, z + Math.sin(angle) * radius);
    if (i === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = width;
  context.stroke();
}

//JT-2026/11/23 - select a sprite frame without changing the source artwork
function fighterPose(fighter) {
  const isPlayer = !fighter.profile;
  // const sprite = isPlayer ? "hero" : fighter.profile.sprite;
  //JT-2026/11/25 - use ana's base sheet for her movement and recovery poses
  // const playerSprite = playingGloria ? GLORIA_ATLASES.base : "hero";
  const sprite = isPlayer ? playerSprite : fighter.profile.sprite;
  if (!fighter.health) return [sprite, 5, Math.min(3, Math.floor((fighter.death ?? 1) * 6))];
  if (fighter.stun) return [sprite, 4, fighter.stun > .18 ? 0 : 1];
  if (fighter.attack) {
    const attack = fighter.attack;
    if (!isPlayer) {
      const ratio = attack.time / fighter.profile.duration;
      return [sprite, fighter.kind === "snatcher" ? 2 : 3, Math.min(3, Math.floor(ratio * 4))];
    }
    //JT-2026/11/25 - render each of ana's attacks from its own atlas
    // if (playingGloria) return gloriaSkillPose(attack.kind, attack.elapsed);
    //JT-2026/11/28 - use ana for the fighter and her moves
    if (playingAna) return anaSkillPose(attack.kind, attack.elapsed);
    //JT-2026/11/27 - render jose's attacks from his own sprite sheet
    if (playingJose) return [sprite, ...joseSkillPose(attack.kind, attack.elapsed)];
    //JT-2026/11/28 - render maria's character frames from her base atlas
    if (playingMaria) return [sprite, ...mariaSkillPose(attack.kind, attack.elapsed)];
    const progress = attack.elapsed / attack.move.duration;
    const column = Math.min(3, Math.floor(progress * 4));
    //JT-2026/11/24 - show the third hero sheet through the full cast
    if (attack.kind === "almightyPush") return ["almightyPush", ...almightyPushPose(attack.elapsed)];
    if (attack.kind === "punch") return ["actions", 0, Math.min(8, Math.floor(progress * 9))];
    // return [sprite, { kick: 3, haduken: 7, senpu: 8 }[attack.kind], column];
    //JT-2026/11/25 - show the release pose as soon as the haduken leaves juan's hands
    if (attack.kind === "haduken") return [sprite, ...juanHadukenPose(attack.elapsed, attack.move.duration)];
    return [sprite, { kick: 3, senpu: 8 }[attack.kind], column];
  }
  if (fighter.chargeAnimation > 0) {
    const progress = 1 - fighter.chargeAnimation / CHARGE_ANIMATION_TIME;
    //JT-2026/11/25 - show ana's prayer when she picks up a charge token
    // if (playingGloria) return gloriaSkillPose("pray", progress * .67);
    //JT-2026/11/28 - use ana for the fighter and her moves
    if (playingAna) return anaSkillPose("pray", progress * .67);
    //JT-2026/11/27 - play jose's full prayer sequence during survival token pickup
    if (playingJose) return [sprite, ...joseSkillPose("pray", progress * JOSE_SKILLS.pray.duration, true)];
    //JT-2026/11/27 - play maria's full prayer sequence during survival token pickup
    if (playingMaria) return [sprite, ...mariaSkillPose("pray", progress * MARIA_SKILLS.pray.duration, true)];
    return ["actions", 1, clamp(Math.floor(progress * 7), 0, 6)];
  }
  return [sprite, fighter.moving ? 1 : 0, Math.floor(fighter.age * (fighter.moving ? 10 : 3.6)) % 4];
}

//JT-2026/11/23 - anchor the sprites and health indicators to their ground positions
function drawFighter(fighter) {
  const [name, row, column] = fighterPose(fighter);
  const image = images.get(name);
  if (!image?.complete || !image.naturalWidth) return;
  const { x, y, scale } = project(fighter.x, fighter.z);
  // const frame = name === "actions" ? ACTION_FRAME : name === "hero" ? HERO_FRAME : FRAME;
  //JT-2026/11/24 - keep the almighty push sprite anchored to juan's ground position
  let frame = name === "actions" ? ACTION_FRAME : name === "hero" ? HERO_FRAME : FRAME;
  if (name === "almightyPush") frame = ALMIGHTY_PUSH.frame;
  //JT-2026/11/25 - align ana's cells while drawing the whole descending blast
  // if (!fighter.profile && playingGloria) frame = name === GLORIA_ATLASES.spirit ? GLORIA_SPIRIT_FRAME : GLORIA_FRAME;
  //JT-2026/11/28 - use ana for the fighter and her moves
  if (!fighter.profile && playingAna) frame = name === ANA_ATLASES.spirit ? ANA_SPIRIT_FRAME : ANA_FRAME;
  //JT-2026/11/27 - anchor jose's survival poses to the projected floor
  if (name === JOSE_PROFILE.id) frame = JOSE_FRAME;
  //JT-2026/11/28 - anchor maria's base sprites at their feet
  if (name === MARIA_ATLASES.base) frame = MARIA_FRAME;
  const size = scale * (fighter.profile?.size ?? 1);
  context.fillStyle = "#0c10109c";
  context.beginPath();
  context.ellipse(x, y + 1, 29 * size, 6.7 * size, 0, 0, Math.PI * 2);
  context.fill();
  context.save();
  if (fighter.death > .55) context.globalAlpha = (1 - fighter.death / .9);
  else if (fighter.invulnerable && Math.floor(state.clock * 18) % 2) context.globalAlpha = .62;
  // const lift = fighter.attack?.kind === "senpu" ? Math.sin(Math.PI * fighter.attack.elapsed / fighter.attack.move.duration) * 24 * size : 0;
  //JT-2026/11/24 - hold juan in the air before lowering him to the floor
  const attack = fighter.attack;
  let lift = 0;
  // if (name === "almightyPush") lift = almightyPushLift(attack.elapsed) * size;
  //JT-2026/11/25 - center the push wave on juan as the survival camera projects his position
  if (name === "almightyPush") {
    lift = almightyPushLift(attack.elapsed) * size;
    drawAlmightyPushWave(context, x, y - lift, size, attack.elapsed);
  }
  // else if (attack?.kind === "senpu") lift = Math.sin(Math.PI * attack.elapsed / attack.move.duration) * 24 * size;
  //JT-2026/11/25 - draw the orb above ana as she hovers and gathers energy
  // else if (name === GLORIA_ATLASES.spirit) {
    // lift = gloriaSpiritLift(attack.elapsed) * size;
    // drawGloriaSpiritOrb(context, image, x, y - lift, size, attack.elapsed, view.width);
  //JT-2026/11/28 - use ana for the fighter and her moves
  else if (name === ANA_ATLASES.spirit) {
    lift = anaSpiritLift(attack.elapsed) * size;
    drawAnaSpiritOrb(context, image, x, y - lift, size, attack.elapsed, view.width);
  }
  // else if (attack?.kind === "senpu" && !attack.move.followUps) lift = Math.sin(Math.PI * attack.elapsed / attack.move.duration) * 24 * size;
  //JT-2026/11/28 - keep the ranged rack push on the ground
  else if (attack?.kind === "senpu" && !attack.move.followUps && !attack.move.projectile) lift = Math.sin(Math.PI * attack.elapsed / attack.move.duration) * 24 * size;
  context.translate(x, y - lift);
  context.scale(fighter.direction, 1);
  context.imageSmoothingEnabled = true;
  // context.drawImage(image, column * frame.width, row * frame.height, frame.width, frame.height,
  //   -frame.x * size, -frame.y * size, frame.width * size, frame.height * size);
  //JT-2026/11/27 - keep the heroes' hands lowered while their feet animate during survival movement
  const sourceY = row * frame.height;
  const sourceX = column * frame.width;
  const drawX = -frame.x * size;
  const drawY = -frame.y * size;
  const drawWidth = frame.width * size;
  if (!fighter.profile && row === 1 && (name === "hero" || name === ANA_ATLASES.base)) {
    // The fourth walk frame has relaxed, empty hands. Split below the hands within the pants.
    const upperHeight = playingAna ? 177 : 180;
    const lowerHeight = frame.height - upperHeight;
    context.drawImage(image, 3 * frame.width, sourceY, frame.width, upperHeight,
      drawX, drawY, drawWidth, upperHeight * size);
    context.drawImage(image, sourceX, sourceY + upperHeight, frame.width, lowerHeight,
      drawX, drawY + upperHeight * size, drawWidth, lowerHeight * size);
  } else {
    context.drawImage(image, sourceX, sourceY, frame.width, frame.height,
      drawX, drawY, drawWidth, frame.height * size);
  }
  context.restore();
  if (fighter.profile && fighter.health) {
    const isBoss = fighter.profile.boss;
    const healthWidth = (isBoss ? 68 : 40) * Math.max(.7, size);
    const hpY = y - 144 * size;
    context.fillStyle = "#171714e8";
    context.fillRect(x - healthWidth / 2 - 1, hpY - 1, healthWidth + 2, 5);
    context.fillStyle = isBoss ? "#f7c45a" : "#f0876b";
    context.fillRect(x - healthWidth / 2, hpY, healthWidth * fighter.health / fighter.profile.health, 3);
    if (isBoss) {
      context.textAlign = "center";
      context.font = "700 12px system-ui";
      context.strokeStyle = "#1a1812";
      context.strokeText(fighter.profile.name, x, hpY - 5);
      context.fillStyle = "#ffe5ae";
      context.fillText(fighter.profile.name, x, hpY - 5);
    }
  }
}

//JT-2026/11/23 - use the existing haduken frame at the projectile's ground position
function drawShot(shot) {
  //JT-2026/11/28 - draw maria's props without assuming every shot has its own move
  const projectile = shot.move?.projectile;
  if (projectile?.atlas === MARIA_ATLASES.fx) {
    const image = images.get(projectile.atlas);
    const point = project(shot.x, shot.z);
    context.save();
    context.translate(point.x, point.y - projectile.handHeight * point.scale);
    context.scale(shot.dx < 0 ? -1 : 1, 1);
    drawMariaProjectile(context, image, projectile, 1.62 - shot.life, point.scale, shot.volley);
    context.restore();
    return;
  }
  //JT-2026/11/28 - draw jose's remaining configured projectile effects
  if (projectile) {
    const image = images.get(JOSE_PROFILE.id);
    if (!image?.complete || !image.naturalWidth) return;
    const point = project(shot.x, shot.z);
    context.save();
    context.translate(point.x, point.y - projectile.handHeight * point.scale);
    context.scale(shot.dx < 0 ? -1 : 1, 1);
    drawJoseProjectile(context, image, projectile, point.scale);
    context.restore();
    return;
  }
  // const image = images.get("hero");
  //JT-2026/11/25 - render the thrown stapler or juan's fireball
  // const image = images.get(shot.move ? GLORIA_ATLASES.base : "hero");
  //JT-2026/11/28 - use ana for the fighter and her moves
  const image = images.get(shot.move ? ANA_ATLASES.base : "hero");
  if (!image?.complete || !image.naturalWidth) return;
  const point = project(shot.x, shot.z);
  const scale = point.scale * .58;
  context.save();
  // context.translate(point.x, point.y - 43 * point.scale);
  //JT-2026/11/25 - keep the haduken at hand height as it travels through the projected arena
  const elevation = shot.move ? 43 : JUAN_HADUKEN.handHeight;
  context.translate(point.x, point.y - elevation * point.scale);
  context.scale(shot.dx < 0 ? -1 : 1, 1);
  // context.drawImage(image, 0, HERO_FRAME.height * 9, HERO_FRAME.width, HERO_FRAME.height,
  //   -HERO_FRAME.x * scale, -HERO_FRAME.height * scale / 2, HERO_FRAME.width * scale, HERO_FRAME.height * scale);
  // const { width, height, x, y } = shot.move ? GLORIA_FRAME : HERO_FRAME;
  //JT-2026/11/28 - use ana for the fighter and her moves
  const { width, height, x, y } = shot.move ? ANA_FRAME : HERO_FRAME;
  context.drawImage(image, 0, height * (shot.move ? 8 : 9), width, height,
    -x * scale, -(shot.move ? y : height / 2) * scale, width * scale, height * scale);
  context.restore();
}

//JT-2026/11/23 - render a small grounded particle
function drawSpark(spark) {
  const point = project(spark.x, spark.z);
  context.globalAlpha = Math.min(1, spark.life * 3);
  context.fillStyle = spark.color;
  context.fillRect(point.x, point.y - (1 - spark.life) * 18, 3, 3);
  context.globalAlpha = 1;
}

//JT-2026/11/23 - update level progress and highlight the active wave
function syncHud() {
  const health = state.player.health;
  const charge = Math.min(MAX_CHARGE, Math.floor(state.player.charge + 1e-7));
  const wave = Math.max(1, state.wave);
  const waves = LEVELS[state.level].waves;
  if (health !== lastHealth) {
    lastHealth = health;
    ui.health.style.setProperty("--hp", health / 100);
    ui.health.setAttribute("aria-valuenow", health);
    ui.hpLabel.textContent = health + " HP";
  }
  if (charge !== lastCharge) {
    lastCharge = charge;
    const bars = Math.floor(charge / BAR);
    ui.special.setAttribute("aria-valuenow", charge);
    ui.special.setAttribute("aria-valuetext", bars + " of 3 bars ready");
    ui.specialLabel.textContent = bars + " / 3";
    [...ui.special.children].forEach((part, index) => {
      part.firstElementChild.style.transform = "scaleX(" + clamp(charge / BAR - index, 0, 1) + ")";
    });
  }
  if (wave !== lastWave || state.level !== lastLevel) {
    lastWave = wave;
    lastLevel = state.level;
    ui.level.textContent = "Level " + (state.level + 1) + " / " + LEVELS.length;
    ui.wave.textContent = String(wave).padStart(2, "0") + " / " + String(waves.length).padStart(2, "0");
    [...ui.waveGuide.children].forEach((guide, levelIndex) => {
      [...guide.querySelector(".wave-guide").children].forEach((card, index) => {
        if (levelIndex === state.level && index + 1 === wave) card.setAttribute("aria-current", "step");
        else card.removeAttribute("aria-current");
      });
    });
  }
  const alive = state.phase === "title" ? waves[0].length : state.spawnQueue.length + state.enemies.filter(enemy => enemy.health).length;
  const text = state.phase === "rest" ? "Get ready" : alive + (alive === 1 ? " threat" : " threats");
  if (ui.remaining.textContent !== text) ui.remaining.textContent = text;
}

//JT-2026/11/23 - load the original music and cues from local project assets
function prepareSounds() {
  //JT-2026/11/24 - warm up the voice clip before the first cast
  // prepareAlmightyPushVoice();
  //JT-2026/11/25 - warm up the active fighter's ultimate voice
  // prepareAlmightyPushVoice(playingGloria ? GLORIA_SKILLS.almightyPush : ALMIGHTY_PUSH);
  //JT-2026/11/27 - preload the selected survival ultimate's sound
  prepareAlmightyPushVoice(alternateSkills?.almightyPush ?? ALMIGHTY_PUSH);
  if (recordings.size) return;
  // for (const [name, [file, volume]] of Object.entries(SOUNDS)) {
  //JT-2026/11/24 - stop monster clips after the selected excerpt
  for (const [name, [file, volume, offset, duration]] of Object.entries(SOUNDS)) {
    const recording = new Audio("assets/" + file);
    recording.preload = "auto";
    recording.volume = volume;
    recording.loop = name === "music";
    if (duration) {
      recording.addEventListener("timeupdate", () => {
        if (recording.currentTime >= offset + duration) recording.pause();
      });
    }
    recordings.set(name, recording);
  }
}

//JT-2026/11/23 - play a cue when sound is enabled
function playSound(name) {
  const recording = recordings.get(name);
  if (!soundEnabled || !recording || document.hidden) return;
  if (!recording.loop) recording.currentTime = SOUNDS[name][2];
  recording.play().catch(() => {});
}

//JT-2026/11/23 - stop playback when a run ends or is interrupted
function stopSounds() {
  for (const recording of recordings.values()) recording.pause();
  //JT-2026/11/24 - stop the cast voice with pause, mute, and run transitions
  pauseAlmightyPushVoice(state.player.attack);
}

//JT-2026/11/23 - retain the player's sound preference throughout the session
function toggleSound() {
  soundEnabled = !soundEnabled;
  ui.sound.textContent = soundEnabled ? "Sound on" : "Sound off";
  ui.sound.setAttribute("aria-pressed", soundEnabled);
  if (!soundEnabled) stopSounds();
  // else if (isPlaying()) playSound("music");
  //JT-2026/11/24 - rejoin the current voice position after unmuting
  else if (isPlaying()) {
    playSound("music");
    resumeAlmightyPushVoice(state.player.attack);
  }
}

//JT-2026/11/23 - bound position and meter values
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

//JT-2026/11/23 - spawn and collect charge tokens during the run
function updateChargeTokens(dt) {
  state.tokenTimer = Math.max(0, state.tokenTimer - dt);
  const player = state.player;
  if (!state.tokenTimer && state.tokens.length < TOKEN_LIMIT) {
    for (let offset = 0; offset < TOKEN_POINTS.length; offset++) {
      const index = (state.nextTokenPoint + offset) % TOKEN_POINTS.length;
      const [x, z] = TOKEN_POINTS[index];
      if (Math.hypot(x - player.x, z - player.z) < 2.1) continue;
      if (state.tokens.some(token => Math.hypot(x - token.x, z - token.z) < 1.4)) continue;
      if (state.enemies.some(enemy => enemy.health && Math.hypot(x - enemy.x, z - enemy.z) < 1.3)) continue;
      state.tokens.push({ x, z });
      state.nextTokenPoint = (index + 1) % TOKEN_POINTS.length;
      state.tokenTimer = TOKEN_INTERVAL;
      break;
    }
  }
  if (player.charge >= MAX_CHARGE || player.stun || player.attack || player.chargeAnimation) return;
  const collected = state.tokens.findIndex(token => Math.hypot(token.x - player.x, token.z - player.z) <= .72);
  if (collected < 0) return;
  const [token] = state.tokens.splice(collected, 1);
  player.charge = Math.min(MAX_CHARGE, player.charge + BAR);
  player.chargeAnimation = CHARGE_ANIMATION_TIME;
  player.moving = false;
  burst(token.x, token.z, "#8ff9db", 10);
  playSound("chargeToken");
  showNotice("Charge Token · +1 Special Bar", 1.35);
}

//JT-2026/11/23 - stop the short pickup effect when its animation ends or juan is interrupted
function endChargeAnimation(player) {
  player.chargeAnimation = 0;
  recordings.get("chargeToken")?.pause();
}

//JT-2026/11/23 - render a cross shaped charge token above its ground marker
function drawChargeToken(token) {
  const point = project(token.x, token.z);
  const scale = clamp(point.scale, .65, 1.15);
  drawGroundRing(token.x, token.z, .54, "#86e9cbaa", "#255c4839", 1.5);
  context.save();
  context.translate(point.x, point.y - (25 + Math.sin(state.clock * 4) * 3) * scale);
  context.textAlign = "center";
  context.textBaseline = "bottom";
  context.font = "750 " + Math.max(10, Math.round(13 * scale)) + "px system-ui";
  context.lineWidth = 3;
  context.strokeStyle = "#141c18";
  context.strokeText("Charge Token", 0, -16 * scale);
  context.fillStyle = "#e4fff4";
  context.fillText("Charge Token", 0, -16 * scale);

  context.scale(scale, scale);
  context.beginPath();
  const corners = [[-4,-13],[4,-13],[4,-4],[12,-4],[12,4],[4,4],[4,13],[-4,13],[-4,4],[-12,4],[-12,-4],[-4,-4]];
  corners.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath();
  context.strokeStyle = "#155940";
  context.lineWidth = 3;
  context.stroke();
  context.shadowBlur = 12;
  context.shadowColor = "#65fccb";
  context.fillStyle = "#a0ffde";
  context.fill();
  context.restore();
}

//JT-2026/11/23 - group the wave guides under their arena previews
function makeWaveGuide() {
  LEVELS.forEach((level, index) => {
    const guide = document.createElement("section");
    guide.className = "level-guide";
    const header = document.createElement("header");
    header.className = "level-guide-header";
    const map = document.createElement("img");
    map.src = "assets/arcade/previews/" + ART[level.backdrop];
    map.alt = "";
    map.loading = "lazy";
    map.width = 480;
    map.height = 270;
    const title = document.createElement("h3");
    title.textContent = "Level " + (index + 1) + " · " + level.name;
    const waves = document.createElement("ol");
    waves.className = "wave-guide";
    level.waves.forEach((wave, waveIndex) => waves.append(makeWaveCard(wave, waveIndex + 1)));
    header.append(map, title);
    guide.append(header, waves);
    ui.waveGuide.append(guide);
  });
}

//JT-2026/11/23 - preview the actual enemies and attack patterns in each wave
function makeWaveCard(wave, waveNumber) {
  const card = document.createElement("li");
  const title = document.createElement("h4");
  title.textContent = "Wave " + waveNumber;
  const lineup = document.createElement("ul");
  lineup.className = "wave-lineup";
  for (const kind of new Set(wave)) {
    const profile = ENEMIES[kind];
    const enemy = document.createElement("li");
    const portrait = document.createElement("img");
    portrait.src = "assets/arcade/previews/" + ART[profile.sprite];
    portrait.alt = "";
    portrait.loading = "lazy";
    portrait.decoding = "async";
    portrait.width = 192;
    portrait.height = 128;
    const caption = document.createElement("div");
    const name = document.createElement("strong");
    const count = wave.filter(entry => entry === kind).length;
    name.textContent = profile.name + (count > 1 ? " ×" + count : "");
    const hint = document.createElement("p");
    hint.textContent = profile.hint;
    caption.append(name, hint);
    enemy.append(portrait, caption);
    lineup.append(enemy);
  }
  card.append(title, lineup);
  return card;
}

//JT-2026/11/23 - load only the backdrop and combat sprites used in the selected level
function prepareLevelArt(index) {
  const level = LEVELS[index];
  // const names = new Set(["hero", "actions", level.backdrop]);
  //JT-2026/11/24 - have the almighty push atlas ready in every arena
  // const names = new Set(["hero", "actions", "almightyPush", level.backdrop]);
  //JT-2026/11/25 - load only the chosen fighter's atlases and the current arena
  // const heroArt = playingGloria ? Object.values(GLORIA_ATLASES) : ["hero", "actions", "almightyPush"];
  //JT-2026/11/27 - load jose's own sprite pack for survival encounters
  const heroArt = playingJose ? [playerSprite] : playingAna ? Object.values(ANA_ATLASES) : playingMaria ? Object.values(MARIA_ATLASES) : ["hero", "actions", "almightyPush"];
  const names = new Set([...heroArt, level.backdrop]);
  level.waves.flat().forEach(kind => names.add(ENEMIES[kind].sprite));
  return Promise.all([...names].map(async name => {
    if (images.has(name)) return;
    const image = new Image();
    image.src = "assets/arcade/" + ART[name];
    await image.decode();
    images.set(name, image);
  }));
}

//JT-2026/11/23 - carry special charge into the next arena after its art is ready
async function continueLevel() {
  const next = state.level + 1;
  const charge = state.player.charge;
  ui.start.disabled = true;
  ui.start.textContent = "Loading arena…";
  try {
    await prepareLevelArt(next);
  } catch {
    const name = LEVELS[next].name;
    showScreen("Arena unavailable", name + " artwork could not load. You can retry from here.", "Retry " + name);
    return;
  }
  startLevel(next, charge);
}

//JT-2026/11/23 - start the selected arena at full health with the carried charge
function startLevel(index, charge = 0) {
  stopSounds();
  clearInputs();
  state.level = index;
  state.player = createPlayer();
  state.player.charge = charge;
  state.sparks = [];
  state.tokens = [];
  state.tokenTimer = 2;
  state.nextTokenPoint = 0;
  state.wave = 0;
  state.clock = 0;
  ui.location.textContent = LEVELS[index].name;
  ui.arena.setAttribute("aria-label", LEVELS[index].name + " arena map");
  ui.screen.hidden = true;
  ui.start.disabled = false;
  ui.start.blur();
  ui.pause.disabled = false;
  beginWave();
  playSound("music");
}

//JT-2026/11/25 - hit living enemies in front of the cannon and inside its lane
// function resolveGloriaBeam(player, reach, damage) {
//JT-2026/11/28 - use ana for the fighter and her moves
function resolveAnaBeam(player, reach, damage) {
  for (const enemy of state.enemies) {
    if (!enemy.health) continue;
    const dx = enemy.x - player.x;
    const dz = enemy.z - player.z;
    const forward = dx * player.aimX + dz * player.aimZ;
    const across = Math.abs(dx * player.aimZ - dz * player.aimX);
    if (forward >= 0 && forward <= reach + enemy.radius && across <= .72 + enemy.radius) {
      hitEnemy(enemy, player, damage, .78, false);
    }
  }
}

//JT-2026/11/25 - project the cannon beam from ana to the edge of its lane
/*
function drawGloriaBeam(player, attack) {
  const edge = (position, direction, bound) => direction ? ((direction > 0 ? bound : 0) - position) / direction : Infinity;
  const distance = Math.min(attack.move.reach, edge(player.x, player.aimX, WORLD.width), edge(player.z, player.aimZ, WORLD.depth));
  const from = project(player.x, player.z);
  const to = project(player.x + player.aimX * distance, player.z + player.aimZ * distance);
  const dx = to.x - from.x;
  const dy = to.y - from.y - 65 * (to.scale - from.scale);
  context.save();
  context.translate(from.x, from.y - 65 * from.scale);
  context.rotate(Math.atan2(dy, dx));
  context.translate(24 * from.scale, 0);
  drawBasookaBeam(context, Math.max(0, Math.hypot(dx, dy) - 24 * from.scale), attack.elapsed, 12 * from.scale);
  context.restore();
}
*/

//JT-2026/11/27 - project the rei gun from ana's finger along her aim
function drawAnaBeam(player, attack) {
  const beam = reiGunBeamPose(attack.elapsed);
  if (!beam) return;
  const edge = (position, direction, bound) => direction ? ((direction > 0 ? bound : 0) - position) / direction : Infinity;
  const distance = Math.min(attack.move.reach, edge(player.x, player.aimX, WORLD.width), edge(player.z, player.aimZ, WORLD.depth));
  const from = project(player.x, player.z);
  const to = project(player.x + player.aimX * distance, player.z + player.aimZ * distance);
  const offset = player.direction * beam.x * from.scale;
  const startX = from.x + offset;
  const startY = from.y - beam.y * from.scale;
  const laneX = to.x - from.x;
  const dx = laneX - offset;
  const dy = to.y - beam.y * to.scale - startY;
  if (dx * laneX + dy * dy <= 0) return;
  context.save();
  context.translate(startX, startY);
  context.rotate(Math.atan2(dy, dx));
  drawReiGunBeam(context, images.get(ANA_ATLASES.reiGun), Math.hypot(dx, dy), from.scale, beam.column);
  context.restore();
}
