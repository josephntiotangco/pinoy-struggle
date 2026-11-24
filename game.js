"use strict";

/*
//JT-2026/11/19 - define the opponent order and combat behavior
const OPPONENTS = [
  { id: "kamote_rider_0", size: 1.16, body: 51, speed: 130, reach: 95, power: 9, interval: 1.18, heavy: .15, guard: .04 },
  { id: "adik_0", size: 1.14, body: 27, speed: 173, reach: 76, power: 10, interval: .89, heavy: .34, guard: .05 },
  //JT-2026/11/19 - scale mayabang's suv to juan's standing height
  { id: "mayabang_0", size: 1.88, body: 118, edge: 170, speed: 108, reach: 164, power: 11, interval: 1.16, heavy: .16, guard: .09 },
  { id: "congressman_0", size: 1.16, body: 33, speed: 127, reach: 91, power: 11, interval: .92, heavy: .46, guard: .19 },
  { id: "matapobre_0", size: 1.15, body: 28, speed: 160, reach: 80, power: 12, interval: .76, heavy: .29, guard: .26 },
  { id: "billing_0", size: 1.14, body: 37, speed: 145, reach: 94, power: 13, interval: .79, heavy: .45, guard: .15 },
  { id: "stress_0", size: 1.13, body: 37, speed: 190, reach: 84, power: 13, interval: .65, heavy: .35, guard: .19 },
  { id: "emotional_damage_0", size: 1.14, body: 42, speed: 166, reach: 95, power: 14, interval: .68, heavy: .5, guard: .22 },
  { id: "gasoline_0", size: 1.19, body: 48, speed: 152, reach: 107, power: 16, interval: .7, heavy: .56, guard: .21 },
];
*/
/*
//JT-2026/11/19 - add snatcher and raise opponent health across the new ladder
const OPPONENTS = [
  { id: "kamote_rider_0", maxHealth: 160, size: 1.16, body: 51, speed: 130, reach: 95, power: 9, interval: 1.18, heavy: .15, guard: .04 },
  { id: "snatcher_0", maxHealth: 175, size: 1.16, body: 32, speed: 188, reach: 86, power: 10, interval: .96, heavy: .22, guard: .06 },
  { id: "adik_0", maxHealth: 185, size: 1.14, body: 27, speed: 173, reach: 76, power: 10, interval: .89, heavy: .34, guard: .05 },
  { id: "congressman_0", displayName: "politiko", maxHealth: 200, size: 1.16, body: 33, speed: 127, reach: 91, power: 11, interval: .92, heavy: .46, guard: .19 },
  { id: "mayabang_0", maxHealth: 215, size: 1.88, body: 118, edge: 170, speed: 108, reach: 164, power: 11, interval: 1.16, heavy: .16, guard: .09 },
  { id: "matapobre_0", maxHealth: 230, size: 1.15, body: 28, speed: 160, reach: 80, power: 12, interval: .76, heavy: .29, guard: .26 },
  { id: "gasoline_0", maxHealth: 245, size: 1.19, body: 48, speed: 152, reach: 107, power: 16, interval: .7, heavy: .56, guard: .21 },
  { id: "billing_0", maxHealth: 260, size: 1.14, body: 37, speed: 145, reach: 94, power: 13, interval: .79, heavy: .45, guard: .15 },
  { id: "stress_0", maxHealth: 280, size: 1.13, body: 37, speed: 190, reach: 84, power: 13, interval: .65, heavy: .35, guard: .19 },
  { id: "emotional_damage_0", maxHealth: 300, size: 1.14, body: 42, speed: 166, reach: 95, power: 14, interval: .68, heavy: .5, guard: .22 },
];
*/
//JT-2026/11/19 - add kahirapan after snatcher and give opponents enough health for three super bars
const OPPONENTS = [
  // { id: "kamote_rider_0", maxHealth: 300, size: 1.16, body: 51, speed: 130, reach: 95, power: 9, interval: 1.18, heavy: .15, guard: .04 },
  //JT-2026/11/23 - use a space on the kamote rider nameplate
  { id: "kamote_rider_0", displayName: "kamote rider", maxHealth: 300, size: 1.16, body: 51, speed: 130, reach: 95, power: 9, interval: 1.18, heavy: .15, guard: .04 },
  // { id: "snatcher_0", maxHealth: 320, size: 1.16, body: 32, speed: 188, reach: 86, power: 10, interval: .96, heavy: .22, guard: .06 },
  //JT-2026/11/22 - put lubak na daan ebike and snatcher in the maypajo arena
  // { id: "lubak_sa_daan_0", displayName: "lubak_na_daan", backdrop: "maypajo", maxHealth: 305, size: 1.12, body: 56, speed: 111, reach: 101, power: 9, interval: 1.14, heavy: .25, guard: .11 },
  //JT-2026/11/23 - shorten the level two nameplate to lubak
  { id: "lubak_sa_daan_0", displayName: "lubak", backdrop: "maypajo", maxHealth: 305, size: 1.12, body: 56, speed: 111, reach: 101, power: 9, interval: 1.14, heavy: .25, guard: .11 },
  { id: "ebike_0", backdrop: "maypajo", maxHealth: 315, size: 1.16, body: 55, speed: 158, reach: 94, power: 10, interval: 1.05, heavy: .23, guard: .10 },
  // { id: "snatcher_0", backdrop: "maypajo", maxHealth: 320, size: 1.16, body: 32, speed: 188, reach: 86, power: 10, interval: .96, heavy: .22, guard: .06 },
  //JT-2026/11/23 - move snatcher's fight to edsa
  { id: "snatcher_0", backdrop: "edsa", maxHealth: 320, size: 1.16, body: 32, speed: 188, reach: 86, power: 10, interval: .96, heavy: .22, guard: .06 },
  { id: "kahirapan_0", maxHealth: 330, size: 1.2, body: 39, speed: 115, reach: 93, power: 11, interval: 1.05, heavy: .36, guard: .09 },
  { id: "adik_0", maxHealth: 340, size: 1.14, body: 27, speed: 173, reach: 76, power: 10, interval: .89, heavy: .34, guard: .05 },
  //JT-2026/11/22 - put lipunan in tondo and traffic in bgc before politiko
  { id: "lipunan_0", backdrop: "tondo", maxHealth: 345, size: 1.17, body: 46, speed: 145, reach: 97, power: 11, interval: .88, heavy: .33, guard: .12 },
  // { id: "traffic_0", backdrop: "bgc", maxHealth: 350, size: 1.23, body: 69, speed: 135, reach: 118, power: 12, interval: 1.02, heavy: .32, guard: .11 },
  //JT-2026/11/23 - move traffic's fight to edsa
  { id: "traffic_0", backdrop: "edsa", maxHealth: 350, size: 1.23, body: 69, speed: 135, reach: 118, power: 12, interval: 1.02, heavy: .32, guard: .11 },
  //JT-2026/11/24 - put taas presyo in balintawak at level nine
  { id: "inflation_0", displayName: "Taas Presyo", backdrop: "balintawak", maxHealth: 352, size: 1.2, body: 48, speed: 130, reach: 104, power: 12, interval: .87, heavy: .39, guard: .13 },
  //JT-2026/11/23 - fight boss mo in bgc before politiko
  { id: "bossy_0", displayName: "boss mo", backdrop: "bgc", maxHealth: 355, size: 1.16, body: 40, speed: 145, reach: 104, power: 12, interval: .89, heavy: .38, guard: .15 },
  // { id: "congressman_0", displayName: "politiko", maxHealth: 360, size: 1.16, body: 33, speed: 127, reach: 91, power: 11, interval: .92, heavy: .46, guard: .19 },
  // { id: "mayabang_0", maxHealth: 380, size: 1.88, body: 118, edge: 170, speed: 108, reach: 164, power: 11, interval: 1.16, heavy: .16, guard: .09 },
  // { id: "matapobre_0", maxHealth: 400, size: 1.15, body: 28, speed: 160, reach: 80, power: 12, interval: .76, heavy: .29, guard: .26 },
  //JT-2026/11/21 - set the malacaniang backdrop for politiko mayabang and matapobre
  { id: "congressman_0", displayName: "politiko", backdrop: "malacaniang", maxHealth: 360, size: 1.16, body: 33, speed: 127, reach: 91, power: 11, interval: .92, heavy: .46, guard: .19 },
  //JT-2026/11/22 - fight baha at g araneta between politiko and mayabang
  { id: "baha_0", backdrop: "g_araneta", maxHealth: 370, size: 1.18, body: 54, speed: 144, reach: 101, power: 13, interval: .87, heavy: .42, guard: .12 },
  // { id: "mayabang_0", backdrop: "malacaniang", maxHealth: 380, size: 1.88, body: 118, edge: 170, speed: 108, reach: 164, power: 11, interval: 1.16, heavy: .16, guard: .09 },
  //JT-2026/11/23 - move mayabang's fight to edsa
  { id: "mayabang_0", backdrop: "edsa", maxHealth: 380, size: 1.88, body: 118, edge: 170, speed: 108, reach: 164, power: 11, interval: 1.16, heavy: .16, guard: .09 },
  //JT-2026/11/24 - put justice delayed on padre faura at level fourteen
  { id: "injustice_0", displayName: "Justice Delayed", backdrop: "pfaura", maxHealth: 390, size: 1.21, body: 46, speed: 136, reach: 108, power: 13, interval: .91, heavy: .51, guard: .19 },
  { id: "matapobre_0", backdrop: "malacaniang", maxHealth: 400, size: 1.15, body: 28, speed: 160, reach: 80, power: 12, interval: .76, heavy: .29, guard: .26 },
  // { id: "gasoline_0", maxHealth: 420, size: 1.19, body: 48, speed: 152, reach: 107, power: 16, interval: .7, heavy: .56, guard: .21 },
  // { id: "billing_0", maxHealth: 440, size: 1.14, body: 37, speed: 145, reach: 94, power: 13, interval: .79, heavy: .45, guard: .15 },
  //JT-2026/11/19 - show gasoline and billing as petrolyo and bills
  // { id: "gasoline_0", displayName: "petrolyo", maxHealth: 420, size: 1.19, body: 48, speed: 152, reach: 107, power: 16, interval: .7, heavy: .56, guard: .21 },
  // { id: "billing_0", displayName: "bills", maxHealth: 440, size: 1.14, body: 37, speed: 145, reach: 94, power: 13, interval: .79, heavy: .45, guard: .15 },
  // { id: "stress_0", maxHealth: 460, size: 1.13, body: 37, speed: 190, reach: 84, power: 13, interval: .65, heavy: .35, guard: .19 },
  // { id: "emotional_damage_0", maxHealth: 480, size: 1.14, body: 42, speed: 166, reach: 95, power: 14, interval: .68, heavy: .5, guard: .22 },
  //JT-2026/11/22 - place the final four fights in bgc
  { id: "gasoline_0", displayName: "petrolyo", backdrop: "bgc", maxHealth: 420, size: 1.19, body: 48, speed: 152, reach: 107, power: 16, interval: .7, heavy: .56, guard: .21 },
  // { id: "billing_0", displayName: "bills", backdrop: "bgc", maxHealth: 440, size: 1.14, body: 37, speed: 145, reach: 94, power: 13, interval: .79, heavy: .45, guard: .15 },
  // { id: "stress_0", backdrop: "bgc", maxHealth: 460, size: 1.13, body: 37, speed: 190, reach: 84, power: 13, interval: .65, heavy: .35, guard: .19 },
  // { id: "emotional_damage_0", backdrop: "bgc", maxHealth: 480, size: 1.14, body: 42, speed: 166, reach: 95, power: 14, interval: .68, heavy: .5, guard: .22 },
  //JT-2026/11/23 - move the last four rounds to bahay and finish with loans
  { id: "billing_0", displayName: "bills", backdrop: "bahay", maxHealth: 440, size: 1.14, body: 37, speed: 145, reach: 94, power: 13, interval: .79, heavy: .45, guard: .15 },
  { id: "stress_0", backdrop: "bahay", maxHealth: 460, size: 1.13, body: 37, speed: 190, reach: 84, power: 13, interval: .65, heavy: .35, guard: .19 },
  { id: "emotional_damage_0", backdrop: "bahay", maxHealth: 480, size: 1.14, body: 42, speed: 166, reach: 95, power: 14, interval: .68, heavy: .5, guard: .22 },
  { id: "loans_0", backdrop: "bahay", maxHealth: 500, size: 1.25, body: 56, speed: 148, reach: 111, power: 16, interval: .76, heavy: .55, guard: .23 },
];
//JT-2026/11/22 - label all three campaign arenas
const ARENA_LOCATIONS = {
  tondo: "TONDO, MANILA",
  maypajo: "MAYPAJO, CALOOCAN",
  malacaniang: "MALACAÑANG, MANILA",
  //JT-2026/11/22 - show the bgc location in the arena strip
  bgc: "BGC, TAGUIG",
  //JT-2026/11/22 - show the g araneta location in the arena strip
  g_araneta: "G. ARANETA, QUEZON CITY",
  //JT-2026/11/23 - label the new home arena on the fight screen
  bahay: "BAHAY",
  //JT-2026/11/23 - show the edsa label during the road fights
  edsa: "EDSA",
  //JT-2026/11/24 - label the new market and courthouse backdrops
  balintawak: "BALINTAWAK, QUEZON CITY",
  pfaura: "PADRE FAURA, MANILA",
};
// const HERO = { id: "hero_0", size: 1.21, body: 25, speed: 263 };
//JT-2026/11/19 - give juan an explicit health maximum for timeout comparisons
const HERO = { id: "hero_0", maxHealth: 100, size: 1.21, body: 25, speed: 263 };
const ROUND_SECONDS = 60;
//JT-2026/11/19 - define the charge awarded by a clean punch or kick
// const SUPER_MAX = 100;
// const SUPER_GAIN = { light: 20, heavy: 34 };
//JT-2026/11/19 - let juan earn and store up to three special casts
const SUPER_BARS = 3;
const SUPER_COST = 100;
const SUPER_MAX = SUPER_BARS * SUPER_COST;
// const SUPER_GAIN = { light: 30, heavy: 50 };
//JT-2026/11/23 - make normal hits supplement the charge earned by praying
const SUPER_GAIN = { light: 2, heavy: 4 };
const FRAME = { width: 504, height: 201, x: 156, y: 192, scale: 1.5 };
// const POSE = { idle: 0, move: 1, light: 2, heavy: 3, hurt: 4, down: 5, jump: 6, guard: 7 };
//JT-2026/11/19 - map the taller hero frames and special attack art
const HERO_FRAME = { ...FRAME, height: 234, y: 225 };
//JT-2026/11/23 - align the alternate punch and charge sprites with juan's stance
const HERO_ACTIONS = {
  id: "hero_1", frame: { ...HERO_FRAME, width: 192, height: 250, x: 72, y: 241 }, punch: 0, charge: 1,
};
//JT-2026/11/23 - fill a bar in two and a half seconds of uninterrupted charge
const AURA_CHARGE_RATE = 40;
// const POSE = { idle: 0, move: 1, light: 2, heavy: 3, hurt: 4, down: 5, jump: 6, hadouken: 7, shoryuken: 8 };
//JT-2026/11/19 - map the renamed special moves to their existing animation rows
const POSE = { idle: 0, move: 1, light: 2, heavy: 3, hurt: 4, down: 5, jump: 6, energyWave: 7, superUpperCut: 8 };
const FIREBALL = { row: 9, speed: 540, lifetime: 1.4, radius: 38, elevation: 65, scale: .86 };
const MOVES = {
  light: { duration: .35, impact: .15, damage: 14, reach: 82, push: 158, stun: .27 },
  heavy: { duration: .61, impact: .29, damage: 23, reach: 107, push: 260, stun: .34 },
  //JT-2026/11/19 - set the timing and damage of juan's special attacks
  // hadouken: { duration: .72, impact: .29, damage: 19, reach: 0, push: 185, stun: .25 },
  // shoryuken: { duration: .8, impact: .16, damage: 26, reach: 89, push: 246, stun: .34 },
  //JT-2026/11/19 - identify juan's moves as energy wave and super upper cut
  // energyWave: { duration: .72, impact: .29, damage: 19, reach: 0, push: 185, stun: .25 },
  // superUpperCut: { duration: .8, impact: .16, damage: 26, reach: 89, push: 246, stun: .34 },
  //JT-2026/11/19 - make both specials stronger than the regular attacks
  // energyWave: { duration: .72, impact: .29, damage: 35, reach: 0, push: 185, stun: .25 },
  // superUpperCut: { duration: .8, impact: .16, damage: 45, reach: 89, push: 246, stun: .34 },
  //JT-2026/11/23 - raise both specials' damage for tougher opponents
  energyWave: { duration: .72, impact: .29, damage: 100, reach: 0, push: 185, stun: .25 },
  superUpperCut: { duration: .8, impact: .16, damage: 60, reach: 89, push: 246, stun: .34 },
  //JT-2026/11/24 - use the shared cast timing for the full-meter knockout
  almightyPush: { duration: ALMIGHTY_PUSH.duration, impact: ALMIGHTY_PUSH.impact, reach: 0, push: 350, stun: .34 },
};
const KEYS = {
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
  // ArrowUp: "jump", KeyW: "jump", ArrowDown: "guard", KeyS: "guard",
  // KeyJ: "light", KeyK: "heavy",
  //JT-2026/11/19 - replace the guard key with two special attack bindings
  ArrowUp: "jump", KeyW: "jump",
  // KeyJ: "light", KeyK: "heavy", KeyL: "hadouken", KeyI: "shoryuken",
  //JT-2026/11/19 - bind the existing keys to the renamed moves
  KeyJ: "light", KeyK: "heavy", KeyL: "energyWave", KeyI: "superUpperCut",
  //JT-2026/11/23 - bind the hold to charge action to u
  KeyU: "auraCharge",
  //JT-2026/11/24 - let players cast almighty push with o
  KeyO: "almightyPush",
};

//JT-2026/11/22 - set the timing and volume of the recordings and fight music
const GAME_AUDIO = {
  playerHurt: { file: "amber2023-ouch-208265.mp3", offset: .17, duration: .48, volume: .85 },
  opponentHurt: { file: "freesound_community-ough-47202.mp3", offset: .36, duration: .55, volume: .35 },
  superImpact: { file: "dragon-studio-boom-copyright-free-487662.mp3", offset: 0, duration: 1, volume: .24 },
  defeat: { file: "make_more_sound-8-bit-video-game-fail-version-2-145478.mp3", offset: .18, duration: 1.5, volume: .34 },
  vehicleCrash: { file: "rsf_studios-car-crash-swerving-and-crash-592672.mp3", offset: .36, duration: 2.05, volume: .25 },
  fightMusic: { file: "freesound_community-video-game-music-loop-27629.mp3", volume: .14, loop: true },
  //JT-2026/11/23 - assign the supplied sound bites to the specials and pray
  energyWave: { file: "hadouken.mp3", offset: 0, duration: .84, volume: .7 },
  superUpperCut: { file: "konoha_senpu.mp3", offset: 0, duration: 1.64, volume: .7 },
  auraCharge: { file: "super_saiyan_god.mp3", offset: .1, duration: 3.75, volume: .8, interruptible: true },
  //JT-2026/11/24 - preload the shared monster attack clips with the arena effects
  ...MONSTER_AUDIO,
};
const VEHICLE_OPPONENTS = new Set(["kamote_rider_0", "ebike_0", "traffic_0", "mayabang_0"]);

//JT-2026/11/19 - connect the arcade ui and initialize the first matchup
const byId = id => document.getElementById(id);
const ui = {
  arena: byId("arena"), canvas: byId("fight"),
  //JT-2026/11/21 - connect the arena location label
  arenaLocation: byId("arena-location"),
  playerHealth: byId("player-health"), enemyHealth: byId("enemy-health"),
  //JT-2026/11/19 - connect the super meter and its ready readout
  playerSuper: byId("player-super"), superReadout: byId("super-readout"),
  playerPlate: byId("player-plate"), enemyPlate: byId("enemy-plate"),
  counter: byId("stage-counter"), seconds: byId("seconds"), cleared: byId("cleared"),
  roster: byId("roster"), status: byId("status"), announcement: byId("announcement"),
  //JT-2026/11/23 - connect the arena gallery to the campaign setup
  arenaGallery: byId("arena-gallery"),
  panel: byId("panel-wrap"), kicker: byId("panel-kicker"), title: byId("panel-title"),
  copy: byId("panel-copy"), action: byId("primary-action"), hint: byId("panel-hint"),
  sound: byId("sound"), soundLabel: byId("sound-label"), pause: byId("pause"),
  pauseLabel: byId("pause-label"), touch: byId("touch-controls"),
};
const context = ui.canvas.getContext("2d");
const view = { width: 0, height: 0, world: 1000, scale: 1, floor: 0, plates: [0, 0] };
const game = {
  level: 0, mode: "menu", seconds: ROUND_SECONDS, cleared: 0, age: 0, phase: 0,
  player: null, enemy: null, decision: 0, enemyGuard: 0, effects: [],
};
const held = new Map();
const pressed = new Set();
const atlases = new Map();
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
//JT-2026/11/22 - retain prepared clips and track playing audio for mute and pause
const soundRecordings = new Map();
const activeSoundNodes = new Set();
let soundContext;
let previousTime = 0;

makeRoster();
//JT-2026/11/23 - show the arena gallery alongside the opponent ladder
makeArenaPreviews();
resetRound();
resizeArena();
new ResizeObserver(resizeArena).observe(ui.arena);
setMode("menu");
requestAnimationFrame(frame);
loadMatch().catch(showAssetError);

//JT-2026/11/19 - wire keyboard, touch, pause, and sound controls
ui.action.addEventListener("click", activate);
ui.pause.addEventListener("click", togglePause);
ui.sound.addEventListener("click", toggleSound);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", event => {
  if (KEYS[event.code]) held.delete(event.code);
});
window.addEventListener("blur", clearInputs);
document.addEventListener("visibilitychange", () => {
  // if (document.hidden && canFight()) togglePause();
  //JT-2026/11/22 - stop recorded effects when a background tab is showing a result
  if (!document.hidden) return;
  //JT-2026/11/24 - silence the active cast when the tab is hidden
  pauseAlmightyPushVoice(game.player?.attack);
  if (canFight()) togglePause();
  else stopGameSounds();
});
ui.touch.querySelectorAll("button").forEach(button => {
  const release = event => {
    held.delete(event.pointerId);
    button.classList.remove("is-held");
  };
  button.addEventListener("pointerdown", event => {
    if (event.button !== 0 || game.mode !== "fight") return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.classList.add("is-held");
    hold(event.pointerId, button.dataset.input);
  });
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
});

//JT-2026/11/19 - normalize sprite ids for the fighter nameplates
function fighterName(id, separator = " ") {
  // return id.replace(/_0$/, "").replaceAll("_", separator);
  //JT-2026/11/19 - use the opponent's display name when provided
  const name = OPPONENTS.find(opponent => opponent.id === id)?.displayName ?? id.replace(/_0$/, "");
  return name.replaceAll("_", separator);
}

//JT-2026/11/19 - format levels consistently across the arena and ladder
function levelNumber(number) {
  return String(number).padStart(2, "0");
}

//JT-2026/11/19 - list every opponent in campaign order
function makeRoster() {
  OPPONENTS.forEach(({ id }, index) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    const name = document.createElement("span");
    number.className = "level-number";
    number.textContent = levelNumber(index + 1);
    name.className = "roster-name";
    name.textContent = fighterName(id);
    // item.append(number, name);
    //JT-2026/11/22 - show a lightweight portrait and reserve a cue for the next fight
    const preview = document.createElement("img");
    preview.className = "roster-preview";
    preview.alt = "";
    preview.loading = "lazy";
    preview.decoding = "async";
    preview.width = 192;
    preview.height = 128;
    preview.src = `assets/arcade/previews/${id}.png`;
    const next = document.createElement("span");
    next.className = "roster-next";
    next.textContent = "Next";
    item.append(number, preview, name, next);
    ui.roster.append(item);
  });
}

//JT-2026/11/19 - spawn each fighter inside its arena margins
function makeFighter(profile, x, direction) {
  const edge = profile.edge ?? 35;
  return {
    profile, edge, x: clamp(x, edge, view.world - edge), direction,
    // y: 0, velocity: 0, knockback: 0, health: 100,
    //JT-2026/11/19 - start each fighter at their own maximum health
    y: 0, velocity: 0, knockback: 0, health: profile.maxHealth,
    stun: 0, guard: false, moving: false, attack: null, down: 0,
  };
}

//JT-2026/11/19 - reset the round and update the opponent nameplate
function resetRound() {
  //JT-2026/11/24 - clear any voice still attached to the previous round
  pauseAlmightyPushVoice(game.player?.attack);
  //JT-2026/11/22 - stop any result sounds before the next round
  stopGameSounds();
  // game.player = makeFighter(HERO, view.world * .225, 1);
  // game.enemy = makeFighter(OPPONENTS[game.level], view.world * .775, -1);
  //JT-2026/11/23 - start juan on the right facing the opponent on the left
  game.player = makeFighter(HERO, view.world * .775, -1);
  game.enemy = makeFighter(OPPONENTS[game.level], view.world * .225, 1);
  //JT-2026/11/23 - start each round outside the aura charge pose
  game.player.auraTime = 0;
  //JT-2026/11/22 - select and label the opponent's arena each round
  const backdrop = game.enemy.profile.backdrop ?? "tondo";
  ui.arena.dataset.backdrop = backdrop;
  ui.arenaLocation.textContent = ARENA_LOCATIONS[backdrop];
  game.seconds = ROUND_SECONDS;
  game.decision = .5;
  game.enemyGuard = 0;
  game.effects = [];
  //JT-2026/11/19 - clear the fireball before starting another round
  // game.projectile = null;
  //JT-2026/11/19 - start each round without any active energy waves
  game.projectiles = [];
  game.winner = null;
  clearInputs();
  ui.counter.textContent = `LEVEL ${levelNumber(game.level + 1)} / ${levelNumber(OPPONENTS.length)}`;
  ui.enemyPlate.textContent = fighterName(game.enemy.profile.id, "_");
  view.plates = [ui.playerPlate.offsetWidth, ui.enemyPlate.offsetWidth];
  // setHealth(ui.playerHealth, 100);
  // setHealth(ui.enemyHealth, 100);
  //JT-2026/11/19 - reset both health bars and start each round with an empty super bar
  setHealth(ui.playerHealth, game.player);
  setHealth(ui.enemyHealth, game.enemy);
  setSuperCharge(0);
  showTimer();
  showProgress();
}

//JT-2026/11/19 - keep canvas scale and fighter positions aligned after resizing
function resizeArena() {
  const { width, height } = ui.arena.getBoundingClientRect();
  if (width < 1 || height < 1) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const world = clamp(Math.round(width / height * 458), 520, 1120);
  const positionScale = world / view.world;
  for (const fighter of [game.player, game.enemy]) {
    fighter.x = clamp(fighter.x * positionScale, fighter.edge, world - fighter.edge);
  }
  game.effects.forEach(effect => { effect.x *= positionScale; });
  //JT-2026/11/19 - keep a fireball aligned with the resized arena
  // if (game.projectile) game.projectile.x *= positionScale;
  //JT-2026/11/19 - keep every active energy wave aligned after resizing
  game.projectiles.forEach(shot => { shot.x *= positionScale; });
  view.world = world;
  view.width = width;
  view.height = height;
  view.scale = width / world;
  view.floor = height * .875;
  view.plates = [ui.playerPlate.offsetWidth, ui.enemyPlate.offsetWidth];
  ui.canvas.width = Math.round(width * dpr);
  ui.canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  separateFighters();
  paint();
}

//JT-2026/11/19 - load only the current fighter atlases and prefetch the next opponent
function atlasFor(id) {
  if (!atlases.has(id)) {
    const img = new Image();
    const ready = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => {
        atlases.delete(id);
        reject(new Error(`Could not load ${fighterName(id)}.`));
      };
    });
    atlases.set(id, { img, ready });
    img.src = `assets/arcade/${id}.png`;
  }
  return atlases.get(id);
}

//JT-2026/11/19 - hold the start action until the current fighters are available
async function loadMatch() {
  const next = OPPONENTS[game.level + 1];
  // const ids = [HERO.id, game.enemy.profile.id];
  //JT-2026/11/23 - keep both hero sprite sheets ready throughout the campaign
  // const ids = [HERO.id, HERO_ACTIONS.id, game.enemy.profile.id];
  //JT-2026/11/24 - keep the almighty push atlas loaded alongside juan's other poses
  const ids = [HERO.id, HERO_ACTIONS.id, ALMIGHTY_PUSH.id, game.enemy.profile.id];
  for (const id of atlases.keys()) {
    if (!ids.includes(id) && id !== next?.id) atlases.delete(id);
  }
  await Promise.all(ids.map(id => atlasFor(id).ready));
  if (game.mode === "menu") ui.action.disabled = false;
  if (next) atlasFor(next.id).ready.catch(() => {});
}

//JT-2026/11/19 - let the player retry an interrupted sprite load
function showAssetError(error) {
  setMode("error");
  showPanel("ASSET LOAD FAILED", "Try again", error.message, "Reload fighters");
}

//JT-2026/11/19 - dispatch the primary action for each campaign screen
function activate() {
  if (game.mode === "paused") {
    togglePause();
  } else if (game.mode === "won") {
    game.level++;
    startRound();
  } else if (game.mode === "complete") {
    game.level = 0;
    game.cleared = 0;
    startRound();
  } else if (["menu", "lost", "error"].includes(game.mode)) {
    startRound();
  }
}

//JT-2026/11/19 - begin the selected matchup after its artwork loads
async function startRound() {
  //JT-2026/11/22 - unlock sound while the start action still counts as a player gesture
  enableGameSounds();
  const from = game.mode;
  resetRound();
  setMode("loading");
  if (document.activeElement === ui.action) ui.action.blur();
  showPanel("LEVEL " + levelNumber(game.level + 1), "Get ready", `Loading ${fighterName(game.enemy.profile.id)}…`);
  try {
    await loadMatch();
    game.phase = from === "menu" ? 1.15 : 1.4;
    announce(`Level ${game.level + 1}. ${fighterName(game.enemy.profile.id)}.`);
    setMode("ready");
  } catch (error) {
    showAssetError(error);
  }
}

//JT-2026/11/19 - synchronize menus and pause controls with the match state
function setMode(mode) {
  game.mode = mode;
  //JT-2026/11/22 - play music only during combat and stop audio on pause
  // if (mode === "paused") stopGameSounds();
  // if (mode === "fight") startFightMusic();
  //JT-2026/11/24 - pause and resume the cast voice with the fight
  if (mode === "paused") {
    stopGameSounds();
    pauseAlmightyPushVoice(game.player.attack);
  }
  if (mode === "fight") {
    startFightMusic();
    if (ui.sound.getAttribute("aria-pressed") === "true") resumeAlmightyPushVoice(game.player.attack);
  }
  ui.arena.dataset.mode = mode;
  ui.panel.hidden = ["ready", "fight", "round-end"].includes(mode);
  if (mode !== "ready" && mode !== "fight" && mode !== "round-end") ui.announcement.textContent = "";
  ui.pause.disabled = !canFight() && mode !== "paused";
  ui.pauseLabel.textContent = mode === "paused" ? "Resume" : "Pause";
}

//JT-2026/11/19 - render the current menu or round outcome
function showPanel(kicker, title, copy, action) {
  ui.kicker.textContent = kicker;
  ui.title.textContent = title;
  ui.copy.textContent = copy;
  ui.action.hidden = !action;
  ui.hint.hidden = !action;
  ui.action.textContent = action || "";
  ui.action.disabled = !action;
}

//JT-2026/11/19 - suspend and resume the active countdown or fight
function togglePause() {
  if (game.mode === "paused") {
    setMode(game.resumeMode);
    announce("Resumed.");
  } else if (canFight()) {
    game.resumeMode = game.mode;
    clearInputs();
    setMode("paused");
    showPanel("LEVEL " + levelNumber(game.level + 1), "Paused", `${levelNumber(Math.ceil(game.seconds))} seconds on the clock.`, "Resume fight");
    announce("Paused.");
  }
}

//JT-2026/11/19 - identify the match phases that can be paused
function canFight() {
  return game.mode === "ready" || game.mode === "fight";
}

//JT-2026/11/19 - announce match transitions for assistive technology
function announce(message) {
  ui.status.textContent = message;
}

//JT-2026/11/19 - handle keyboard actions and menu shortcuts
function keyDown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.code === "Escape" && !event.repeat) togglePause();
  // if (event.code === "Enter" && !ui.panel.hidden && !ui.action.disabled && !event.repeat && event.target !== ui.sound) {
  //JT-2026/11/23 - let enter follow the mode select link when it has focus
  if (event.code === "Enter" && !ui.panel.hidden && !ui.action.disabled && !event.repeat && event.target !== ui.sound && !event.target?.closest?.("a")) {
    event.preventDefault();
    activate();
    return;
  }
  const input = KEYS[event.code];
  if (!input || !canFight()) return;
  event.preventDefault();
  if (!event.repeat) hold(event.code, input);
}

//JT-2026/11/19 - record input edges and held directions from each input device
function hold(source, input) {
  if (!hasInput(input)) pressed.add(input);
  held.set(source, input);
}

//JT-2026/11/19 - check if any current control holds an action
function hasInput(input) {
  return [...held.values()].includes(input);
}

//JT-2026/11/19 - release held controls when input focus or a match ends
function clearInputs() {
  held.clear();
  pressed.clear();
  ui.touch.querySelectorAll(".is-held").forEach(button => button.classList.remove("is-held"));
}

//JT-2026/11/19 - step the simulation and keep the canvas in sync with the match
function frame(now) {
  const dt = previousTime ? Math.min((now - previousTime) / 1000, .035) : 0;
  previousTime = now;
  if (game.mode !== "paused") {
    game.age += dt;
    tick(dt);
    paint();
  }
  requestAnimationFrame(frame);
}

//JT-2026/11/19 - advance the countdown, fight timer, and result transition
function tick(dt) {
  if (game.mode === "ready") {
    game.phase -= dt;
    ui.announcement.textContent = game.phase > .43 ? "READY?" : "FIGHT!";
    if (game.phase <= 0) {
      setMode("fight");
      game.phase = .37;
      tone("start");
    }
  } else if (game.mode === "fight") {
    game.phase -= dt;
    if (game.phase <= 0 && ui.announcement.textContent) ui.announcement.textContent = "";
    updateFight(dt);
  } else if (game.mode === "round-end") {
    game.phase -= dt;
    //JT-2026/11/24 - finish the cast and its voice before the result screen
    if (game.player.attack?.kind === "almightyPush") {
      advanceAlmightyPush(game.player.attack, dt);
      if (game.player.attack.elapsed >= ALMIGHTY_PUSH.duration) game.player.attack = null;
    }
    if (game.player.down) game.player.down += dt;
    if (game.enemy.down) game.enemy.down += dt;
    updateEffects(dt);
    // if (game.phase <= 0) showResult();
    //JT-2026/11/24 - let the recovery finish when sound playback takes longer than the result delay
    if (game.phase <= 0 && game.player.attack?.kind !== "almightyPush") showResult();
  }
}

//JT-2026/11/19 - resolve movement and simultaneous hits before judging the round
function updateFight(dt) {
  const { player, enemy } = game;
  game.seconds = Math.max(0, game.seconds - dt);
  showTimer();
  const playerMove = Number(hasInput("right")) - Number(hasInput("left"));
  // player.guard = !player.attack && !player.stun && !player.y && hasInput("guard");
  // if (canAct(player)) {
  //   if (pressed.has("jump") && !player.y && !player.velocity) player.velocity = 473;
  //   if (pressed.has("heavy")) attack(player, "heavy");
  //   else if (pressed.has("light")) attack(player, "light");
  // }
  //JT-2026/11/19 - start specials from the ground and let retreating juan keep moving
  player.guard = false;
  if (canAct(player)) {
    const grounded = !player.y && !player.velocity;
    // if (grounded && pressed.has("shoryuken")) {
    //   attack(player, "shoryuken");
    // } else if (grounded && !game.projectile && pressed.has("hadouken")) {
    //   attack(player, "hadouken");
    // }
    //JT-2026/11/19 - require a full super bar before starting either special
    // const superReady = grounded && game.superCharge === SUPER_MAX;
    //JT-2026/11/19 - let either special start with one charged bar
    const superReady = grounded && game.superCharge >= SUPER_COST;
    // if (superReady && pressed.has("superUpperCut")) {
    //JT-2026/11/24 - prioritize almighty push once two bars are full
    if (grounded && pressed.has("almightyPush") && game.superCharge >= ALMIGHTY_PUSH.bars * SUPER_COST) {
      attack(player, "almightyPush");
    } else if (superReady && pressed.has("superUpperCut")) {
      attack(player, "superUpperCut");
    // } else if (superReady && !game.projectile && pressed.has("energyWave")) {
    //JT-2026/11/19 - let a charged energy wave start while another is in flight
    } else if (superReady && pressed.has("energyWave")) {
      attack(player, "energyWave");
    } else {
      if (grounded && pressed.has("jump")) player.velocity = 473;
      if (pressed.has("heavy")) attack(player, "heavy");
      else if (pressed.has("light")) attack(player, "light");
    }
  }
  pressed.clear();
  const enemyMove = chooseEnemyMove(dt);

  /*
  //JT-2026/11/19 - activate guard only when juan actually travels away from the opponent
  const playerStart = player.x;
  const retreating = (enemy.x - playerStart) * playerMove < 0;
  moveFighter(player, enemy, playerMove, dt);
  const steppedBack = retreating && player.moving && (player.x - playerStart) * playerMove > 0;
  moveFighter(enemy, player, enemyMove, dt);
  separateFighters();
  player.guard = steppedBack && (player.x - playerStart) * playerMove > 0 && (enemy.x - player.x) * playerMove < 0;
  */
  //JT-2026/11/19 - guard on back input even when juan cannot move past the wall
  const playerStart = player.x;
  moveFighter(player, enemy, playerMove, dt);
  player.moving = player.moving && player.x !== playerStart;
  moveFighter(enemy, player, enemyMove, dt);
  separateFighters();
  player.guard = !player.attack && (enemy.x - player.x) * playerMove < 0;

  const playerHit = hitFrom(player, enemy, dt);
  const enemyHit = hitFrom(enemy, player, dt);
  if (playerHit) applyHit(enemy, player, playerHit, ui.enemyHealth);
  if (enemyHit) applyHit(player, enemy, enemyHit, ui.playerHealth);
  //JT-2026/11/19 - resolve the fireball before judging the round
  // advanceProjectile(dt);
  //JT-2026/11/19 - resolve each active energy wave before judging the round
  game.projectiles = game.projectiles.filter(shot => advanceProjectile(shot, dt));
  updateEffects(dt);

  // if (!player.health || !enemy.health || game.seconds <= 0) finishRound();
  //JT-2026/11/23 - only charge after active round hits and movement resolve
  if (!player.health || !enemy.health || game.seconds <= 0) finishRound();
  else updateAuraCharge(playerMove, dt);
}

//JT-2026/11/19 - choose movement, guards, and attacks for the current opponent
function chooseEnemyMove(dt) {
  const { enemy, player } = game;
  const profile = enemy.profile;
  game.decision -= dt;
  game.enemyGuard = Math.max(0, game.enemyGuard - dt);
  enemy.guard = game.enemyGuard > 0 && !enemy.stun && !enemy.attack;
  if (!canAct(enemy)) return 0;
  const distance = Math.abs(player.x - enemy.x);
  const direction = Math.sign(player.x - enemy.x) || enemy.direction;

  if (game.decision <= 0 && distance < profile.reach + 10) {
    game.decision = profile.interval * (.72 + Math.random() * .6);
    if (Math.random() < profile.guard) {
      game.enemyGuard = .33 + Math.random() * .27;
      enemy.guard = true;
      return 0;
    }
    attack(enemy, Math.random() < profile.heavy ? "heavy" : "light");
    return 0;
  }
  return distance > Math.max(profile.reach - 13, player.profile.body + profile.body + 4) ? direction : 0;
}

//JT-2026/11/19 - check whether a fighter can start an attack or enter a guard
function canAct(fighter) {
  return !fighter.attack && !fighter.stun && !fighter.guard;
}

//JT-2026/11/19 - start a punch or kick with the fighter's reach and timing
function attack(fighter, kind) {
  const move = MOVES[kind];
  const isPlayer = fighter === game.player;
  const heavy = kind === "heavy";
  const reach = isPlayer
    ? move.reach + Math.max(0, game.enemy.profile.body - 40)
    : fighter.profile.reach + (heavy ? 28 : 0);
  fighter.attack = {
    ...move, kind, elapsed: 0, spent: false,
    duration: isPlayer ? move.duration : move.duration + .11,
    impact: isPlayer ? move.impact : move.impact + .08,
    reach,
    damage: isPlayer ? move.damage : fighter.profile.power + (heavy ? 5 : 0),
  };
  //JT-2026/11/19 - spend the full super bar when juan starts a special
  // if (isPlayer && (kind === "energyWave" || kind === "superUpperCut")) setSuperCharge(0);
  //JT-2026/11/19 - spend one bar and keep the rest of juan's charge
  /*
  if (isPlayer && (kind === "energyWave" || kind === "superUpperCut")) {
    setSuperCharge(game.superCharge - SUPER_COST);
  }
  if (isPlayer) tone(heavy ? "swing" : "jab");
  */
  //JT-2026/11/23 - play the matching sound when juan spends a bar on a special
  // if (isPlayer && (kind === "energyWave" || kind === "superUpperCut")) {
  //JT-2026/11/24 - empty the meter and start the full voice at the beginning of the cast
  if (isPlayer && kind === "almightyPush") {
    setSuperCharge(0);
    if (ui.sound.getAttribute("aria-pressed") === "true") resumeAlmightyPushVoice(fighter.attack);
  } else if (isPlayer && (kind === "energyWave" || kind === "superUpperCut")) {
    setSuperCharge(game.superCharge - SUPER_COST);
    playRecordedSound(kind, "jab");
  } else if (isPlayer) {
    tone(heavy ? "swing" : "jab");
  }
}

//JT-2026/11/19 - apply movement, jump gravity, and hit recoil to one fighter
function moveFighter(fighter, target, direction, dt) {
  fighter.stun = Math.max(0, fighter.stun - dt);
  const mobile = canAct(fighter);
  if (!fighter.attack && !fighter.stun) fighter.direction = Math.sign(target.x - fighter.x) || fighter.direction;
  const speed = mobile ? direction * fighter.profile.speed : 0;
  if (fighter.y || fighter.velocity) {
    fighter.y = Math.max(0, fighter.y + fighter.velocity * dt);
    fighter.velocity = fighter.y ? fighter.velocity - 1320 * dt : 0;
  }
  fighter.x = clamp(fighter.x + (speed + fighter.knockback) * dt, fighter.edge, view.world - fighter.edge);
  fighter.knockback *= Math.max(0, 1 - 10 * dt);
  fighter.moving = mobile && direction !== 0;
}

//JT-2026/11/19 - keep ground fighters from crossing or leaving the arena
function separateFighters() {
  const { player, enemy } = game;
  const [left, right] = player.x <= enemy.x ? [player, enemy] : [enemy, player];
  if (Math.abs(player.y - enemy.y) > 56) return;
  const gap = left.profile.body + right.profile.body;
  if (right.x - left.x >= gap) return;
  left.x = clamp((left.x + right.x - gap) / 2, left.edge, view.world - right.edge - gap);
  right.x = left.x + gap;
}

//JT-2026/11/19 - test each attack once at the end of its windup
function hitFrom(attacker, target, dt) {
  const action = attacker.attack;
  if (!action) return null;
  // action.elapsed += dt;
  //JT-2026/11/24 - time the knockout to the spoken push cue
  if (action.kind === "almightyPush") advanceAlmightyPush(action, dt);
  else action.elapsed += dt;
  if (action.elapsed >= action.duration) attacker.attack = null;
  if (action.spent || action.elapsed < action.impact) return null;
  action.spent = true;
  //JT-2026/11/24 - apply the knockout at the cast's impact regardless of distance or height
  if (action.kind === "almightyPush") return { ...action, damage: target.health };
  //JT-2026/11/24 - play the monster cue once at the strike frame
  if (attacker !== game.player) playRecordedSound(MONSTER_ATTACK_CUES[attacker.profile.id], "swing");
  //JT-2026/11/19 - release the fireball or launch juan when a special reaches its strike frame
  // if (action.kind === "hadouken") {
  //JT-2026/11/19 - release the projectile for energy wave
  if (action.kind === "energyWave") {
    // game.projectile = {
    //JT-2026/11/19 - add this energy wave to the active projectiles
    game.projectiles.push({
      x: attacker.x + (attacker.profile.body + 17) * attacker.direction,
      y: attacker.y,
      direction: attacker.direction,
      remaining: FIREBALL.lifetime,
      action,
    // };
    });
    tone("swing");
    return null;
  }
  // if (action.kind === "shoryuken") attacker.velocity = 406;
  //JT-2026/11/19 - start the rise for super upper cut
  if (action.kind === "superUpperCut") attacker.velocity = 406;

  const distance = (target.x - attacker.x) * attacker.direction;
  return distance >= 0 && distance <= action.reach && Math.abs(attacker.y - target.y) <= 59 ? action : null;
}

//JT-2026/11/19 - apply damage, hit stun, and guard feedback
function applyHit(target, attacker, action, meter) {
  //JT-2026/11/24 - keep the full-meter cast from being interrupted by a hit
  if (target === game.player && target.attack?.kind === "almightyPush") return;
  //JT-2026/11/19 - block all damage and recoil while juan is retreating
  if (target === game.player && target.guard) {
    sparks((target.x + attacker.x) / 2, 70 + Math.max(attacker.y, target.y), true);
    tone("guard");
    return;
  }
  // const blocked = target.guard && (attacker.x - target.x) * target.direction >= 0;
  //JT-2026/11/24 - let almighty push knock out even a guarding opponent
  const blocked = action.kind !== "almightyPush" && target.guard && (attacker.x - target.x) * target.direction >= 0;
  target.health = Math.max(0, target.health - (blocked ? Math.floor(action.damage * .21) : action.damage));
  target.stun = blocked ? .1 : action.stun;
  target.knockback = attacker.direction * action.push * (blocked ? .26 : 1);
  target.attack = null;
  // setHealth(meter, target.health);
  //JT-2026/11/19 - charge juan's meter only from unblocked punches and kicks
  setHealth(meter, target);
  const gain = SUPER_GAIN[action.kind];
  if (attacker === game.player && !blocked && gain) setSuperCharge(game.superCharge + gain);
  sparks((target.x + attacker.x) / 2, 70 + Math.max(attacker.y, target.y), blocked);
  // tone(blocked ? "guard" : "hit");
  //JT-2026/11/22 - play a recorded hit reaction or special impact
  if (blocked) {
    tone("guard");
  } else if (target.health > 0) {
    const special = action.kind === "energyWave" || action.kind === "superUpperCut";
    const cue = target === game.player ? "playerHurt" : special ? "superImpact" : "opponentHurt";
    playRecordedSound(cue, "hit");
  }
}

/*
//JT-2026/11/19 - expose health changes visually and through the meter value
function setHealth(meter, health) {
  meter.style.setProperty("--hp", health / 100);
  meter.setAttribute("aria-valuenow", health);
}
*/
//JT-2026/11/19 - scale each health bar to its fighter's maximum
function setHealth(meter, fighter) {
  meter.style.setProperty("--hp", fighter.health / fighter.profile.maxHealth);
  meter.setAttribute("aria-valuemax", fighter.profile.maxHealth);
  meter.setAttribute("aria-valuenow", fighter.health);
}

//JT-2026/11/19 - show the remaining time and highlight the final ten seconds
function showTimer() {
  const seconds = Math.ceil(game.seconds);
  const label = levelNumber(seconds);
  if (ui.seconds.textContent !== label) {
    ui.seconds.textContent = label;
    ui.seconds.classList.toggle("urgent", seconds <= 10);
  }
}

//JT-2026/11/19 - judge knockouts and timeouts by the fighters' remaining health
function finishRound() {
  const { player, enemy } = game;
  const knockout = !player.health || !enemy.health;
  //JT-2026/11/24 - retain the voice only when the push delivered the knockout
  const pushKnockout = !enemy.health && player.attack?.kind === "almightyPush" && player.attack.spent;
  if (player.attack?.kind === "almightyPush" && !pushKnockout) {
    pauseAlmightyPushVoice(player.attack);
    player.attack = null;
  }
  // game.winner = player.health > enemy.health ? "player" : player.health < enemy.health ? "enemy" : "draw";
  //JT-2026/11/19 - compare remaining health percentages when maximum health differs
  const healthDifference = player.health * enemy.profile.maxHealth - enemy.health * player.profile.maxHealth;
  game.winner = healthDifference > 0 ? "player" : healthDifference < 0 ? "enemy" : "draw";
  if (!player.health) player.down = .01;
  if (!enemy.health) enemy.down = .01;
  game.phase = .82;
  //JT-2026/11/19 - stop the fireball and retreat guard when the round ends
  // game.projectile = null;
  //JT-2026/11/19 - clear all energy waves when the round ends
  game.projectiles = [];
  player.guard = false;
  //JT-2026/11/23 - end the charge pose as soon as the round finishes
  player.auraTime = 0;
  clearInputs();
  setMode("round-end");
  ui.announcement.textContent = knockout ? "K.O.!" : "TIME!";
  // tone(knockout ? "ko" : "start");
  //JT-2026/11/22 - play the loss cue or the vehicle crash at the end of a round
  stopGameSounds();
  //JT-2026/11/24 - let the voice clip finish without competing knockout effects
  if (pushKnockout) return;
  const resultTone = knockout ? "ko" : "start";
  if (game.winner === "enemy") {
    playRecordedSound("defeat", resultTone);
  } else if (game.winner === "player" && knockout && VEHICLE_OPPONENTS.has(enemy.profile.id)) {
    playRecordedSound("vehicleCrash", resultTone);
  } else {
    tone(resultTone);
  }
}

//JT-2026/11/19 - offer the next level, a rematch, or a fresh campaign
function showResult() {
  const level = levelNumber(game.level + 1);
  const enemy = fighterName(game.enemy.profile.id);
  if (game.winner !== "player") {
    const draw = game.winner === "draw";
    setMode("lost");
    showPanel(`LEVEL ${level}`, draw ? "Draw" : "You lost", draw ? "The round ended in a tie." : `${enemy} took the round.`, "Retry level");
    announce(draw ? "Draw. Retry level." : "You lost. Retry level.");
    return;
  }
  game.cleared = game.level + 1;
  showProgress();
  if (game.cleared === OPPONENTS.length) {
    setMode("complete");
    // showPanel("9 / 9 CLEARED", "Tondo champion", "You defeated all nine challengers.", "Play again");
    // announce("Tondo champion. All nine levels cleared.");
    //JT-2026/11/19 - use the roster total in the campaign victory screen
    const total = OPPONENTS.length;
    showPanel(`${total} / ${total} CLEARED`, "Tondo champion", `You defeated all ${total} challengers.`, "Play again");
    announce(`Tondo champion. All ${total} levels cleared.`);
  } else {
    setMode("won");
    const next = fighterName(OPPONENTS[game.level + 1].id);
    showPanel(`LEVEL ${level} CLEAR`, "You win", `Up next: ${next}`, "Next level");
    announce(`You won. Next opponent: ${next}.`);
  }
}

//JT-2026/11/19 - mark the active level and record cleared opponents on the ladder
function showProgress() {
  ui.cleared.textContent = `${game.cleared} / ${OPPONENTS.length} CLEARED`;
  [...ui.roster.children].forEach((item, index) => {
    if (index === game.level) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
    item.classList.toggle("is-cleared", index < game.cleared);
    //JT-2026/11/22 - highlight the next opponent as players clear the ladder
    item.classList.toggle("is-next", index === game.level + 1);
    item.firstElementChild.textContent = index < game.cleared ? "✓" : levelNumber(index + 1);
  });
}

//JT-2026/11/19 - draw both fighters, floor shadows, and impact effects
function paint() {
  const { player, enemy } = game;
  context.clearRect(0, 0, view.width, view.height);
  const fighters = player.x <= enemy.x ? [player, enemy] : [enemy, player];
  fighters.forEach(drawShadow);
  fighters.forEach(drawFighter);
  //JT-2026/11/19 - draw the active fireball with the street arena
  // if (game.projectile) drawProjectile(game.projectile);
  //JT-2026/11/19 - draw each energy wave still in flight
  game.projectiles.forEach(drawProjectile);
  for (const effect of game.effects) drawSpark(effect);
  placeNameplates();
}

//JT-2026/11/19 - anchor a fighter's shadow to the street while airborne
function drawShadow(fighter) {
  const { scale, floor } = view;
  context.globalAlpha = .46 - Math.min(.3, fighter.y / 270);
  context.fillStyle = "#120d09";
  context.beginPath();
  context.ellipse(fighter.x * scale, floor + 2, fighter.profile.body * 1.08 * scale, 5.7 * scale, 0, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

//JT-2026/11/19 - select the pose from each fighter's transparent sprite atlas
function drawFighter(fighter) {
  // const img = atlases.get(fighter.profile.id)?.img;
  // if (!img?.complete || !img.naturalWidth) return;
  // const [row, column] = getPose(fighter);
  //JT-2026/11/23 - draw the selected pose from the appropriate sprite sheet
  const [row, column, atlasId = fighter.profile.id] = getPose(fighter);
  const img = atlases.get(atlasId)?.img;
  if (!img?.complete || !img.naturalWidth) return;
  // const size = view.scale * fighter.profile.size / FRAME.scale;
  //JT-2026/11/19 - draw juan from his expanded atlas without shifting his ground position
  // const frame = fighter === game.player ? HERO_FRAME : FRAME;
  //JT-2026/11/23 - use the alternate sheet's cell size for the new hero poses
  let frame = fighter === game.player ? HERO_FRAME : FRAME;
  if (atlasId === HERO_ACTIONS.id) frame = HERO_ACTIONS.frame;
  //JT-2026/11/24 - use the almighty push frame with its centered pivot
  if (atlasId === ALMIGHTY_PUSH.id) frame = ALMIGHTY_PUSH.frame;
  const size = view.scale * fighter.profile.size / frame.scale;
  context.save();
  const x = Math.round(fighter.x * view.scale);
  const y = Math.round(view.floor - fighter.y * view.scale);
  // context.translate(x, y);
  //JT-2026/11/24 - show the delayed landing without moving juan's ground position
  const lift = atlasId === ALMIGHTY_PUSH.id ? almightyPushLift(fighter.attack.elapsed) * size : 0;
  context.translate(x, y - lift);
  context.scale(fighter.direction, 1);
  context.imageSmoothingEnabled = true;
  if (fighter.guard && !fighter.down) context.filter = "brightness(1.14)";
  // context.drawImage(img, column * FRAME.width, row * FRAME.height, FRAME.width, FRAME.height,
  //   -FRAME.x * size, -FRAME.y * size, FRAME.width * size, FRAME.height * size);
  //JT-2026/11/19 - sample each fighter using its atlas frame dimensions
  context.drawImage(img, column * frame.width, row * frame.height, frame.width, frame.height,
    -frame.x * size, -frame.y * size, frame.width * size, frame.height * size);
  context.restore();
}

//JT-2026/11/19 - select sprite frames from a fighter's current action
function getPose(fighter) {
  const hero = fighter === game.player;
  if (fighter.down) return [POSE.down, Math.min(3, Math.floor(fighter.down * 6))];
  if (fighter.stun && !fighter.guard) return [POSE.hurt, Math.min(2, Math.floor((.35 - fighter.stun) * 11))];
  if (fighter.attack) {
    const { elapsed, impact, duration, kind } = fighter.attack;
    //JT-2026/11/24 - animate almighty push from juan's third sprite sheet
    if (hero && kind === "almightyPush") return [...almightyPushPose(elapsed), ALMIGHTY_PUSH.id];
    //JT-2026/11/23 - sync the nine frame punch sequence with the existing hit timing
    if (hero && kind === "light") {
      const column = elapsed < impact
        ? Math.floor(4 * elapsed / impact)
        : Math.min(8, 4 + Math.floor(5 * (elapsed - impact) / (duration - impact)));
      return [HERO_ACTIONS.punch, column, HERO_ACTIONS.id];
    }
    const column = elapsed < impact * .63 ? 0 : elapsed < impact ? 1 : elapsed < (impact + duration) / 2 ? 2 : 3;
    // The final gasoline frame contains the flame, so show it on impact.
    return [POSE[kind], fighter.profile.id === "gasoline_0" && column >= 2 ? 3 : column];
  }
  //JT-2026/11/23 - build the aura before looping its two peak poses
  if (hero && fighter.auraTime > 0) {
    const step = Math.floor(fighter.auraTime * 10);
    return [HERO_ACTIONS.charge, step < 5 ? step : 5 + (step - 5) % 2, HERO_ACTIONS.id];
  }
  // if (fighter.guard) return [hero ? POSE.guard : POSE.hurt, 0];
  //JT-2026/11/19 - keep the opponent guard pose and let juan animate his retreat
  if (!hero && fighter.guard) return [POSE.hurt, 0];
  if (hero && (fighter.y || fighter.velocity)) {
    return [POSE.jump, fighter.velocity > 160 ? 1 : fighter.velocity > -155 ? 2 : 3];
  }
  //JT-2026/11/19 - show juan's raised hands when guarding in place
  if (hero && fighter.guard && !fighter.moving) return [POSE.idle, 0];
  // if (fighter.moving) return [POSE.move, Math.floor(game.age * 11) % 4];
  //JT-2026/11/19 - play juan's walk frames in reverse when he backs away
  if (fighter.moving) {
    const column = Math.floor(game.age * 11) % 4;
    return [POSE.move, hero && fighter.guard ? 3 - column : column];
  }
  return [POSE.idle, reduceMotion.matches ? 0 : Math.floor(game.age * 3.7) % 4];
}

//JT-2026/11/19 - keep nameplates below their fighters and readable at close range
function placeNameplates() {
  const { width, scale } = view;
  const { player, enemy } = game;
  const reversed = player.x > enemy.x;
  const [left, right] = reversed ? [enemy, player] : [player, enemy];
  const [leftWidth, rightWidth] = reversed ? [view.plates[1], view.plates[0]] : view.plates;
  const gap = (leftWidth + rightWidth) / 2 + 6;
  let leftX = clamp(left.x * scale, leftWidth / 2 + 3, width - leftWidth / 2 - 3);
  let rightX = clamp(right.x * scale, rightWidth / 2 + 3, width - rightWidth / 2 - 3);
  if (rightX - leftX < gap) {
    leftX = clamp((leftX + rightX - gap) / 2, leftWidth / 2 + 3, width - rightWidth / 2 - 3 - gap);
    rightX = leftX + gap;
  }
  ui.playerPlate.style.setProperty("--position", `${reversed ? rightX : leftX}px`);
  ui.enemyPlate.style.setProperty("--position", `${reversed ? leftX : rightX}px`);
}

//JT-2026/11/19 - create short-lived sparks to distinguish a hit from a guard
function sparks(x, y, blocked) {
  const color = blocked ? "#a8e7ee" : "#ffdc72";
  const count = reduceMotion.matches ? 3 : 12;
  for (let index = 0; index < count; index++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 55 + Math.random() * 260;
    game.effects.push({ x, y, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed, life: .24, color });
  }
}

//JT-2026/11/19 - move and expire the current match effects
function updateEffects(dt) {
  game.effects = game.effects.filter(effect => {
    effect.life -= dt;
    effect.x += effect.dx * dt;
    effect.y += effect.dy * dt;
    return effect.life > 0;
  });
}

//JT-2026/11/19 - draw one scaled impact spark
function drawSpark(effect) {
  const { scale, floor } = view;
  const x = effect.x * scale;
  const y = floor - effect.y * scale;
  context.globalAlpha = effect.life / .24;
  context.strokeStyle = effect.color;
  context.lineWidth = 2.6 * scale;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + effect.dx * .053 * scale, y - effect.dy * .053 * scale);
  context.stroke();
  context.globalAlpha = 1;
}

/*
//JT-2026/11/19 - enable or mute synthesized arcade effects
function toggleSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) {
    ui.sound.disabled = true;
    return;
  }
  const enabled = ui.sound.getAttribute("aria-pressed") !== "true";
  ui.sound.setAttribute("aria-pressed", enabled);
  ui.soundLabel.textContent = enabled ? "Sound on" : "Sound off";
  if (enabled) {
    soundContext ??= new Audio();
    soundContext.resume().catch(() => {});
    tone("start");
  }
}
*/
//JT-2026/11/22 - let players mute or restore both music and fight effects
function toggleSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext && !window.Audio) {
    ui.sound.disabled = true;
    return;
  }
  const enabled = ui.sound.getAttribute("aria-pressed") !== "true";
  ui.sound.setAttribute("aria-pressed", enabled);
  ui.soundLabel.textContent = enabled ? "Sound on" : "Sound off";
  // if (enabled) enableGameSounds(true);
  // else stopGameSounds();
  //JT-2026/11/24 - let players mute or rejoin the voice without resetting the cast
  if (enabled) {
    enableGameSounds(true);
    if (game.mode === "fight" || game.mode === "round-end") resumeAlmightyPushVoice(game.player.attack);
  } else {
    stopGameSounds();
    pauseAlmightyPushVoice(game.player.attack);
  }
}

//JT-2026/11/19 - synthesize lightweight fight cues with browser audio
function tone(kind) {
  // if (!soundContext || ui.sound.getAttribute("aria-pressed") !== "true") return;
  //JT-2026/11/22 - avoid queueing tones in a background or suspended tab
  if (soundContext?.state !== "running" || document.hidden || ui.sound.getAttribute("aria-pressed") !== "true") return;
  const cue = {
    start: [420, 720, .16, "triangle"], jab: [175, 77, .07, "triangle"],
    swing: [145, 45, .13, "triangle"], hit: [118, 43, .16, "square"],
    guard: [590, 250, .12, "triangle"], ko: [330, 48, .3, "sawtooth"],
  }[kind];
  const [high, low, duration, shape] = cue;
  const time = soundContext.currentTime;
  const oscillator = soundContext.createOscillator();
  const volume = soundContext.createGain();
  oscillator.type = shape;
  oscillator.frequency.setValueAtTime(high, time);
  oscillator.frequency.exponentialRampToValueAtTime(low, time + duration);
  volume.gain.setValueAtTime(.045, time);
  volume.gain.exponentialRampToValueAtTime(.001, time + duration);
  oscillator.connect(volume).connect(soundContext.destination);
  oscillator.start(time);
  oscillator.stop(time + duration);
  //JT-2026/11/22 - let mute and pause cut short an active tone
  trackSoundNode(oscillator);
}

//JT-2026/11/19 - constrain positions and timer values to their valid bounds
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

/*
//JT-2026/11/19 - move the fireball until it hits the opponent or leaves the arena
function advanceProjectile(dt) {
  const shot = game.projectile;
  if (!shot) return;
  shot.remaining -= dt;
  shot.x += shot.direction * FIREBALL.speed * dt;
  const enemy = game.enemy;
  const hitsEnemy = enemy.health > 0 && Math.abs(enemy.x - shot.x) <= enemy.profile.body + FIREBALL.radius
    && Math.abs(enemy.y - shot.y) <= FIREBALL.elevation - 10;
  if (hitsEnemy) {
    const source = { x: enemy.x - shot.direction * FIREBALL.radius, y: shot.y, direction: shot.direction };
    applyHit(enemy, source, shot.action, ui.enemyHealth);
    game.projectile = null;
  } else if (shot.remaining <= 0 || shot.x < -FIREBALL.radius || shot.x > view.world + FIREBALL.radius) {
    game.projectile = null;
  }
}
*/
//JT-2026/11/19 - advance one energy wave and report whether it is still active
function advanceProjectile(shot, dt) {
  shot.remaining -= dt;
  shot.x += shot.direction * FIREBALL.speed * dt;
  const enemy = game.enemy;
  const hitsEnemy = enemy.health > 0 && Math.abs(enemy.x - shot.x) <= enemy.profile.body + FIREBALL.radius
    && Math.abs(enemy.y - shot.y) <= FIREBALL.elevation - 10;
  if (hitsEnemy) {
    const source = { x: enemy.x - shot.direction * FIREBALL.radius, y: shot.y, direction: shot.direction };
    applyHit(enemy, source, shot.action, ui.enemyHealth);
    return false;
  }
  return shot.remaining > 0 && shot.x >= -FIREBALL.radius && shot.x <= view.world + FIREBALL.radius;
}

//JT-2026/11/19 - draw the supplied fireball sprite in its travel direction
function drawProjectile(shot) {
  const img = atlases.get(HERO.id)?.img;
  if (!img?.complete || !img.naturalWidth) return;
  const { width, height, x, scale } = HERO_FRAME;
  const size = view.scale * FIREBALL.scale / scale;
  context.save();
  context.translate(shot.x * view.scale, view.floor - (shot.y + FIREBALL.elevation) * view.scale);
  context.scale(shot.direction, 1);
  context.drawImage(img, 0, FIREBALL.row * height, width, height,
    -x * size, -height * size / 2, width * size, height * size);
  context.restore();
}

/*
//JT-2026/11/19 - update the visible and accessible super charge together
function setSuperCharge(charge) {
  game.superCharge = clamp(charge, 0, SUPER_MAX);
  const ready = game.superCharge === SUPER_MAX;
  ui.playerSuper.style.setProperty("--super", game.superCharge / SUPER_MAX);
  ui.playerSuper.setAttribute("aria-valuenow", game.superCharge);
  ui.playerSuper.setAttribute("aria-valuetext", ready ? "Ready" : `${game.superCharge}%`);
  ui.superReadout.textContent = ready ? "READY" : `${game.superCharge}%`;
}
*/
//JT-2026/11/19 - show charge across all three segments and count available casts
function setSuperCharge(charge) {
  game.superCharge = clamp(charge, 0, SUPER_MAX);
  const filledBars = Math.floor(game.superCharge / SUPER_COST);
  ui.playerSuper.style.setProperty("--super", game.superCharge / SUPER_COST);
  ui.playerSuper.setAttribute("aria-valuenow", game.superCharge);
  ui.playerSuper.setAttribute("aria-valuetext", `${filledBars} of ${SUPER_BARS} bars ready`);
  ui.superReadout.textContent = `${filledBars}/${SUPER_BARS}`;
}

//JT-2026/11/22 - preload effects and music after sound is enabled
function prepareSoundEffects() {
  for (const [name, effect] of Object.entries(GAME_AUDIO)) {
    if (soundRecordings.has(name)) continue;
    const recording = { ...effect };
    const url = `assets/${effect.file}`;
    soundRecordings.set(name, recording);
    if (soundContext && window.location.protocol !== "file:") {
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error(`Could not load ${effect.file}.`);
          return response.arrayBuffer();
        })
        .then(bytes => soundContext.decodeAudioData(bytes))
        .then(buffer => {
          recording.buffer = buffer;
          if (recording.loop) startFightMusic();
        })
        .catch(() => { soundRecordings.delete(name); });
    } else if (window.Audio) {
      const clip = new window.Audio(url);
      clip.volume = effect.volume;
      clip.loop = Boolean(effect.loop);
      if (!clip.loop) {
        clip.addEventListener("timeupdate", () => {
          if (clip.currentTime >= effect.offset + effect.duration) clip.pause();
        });
      }
      recording.clip = clip;
    }
  }
}

//JT-2026/11/22 - play a recorded cue or the fight loop with an optional fallback
function playRecordedSound(name, fallback) {
  if (document.hidden || ui.sound.getAttribute("aria-pressed") !== "true") return;
  const recording = soundRecordings.get(name);
  if (recording?.buffer && soundContext.state === "running") {
    if (recording.source) return;
    const source = soundContext.createBufferSource();
    const gain = soundContext.createGain();
    source.buffer = recording.buffer;
    gain.gain.value = recording.volume;
    source.connect(gain).connect(soundContext.destination);
    if (recording.loop) {
      source.loop = true;
      source.start();
      recording.source = source;
    } else {
      source.start(0, recording.offset, recording.duration);
    }
    trackSoundNode(source);
    //JT-2026/11/23 - let an interrupted pray action stop its active recording
    if (recording.interruptible) recording.source = source;
  } else if (recording?.clip && !recording.clip.error) {
    const { clip, offset } = recording;
    if (clip.loop && !clip.paused) return;
    clip.currentTime = offset ?? 0;
    clip.play().catch(error => {
      if (fallback && error.name !== "AbortError" && game.mode !== "paused") tone(fallback);
    });
  } else if (fallback) {
    tone(fallback);
  }
}

//JT-2026/11/22 - start the background loop when the fight and sound are active
function startFightMusic() {
  if (game.mode === "fight") playRecordedSound("fightMusic");
}

//JT-2026/11/22 - track a web audio source until its sound ends
function trackSoundNode(node) {
  activeSoundNodes.add(node);
  node.addEventListener("ended", () => activeSoundNodes.delete(node), { once: true });
}

//JT-2026/11/22 - stop active recordings and tones when sound should end
function stopGameSounds() {
  for (const node of activeSoundNodes) node.stop();
  activeSoundNodes.clear();
  for (const recording of soundRecordings.values()) {
    recording.source = null;
    recording.clip?.pause();
  }
}

//JT-2026/11/22 - prepare sound on start or unmute without bypassing a mute choice
function enableGameSounds(confirm = false) {
  if (ui.sound.getAttribute("aria-pressed") !== "true") return;
  //JT-2026/11/24 - warm up the voice clip before the first cast
  prepareAlmightyPushVoice();
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    soundContext ??= new AudioContext();
    soundContext.resume().then(() => {
      if (confirm) tone("start");
      startFightMusic();
    }).catch(() => {});
  }
  prepareSoundEffects();
  startFightMusic();
}

//JT-2026/11/23 - charge super and play the opening cue while juan prays
function updateAuraCharge(playerMove, dt) {
  const { player } = game;
  if (playerMove || player.y || player.velocity || !canAct(player) || !hasInput("auraCharge") || game.superCharge >= SUPER_MAX) {
    if (player.auraTime > 0) stopPraySound();
    player.auraTime = 0;
    return;
  }
  if (!player.auraTime && dt > 0) playRecordedSound("auraCharge");
  // Allow for floating-point drift when a frame lands exactly on a charge unit.
  const previous = Math.floor(player.auraTime * AURA_CHARGE_RATE + 1e-7);
  player.auraTime += dt;
  const gain = Math.floor(player.auraTime * AURA_CHARGE_RATE + 1e-7) - previous;
  if (gain) setSuperCharge(game.superCharge + gain);
}

//JT-2026/11/23 - stop the pray cue when the player leaves the charging pose
function stopPraySound() {
  const recording = soundRecordings.get("auraCharge");
  if (!recording) return;
  if (activeSoundNodes.delete(recording.source)) recording.source.stop();
  recording.source = null;
  recording.clip?.pause();
}

//JT-2026/11/23 - show each arena once with the levels that use it
function makeArenaPreviews() {
  const levelsByArena = new Map();
  OPPONENTS.forEach((opponent, index) => {
    const backdrop = opponent.backdrop ?? "tondo";
    if (!levelsByArena.has(backdrop)) levelsByArena.set(backdrop, []);
    levelsByArena.get(backdrop).push(levelNumber(index + 1));
  });

  for (const [backdrop, levels] of levelsByArena) {
    const item = document.createElement("li");
    const preview = document.createElement("img");
    preview.alt = "";
    preview.loading = "lazy";
    preview.decoding = "async";
    preview.width = 480;
    preview.height = 270;
    preview.src = `assets/arcade/previews/${backdrop}_0.jpg`;

    const caption = document.createElement("div");
    caption.className = "arena-caption";
    const name = document.createElement("h3");
    name.textContent = ARENA_LOCATIONS[backdrop];
    const stages = document.createElement("p");
    stages.textContent = `${levels.length === 1 ? "Level" : "Levels"} ${levels.join(", ")}`;

    caption.append(name, stages);
    item.append(preview, caption);
    ui.arenaGallery.append(item);
  }
}
