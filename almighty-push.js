"use strict";

//JT-2026/11/24 - use the hero three sprite sheet for the shared cast and voice timing
const ALMIGHTY_PUSH = {
  id: "hero_3",
  frame: { width: 372, height: 314, x: 110, y: 248, scale: 1.5 },
  bars: 2,
  impact: 2.05,
  soundEnd: 2.49,
  landingStart: 2.94,
  duration: 3.22,
  sound: { file: "almighty_push_preview.wav", volume: .44 },
};
let almightyPushVoice;

//JT-2026/11/24 - sequence the hero three cast and hold its expanding wave before landing
function almightyPushPose(elapsed) {
  const { impact, soundEnd, landingStart, duration } = ALMIGHTY_PUSH;
  if (elapsed >= soundEnd && elapsed < landingStart) return [2, 0];
  const phases = [[impact, 7], [impact + (soundEnd - impact) * .28, 2], [soundEnd, 1], [duration, 2]];
  let row = phases.findIndex(([end]) => elapsed < end);
  if (row === -1) row = phases.length - 1;
  const start = row === 3 ? landingStart : row ? phases[row - 1][0] : 0;
  const [end, frames] = phases[row];
  const column = Math.min(frames - 1, Math.floor((elapsed - start) * frames / (end - start)));
  return [row, column];
}

//JT-2026/11/24 - preload the shared voice clip when combat audio is prepared
function prepareAlmightyPushVoice() {
  if (almightyPushVoice || typeof Audio !== "function") return;
  almightyPushVoice = new Audio("assets/" + ALMIGHTY_PUSH.sound.file);
  almightyPushVoice.preload = "auto";
  almightyPushVoice.volume = ALMIGHTY_PUSH.sound.volume;
}

//JT-2026/11/24 - resume the voice only while the cast is inside the audio window
function resumeAlmightyPushVoice(attack) {
  if (attack?.kind !== "almightyPush" || attack.elapsed >= ALMIGHTY_PUSH.soundEnd || document.hidden) return;
  prepareAlmightyPushVoice();
  if (!almightyPushVoice || almightyPushVoice.error) return;
  const voice = { clip: almightyPushVoice, started: false, stalled: 0 };
  attack.voice = voice;
  voice.clip.currentTime = attack.elapsed;
  voice.clip.play()
    .then(() => { voice.started = true; })
    .catch(() => { if (attack.voice === voice) attack.voice = null; });
}

//JT-2026/11/24 - detach the sound so a muted cast can still finish
function pauseAlmightyPushVoice(attack) {
  if (!attack?.voice) return;
  attack.voice.clip.pause();
  attack.voice = null;
}

//JT-2026/11/24 - follow the voice through the blast and advance the landing after it ends
function advanceAlmightyPush(attack, dt) {
  const voice = attack.voice;
  if (voice) {
    if (voice.started && voice.clip.ended) {
      attack.elapsed = ALMIGHTY_PUSH.soundEnd;
      attack.voice = null;
      return;
    }
    if (voice.started && voice.clip.currentTime > attack.elapsed) {
      attack.elapsed = voice.clip.currentTime;
      voice.stalled = 0;
      return;
    }
    voice.stalled += dt;
    if (voice.stalled < .65) return;
    pauseAlmightyPushVoice(attack);
  }
  attack.elapsed += dt;
}

//JT-2026/11/24 - lift juan through the blast and ease him back to the floor after the hold
function almightyPushLift(elapsed) {
  const { impact, landingStart, duration } = ALMIGHTY_PUSH;
  const rise = Math.max(0, Math.min(1, 1 - (impact - elapsed) / .22));
  const descent = Math.max(0, Math.min(1, (elapsed - landingStart) / (duration - landingStart)));
  return 26 * rise * (1 - descent ** 2);
}
