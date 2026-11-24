"use strict";

//JT-2026/11/24 - share short attack cues between arena and survival
const MONSTER_AUDIO = {
  monsterVehicle: { file: "rsf_studios-car-crash-swerving-and-crash-592672.mp3", offset: .36, duration: .6, volume: .19 },
  monsterImpact: { file: "dragon-studio-boom-copyright-free-487662.mp3", offset: 0, duration: .48, volume: .27 },
  monsterGrunt: { file: "freesound_community-ough-47202.mp3", offset: .36, duration: .44, volume: .26 },
  monsterCash: { file: "modestas123123-cash-register-kaching-sound-effect-125042.mp3", offset: .5, duration: .85, volume: .55 },
  monsterGavel: { file: "hammer.mp3", offset: 1.68, duration: .24, volume: .64 },
};

//JT-2026/11/24 - match each monster to a cue for its attack
const MONSTER_ATTACK_CUES = {
  kamote_rider_0: "monsterVehicle",
  lubak_sa_daan_0: "monsterImpact",
  ebike_0: "monsterVehicle",
  snatcher_0: "monsterGrunt",
  kahirapan_0: "monsterImpact",
  adik_0: "monsterGrunt",
  lipunan_0: "monsterGrunt",
  traffic_0: "monsterVehicle",
  inflation_0: "monsterCash",
  bossy_0: "monsterImpact",
  congressman_0: "monsterGrunt",
  baha_0: "monsterImpact",
  mayabang_0: "monsterVehicle",
  injustice_0: "monsterGavel",
  matapobre_0: "monsterGrunt",
  gasoline_0: "monsterImpact",
  billing_0: "monsterCash",
  stress_0: "monsterGrunt",
  emotional_damage_0: "monsterImpact",
  loans_0: "monsterCash",
};
